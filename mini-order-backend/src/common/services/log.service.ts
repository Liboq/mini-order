import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import type { Request } from 'express';
import { IpService } from './ip.service';

@Injectable()
export class LogService {
  constructor(
    private prisma: PrismaService,
    private ipService: IpService,
  ) {}

  async log(params: {
    userId?: number;
    adminId?: number;
    action: string;
    module: string;
    description: string;
    req: Request;
  }) {
    const { userId, adminId, action, module, description, req } = params;
    const ip = this.getClientIp(req);
    const area = await this.ipService.parseIp(ip);

    return this.prisma.operationLog.create({
      data: {
        userId,
        adminId,
        action,
        module,
        description,
        ip,
        area,
        userAgent: req.headers['user-agent'] || '',
      },
    });
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      ''
    );
  }
}
