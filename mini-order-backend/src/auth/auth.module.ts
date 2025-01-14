// src/auth/auth.module.ts
import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { EmailService } from '../email/mail.service';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [PassportModule],
  providers: [
    AuthService,
    JwtStrategy,
    EmailService,
    PrismaService,
    UsersService,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
