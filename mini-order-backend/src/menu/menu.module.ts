import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [MenuService, PrismaService],
  controllers: [MenuController],
})
export class MenuModule {}
