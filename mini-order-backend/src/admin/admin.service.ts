import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from './dto/login.dto';
import { PaginationQueryDto } from './dto/query.dto';
import * as bcrypt from 'bcrypt';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { EmailService } from 'src/email/mail.service';
import { CreateAdminDto } from './dto/admin.dto';
import { LogService } from 'src/common/services/log.service';
import type { Request } from 'express';
import { LogQueryDto } from './dto/log-query.dto';
import { AdminRole } from './enums/role.enum';
import { AdminLoginResponse } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private logService: LogService,
  ) {}
  async register(createUserDto: CreateAdminDto) {
    return this.prisma.admin.create({
      data: {
        ...createUserDto,
        name: createUserDto.email.split('@')[0],
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
  }

  async login(loginDto: AdminLoginDto, req: any): Promise<AdminLoginResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!loginDto.code) {
      throw new HttpException('Verification code is required', 500);
    }
    if (loginDto.email !== '7758258@qq.com') {
      // 验证验证码
      await this.emailService.validateCode({
        email: loginDto.email,
        verificationCode: loginDto.code,
      });
    }
    if (loginDto.email === '7758258@qq.com') {
      // 一般管理员 默认验证码为 000000
      if (loginDto.code !== '000000') {
        throw new HttpException('Invalid credentials', 500);
      }
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 500);
    }

    // 记录登录操作
    await this.logService.log({
      adminId: admin.id,
      action: 'LOGIN',
      module: 'ADMIN',
      description: `管理员 ${admin.email} 登录系统`,
      req,
    });

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };
    console.log(payload);

    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
      role: admin.role as AdminRole,
    };
  }

  async getUsers(query: PaginationQueryDto) {
    const { page, pageSize, keyword } = query;
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    const [total, users] = await Promise.all([
      this.prisma.user.count({
        where: {
          name: {
            contains: keyword,
          },
        },
      }),
      this.prisma.user.findMany({
        skip,
        take,
        where: {
          name: {
            contains: keyword,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          points: true,
          balance: true,
          createdAt: true,
          address: true,
        },
      }),
    ]);

    return {
      total,
      items: users,
      page,
      pageSize,
    };
  }

  async getOrders(query: PaginationQueryDto) {
    const { page, pageSize, keyword } = query;
    // 确保分页参数是数字类型
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const [total, orders] = await Promise.all([
      this.prisma.order.count({
        where: {
          user: {
            name: {
              contains: keyword,
            },
          },
        },
      }),
      this.prisma.order.findMany({
        skip,
        take, // 使用转换后的数字
        where: {
          user: {
            name: {
              contains: keyword,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          store: {
            select: {
              name: true,
            },
          },
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      items: orders,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }

  async getStores(query: PaginationQueryDto) {
    const { page, pageSize, keyword } = query;
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);
    const [total, stores] = await Promise.all([
      this.prisma.store.count({
        where: {
          name: {
            contains: keyword,
          },
        },
      }),
      this.prisma.store.findMany({
        skip,
        take,
        where: {
          name: {
            contains: keyword,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      items: stores,
      page,
      pageSize,
    };
  }

  async createUser(data: CreateUserDto, req: Request) {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password || '123456', 10),
      },
    });

    // 记录创建用户操作
    await this.logService.log({
      adminId: req['user'].id, // 从请求中获取当前管理员ID
      action: 'CREATE',
      module: 'USER',
      description: `创建用户 ${user.email}`,
      req,
    });

    return user;
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async createStore(data: CreateStoreDto) {
    return this.prisma.store.create({
      data,
    });
  }

  async updateStore(id: number, data: UpdateStoreDto) {
    return this.prisma.store.update({
      where: { id },
      data,
    });
  }

  async deleteStore(id: number) {
    return this.prisma.store.delete({
      where: { id },
    });
  }

  async updateOrder(id: number, data: Partial<any>) {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async deleteOrder(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async getLogs(query: LogQueryDto) {
    const {
      page,
      pageSize,
      email,
      module,
      action,
      startDate,
      endDate,
      orderBy = 'createdAt',
      order = 'desc',
    } = query;

    // 确保分页参数是数字类型
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      AND: [
        // 如果提供了email，查询关联的用户或管理员
        email
          ? {
              OR: [
                {
                  user: {
                    email: {
                      contains: email,
                    },
                  },
                },
                {
                  admin: {
                    email: {
                      contains: email,
                    },
                  },
                },
              ],
            }
          : {},
        // 模块筛选
        module
          ? {
              module: {
                equals: module,
              },
            }
          : {},
        // 操作类型筛选
        action
          ? {
              action: {
                equals: action,
              },
            }
          : {},
        // 日期范围筛选
        startDate
          ? {
              createdAt: {
                gte: new Date(startDate),
              },
            }
          : {},
        endDate
          ? {
              createdAt: {
                lte: new Date(endDate),
              },
            }
          : {},
      ],
    };

    const [total, logs] = await Promise.all([
      this.prisma.operationLog.count({ where }),
      this.prisma.operationLog.findMany({
        skip,
        take,
        where,
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
          admin: {
            select: {
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
      }),
    ]);

    return {
      total,
      items: logs,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }

  // 获取所有可用的模块和操作类型
  async getLogOptions() {
    const [modules, actions] = await Promise.all([
      this.prisma.operationLog.findMany({
        select: {
          module: true,
        },
        distinct: ['module'],
      }),
      this.prisma.operationLog.findMany({
        select: {
          action: true,
        },
        distinct: ['action'],
      }),
    ]);

    return {
      modules: modules.map((m) => m.module),
      actions: actions.map((a) => a.action),
    };
  }

  // ... 其他方法保持不变
}
