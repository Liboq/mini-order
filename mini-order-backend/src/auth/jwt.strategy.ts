// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'nestjs-prisma';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // 确保在 .env 文件中设置 JWT_SECRET
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
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

    if (!user) {
      throw new UnauthorizedException();
    }

    // 删除敏感信息
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
