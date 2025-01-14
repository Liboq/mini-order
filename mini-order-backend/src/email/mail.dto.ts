import { Prisma } from '@prisma/client';
import { IsBoolean, IsOptional, IsString, IsEmail } from 'class-validator';

export class MailDto implements Prisma.EmailVerificationCreateInput {
  @IsEmail()
  public email!: string;

  @IsString()
  verificationCode!: string;

  @IsString()
  expiresAt!: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
