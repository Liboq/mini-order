// src/auth/auth.service.ts
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/mail.service';
import { AuthModule } from './auth.module';
@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthModule.name);
  constructor(
    private prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async sendPasswordResetEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', 500);
    }
    this.emailService.sendVerificationCode(email);
  }

  async sendRegisterCode(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new HttpException('User is already exist', 500);
    }
    this.emailService.sendVerificationCode(email);
  }
  async resetPassword(createUserDto: {
    email: string;
    code: string;
    password: string;
  }) {
    // 1. 检查用户是否已注册
    this.logger.log('register');

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (!existingUser) {
      throw new HttpException('Email no current', 500);
    }

    await this.emailService.validateCode({
      email: createUserDto.email,
      verificationCode: createUserDto.code,
    });

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. 更新用户
    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: createUserDto.email,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });

    return 'Reset password successful! Please verify your email.';
  }
}
