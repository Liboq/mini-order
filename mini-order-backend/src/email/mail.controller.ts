import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';

import { EmailService } from './mail.service';
import { isValidEmail } from '../utils';

@Controller('mail')
export class MailController {
  private readonly logger: Logger = new Logger(MailController.name);
  constructor(private emailService: EmailService) {}

  @Post('send')
  public async sendMail(@Body('mail') mail: string) {
    if (!isValidEmail(mail)) {
      throw new HttpException('Invalid email', 500);
    }
    this.logger.log(`Sending mail...${mail}`);
    try {
      await this.emailService.sendVerificationCode(mail);
      return '邮箱发送成功';
    } catch (error) {
      this.logger.error('Error while sending mail');
      console.log(error);

      throw new HttpException('服务器正在开小差', 500);
    }
  }
}
