// src/users/users.service.ts
import {
  Injectable,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailController } from '../email/mail.controller';
import { EmailService } from '../email/mail.service';
import { IUpdateUserInfoParams } from '@shared/interfaces';
import { UploadService } from 'src/upload/upload.service';
import { GetBalanceTransactionsDto } from './dto/get-balance-transactions.dto';
import {
  BalanceTransactionDto,
  TransactionType,
} from './dto/balance-transaction.dto';
import { LogService } from 'src/common/services/log.service';
import type { Request } from 'express';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(MailController.name);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private readonly uploadService: UploadService,
    private logService: LogService,
  ) {}

  async getUserInfoFromToken(token: string) {
    try {
      // 解码 JWT token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // 根据解码后的 userId 查询用户信息
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: {
            // 包含关联的 Upload 表数据
            select: {
              id: true,
              filePath: true,
              httpUrl: true,
            },
          },
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return user;
    } catch (error) {
      console.log(error);
      // 处理 token 解析错误
      throw new BadRequestException('Invalid token');
    }
  }
  async getUserInfo(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: {
          // 包含 avatar 的详细信息
          select: {
            id: true,
            filePath: true,
            httpUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        // 如果需要包含其他关联字段，可以在这里添加
        // 例如：
        // emailVerification: true,
        store: true,
      },
    });
  }

  async register(
    createUserDto: {
      email: string;
      code: string;
      password: string;
    },
    req: Request,
  ) {
    // 1. 检查用户是否已注册
    this.logger.log('register');

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email already registered', 500);
    }
    // 验证验证码
    await this.emailService.validateCode({
      email: createUserDto.email,
      verificationCode: createUserDto.code,
    });

    // 2. 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. 创建用户
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.email,
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    // 创建与用户关联的商店
    await this.prisma.store.create({
      data: {
        name: `${user.name} 的商店`, // 根据需要自定义商店名称
        userId: user.id,
        // 如果需要，可以添加其他默认字段，如 description
      },
    });

    // 记录用户注册
    await this.logService.log({
      userId: user.id,
      action: 'REGISTER',
      module: 'USER',
      description: `新用户 ${user.email} 注册`,
      req,
    });

    return 'Registration successful! Please verify your email.';
  }

  async loginUser(email: string, password: string, req: Request) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_SECRET },
    );

    // 记录用户登录
    await this.logService.log({
      userId: user.id,
      action: 'LOGIN',
      module: 'USER',
      description: `用户 ${user.email} 登录系统`,
      req,
    });

    return { token };
  }

  async updateUser(userId: number, data: IUpdateUserInfoParams, req: any) {
    await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    // 记录资料更新
    await this.logService.log({
      userId,
      action: 'UPDATE',
      module: 'USER_PROFILE',
      description: `用户 ${req.user.email} 更新个人资料`,
      req,
    });

    return null;
  }

  /**
   * 获取用户的余额使用记录
   * @param userId 用户ID
   * @param query 查询参数（分页）
   * @returns 余额交易列表
   */
  async getBalanceTransactions(
    userId: number,
    query: GetBalanceTransactionsDto,
  ): Promise<{
    data: BalanceTransactionDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.balanceTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.balanceTransaction.count({
        where: { userId },
      }),
    ]);

    return {
      data: transactions.map((transaction) => ({
        ...transaction,
        type: transaction.type as unknown as TransactionType,
      })),
      total,
      page,
      limit,
    };
  }
}
