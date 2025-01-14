import { Module } from '@nestjs/common';
import { LogService } from './services/log.service';
import { IpService } from './services/ip.service';

@Module({
  providers: [LogService, IpService],
  exports: [LogService, IpService],
})
export class CommonModule {}
