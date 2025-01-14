import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EmailService } from '../email/mail.service';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [AdminController],
  providers: [AdminService, EmailService, JwtService],
})
export class AdminModule {}
