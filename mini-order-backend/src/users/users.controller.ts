// src/users/users.controller.ts
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  BadRequestException,
  UseGuards,
  Req,
  Query,
  Get,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import {
  IRegisterParams,
  ILoginParams,
  IUpdateUserInfoParams,
  IResetPasswordParams,
} from '@shared/interfaces';
import { JwtGuard } from '../auth/jwt-auth.guard';
import { GetBalanceTransactionsDto } from './dto/get-balance-transactions.dto';
import type { Request as RequestType } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('info')
  @UseGuards(JwtGuard)
  async getUserProfile(@Request() req) {
    // 从 Authorization 头中提取 token
    return req.user;
  }

  @Post('register')
  public register(@Body() data: IRegisterParams, @Req() req: RequestType) {
    return this.usersService.register(data, req);
  }
  @Post('send-register-code')
  async sendRegisterCode(@Body() body: { email: string }) {
    return this.authService.sendRegisterCode(body.email);
  }

  @Post('login')
  async login(@Body() body: ILoginParams, @Req() req: RequestType) {
    return this.usersService.loginUser(body.email, body.password, req);
  }
  @UseGuards(JwtGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: IUpdateUserInfoParams,
    @Req() req: RequestType,
  ) {
    return this.usersService.updateUser(Number(id), body, req);
  }

  @Post('send-password-reset-email')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: IResetPasswordParams) {
    if (!body.code || !body.newPassword) {
      throw new BadRequestException('Token and new password must be provided');
    }
    return this.authService.resetPassword({
      email: body.email,
      code: body.code,
      password: body.newPassword,
    });
  }
  /**
   * 获取当前用户的余额使用记录
   * @param req 请求对象（包含用户信息）
   * @param query 查询参数（分页）
   * @returns 余额交易列表
   */
  @UseGuards(JwtGuard)
  @Get('balance-transactions')
  async getBalanceTransactions(
    @Req() req,
    @Query() query: GetBalanceTransactionsDto,
  ) {
    const user = req.user as any; // 根据您的用户类型调整
    return this.usersService.getBalanceTransactions(user.userId, query);
  }
}
