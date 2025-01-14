import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'nestjs-prisma';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  providers: [OrdersService, PrismaService, NotificationsGateway],
  controllers: [OrdersController],
})
export class OrdersModule {}
