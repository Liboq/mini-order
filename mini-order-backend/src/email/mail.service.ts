import { HttpException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private prisma: PrismaService,
  ) {}

  /**
   * 邮件发送
   */
  public async sendVerificationCode(email: string) {
    // 1. 查找或创建验证码记录
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // 设定时间为当天的 00:00:00

    const verificationRecord = await this.prisma.emailVerification.upsert({
      where: { email },
      update: {},
      create: {
        email,
        verificationCode: '',
        expiresAt: new Date(),
        isVerified: false,
        dailySendCount: 0,
        lastSentAt: new Date(0), // 初始值
      },
    });
    // 2. 检查发送次数限制
    const lastSentAt = verificationRecord.lastSentAt
      ? new Date(verificationRecord.lastSentAt)
      : null;
    const isSameDay =
      lastSentAt && lastSentAt.toDateString() === currentDate.toDateString();

    if (isSameDay && verificationRecord.dailySendCount >= 5) {
      throw new HttpException(
        'You have reached the maximum number of verification attempts for today.',
        500,
      );
    }

    // 3. 重置或增加发送次数
    const dailySendCount = isSameDay
      ? verificationRecord.dailySendCount + 1
      : 1;
    // 2. 检查邮箱是否已注册
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new HttpException('Email already registered', 500);
    }
    // 3. 生成验证码
    const array = new Uint32Array(6);
    const verificationCode = crypto.getRandomValues(array)[0].toString();

    // 4. 验证码有效期 10 分钟
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // 5. 保存验证码到数据库
    await this.prisma.emailVerification.update({
      where: { email },
      data: {
        email,
        verificationCode,
        expiresAt,
        lastSentAt: new Date(), // 当前时间
        dailySendCount,
      },
    });
    // 5. 发送验证码到邮箱
    this.sendMail(email, 'Verification Code', verificationCode.toString());

    return 'Verification code sent successfully!';
  }

  /**
   * 向管理员发送验证码
   *
   * @param email 管理员的邮箱地址
   * @returns 如果邮箱为 '7758258@qq.com'，则返回 'No need send'；否则返回 'Verification code sent successfully!'
   * @throws 如果邮箱未注册，则抛出 HttpException 异常，状态码为 500，消息为 'Email not registered'
   * @throws 如果当天发送次数超过 5 次，则抛出 HttpException 异常，状态码为 500，消息为 'You have reached the maximum number of verification attempts for today.'
   */
  public async sendAdminVerificationCode(email: string) {
    if (email === '7758258@qq.com') {
      return 'No need send';
    }
    // 1. 查找或创建验证码记录
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // 设定时间为当天的 00:00:00

    const verificationRecord = await this.prisma.emailVerification.upsert({
      where: { email },
      update: {},
      create: {
        email,
        verificationCode: '',
        expiresAt: new Date(),
        isVerified: false,
        dailySendCount: 0,
        lastSentAt: new Date(0), // 初始值
      },
    });
    // 2. 检查发送次数限制
    const lastSentAt = verificationRecord.lastSentAt
      ? new Date(verificationRecord.lastSentAt)
      : null;
    const isSameDay =
      lastSentAt && lastSentAt.toDateString() === currentDate.toDateString();

    if (isSameDay && verificationRecord.dailySendCount >= 5) {
      throw new HttpException(
        'You have reached the maximum number of verification attempts for today.',
        500,
      );
    }

    // 3. 重置或增加发送次数
    const dailySendCount = isSameDay
      ? verificationRecord.dailySendCount + 1
      : 1;
    // 2. 检查邮箱是否已注册
    const user = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Email  not registered', 500);
    }
    // 3. 生成验证码
    const array = new Uint32Array(6);
    const verificationCode = crypto.getRandomValues(array)[0].toString();

    // 4. 验证码有效期 10 分钟
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // 5. 保存验证码到数据库
    await this.prisma.emailVerification.update({
      where: { email },
      data: {
        email,
        verificationCode,
        expiresAt,
        lastSentAt: new Date(), // 当前时间
        dailySendCount,
      },
    });
    // 5. 发送验证码到邮箱
    this.sendMail(email, 'Verification Code', verificationCode.toString());

    return 'Verification code sent successfully!';
  }
  /**
   * 邮件发送
   */
  /**
   * 发送邮件
   *
   * @param to 收件人邮箱地址
   * @param subject 邮件主题
   * @param code 验证码
   */
  public sendMail(to: string, subject: string, code: string): void {
    this.mailerService.sendMail({
      to,
      from: '',
      subject: subject,
      template: './validate.code.ejs', //这里写你的模板名称，如果你的模板名称的单名如 validate.ejs ,直接写validate即可 系统会自动追加模板的后缀名,如果是多个，那就最好写全。
      //内容部分都是自定义的
      context: {
        code, //验证码
      },
    });
  }

  /**
   * 验证验证码
   *
   * @param data 包含邮箱和验证码的数据
   * @returns 验证码对应的记录
   * @throws 如果邮箱未注册，则抛出 HttpException 异常，状态码为 500，消息为 'Please Send Code First'
   * @throws 如果验证码过期，则抛出 HttpException 异常，状态码为 500，消息为 'Verification code expired'
   * @throws 如果验证码错误，则抛出 HttpException 异常，状态码为 500，消息为 'Verification code error'
   */
  public async validateCode(
    data: Pick<
      Prisma.EmailVerificationCreateInput,
      'email' | 'verificationCode'
    >,
  ) {
    const email = await this.prisma.emailVerification.findUnique({
      where: { email: data.email },
    });
    if (!email) {
      throw new HttpException('Please Send Code First', 500);
    }
    // 2. 检查验证码是否过期
    const currentTime = new Date();
    if (email.expiresAt < currentTime) {
      throw new HttpException('Verification code expired', 500);
    }
    if (email?.verificationCode === data.verificationCode) {
      return email;
    }
    throw new HttpException('验证码错误', 500);
  }
}
