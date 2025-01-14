import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Module({
  providers: [StoresService, NotificationsGateway],
  controllers: [StoresController],
})
export class StoresModule {}
