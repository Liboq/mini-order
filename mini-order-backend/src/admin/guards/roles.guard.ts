import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const adminId = request.user?.sub;

    if (!adminId) {
      return false;
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!admin) {
      return false;
    }

    // 超级管理员可以执行任何操作
    if (admin.role === AdminRole.SUPER_ADMIN) {
      return true;
    }

    return requiredRoles.includes(admin.role as AdminRole);
  }
}
