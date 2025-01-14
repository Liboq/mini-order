import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from '../email/mail.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UploadService } from 'src/upload/upload.service';
import { LogService } from 'src/common/services/log.service';
import { IpService } from 'src/common/services/ip.service';

@Module({
  providers: [
    UsersService,
    EmailService,
    AuthService,
    JwtService,
    UploadService,
    LogService,
    IpService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
