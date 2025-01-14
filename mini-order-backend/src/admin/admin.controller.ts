import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/login.dto';
import { PaginationQueryDto } from './dto/query.dto';
import { AdminGuard } from './guards/admin.guard';
import { Public } from '../decorators/public.decorator';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { EmailService } from 'src/email/mail.service';
import { CreateAdminDto } from './dto/admin.dto';
import { Request } from 'express';
import { LogQueryDto } from './dto/log-query.dto';
import { ILogResponse } from './interfaces/log.interface';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AdminRole } from './enums/role.enum';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly emailService: EmailService,
  ) {}
  @Public()
  @Post('register')
  register(@Body() registerDto: CreateAdminDto) {
    return this.adminService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: AdminLoginDto, @Req() req: Request) {
    return this.adminService.login(loginDto, req);
  }

  @Public()
  @Post('send-verification-code')
  sendVerificationCode(@Body('email') email: string) {
    return this.emailService.sendAdminVerificationCode(email);
  }
  @UseGuards(AdminGuard)
  @Get('users')
  getUsers(@Query() query: PaginationQueryDto) {
    return this.adminService.getUsers(query);
  }

  @UseGuards(AdminGuard)
  @Get('orders')
  getOrders(@Query() query: PaginationQueryDto) {
    return this.adminService.getOrders(query);
  }

  @UseGuards(AdminGuard)
  @Get('stores')
  getStores(@Query() query: PaginationQueryDto) {
    return this.adminService.getStores(query);
  }
  @Post('users')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  createUser(@Body() data: CreateUserDto, @Req() req: Request) {
    return this.adminService.createUser(data, req);
  }
  @Put('users/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.adminService.updateUser(+id, data);
  }

  @Delete('users/:id')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  @Post('stores')
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  createStore(@Body() data: CreateStoreDto) {
    return this.adminService.createStore(data);
  }
  @UseGuards(AdminGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Put('stores/:id')
  updateStore(@Param('id') id: string, @Body() data: UpdateStoreDto) {
    return this.adminService.updateStore(+id, data);
  }
  @UseGuards(AdminGuard, RolesGuard)
  @Delete('stores/:id')
  @Roles(AdminRole.SUPER_ADMIN)
  deleteStore(@Param('id') id: string) {
    return this.adminService.deleteStore(+id);
  }

  @UseGuards(AdminGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Put('orders/:id')
  updateOrder(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateOrder(+id, data);
  }
  @UseGuards(AdminGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @Delete('orders/:id')
  deleteOrder(@Param('id') id: string) {
    return this.adminService.deleteOrder(+id);
  }
  @UseGuards(AdminGuard)
  @Get('logs')
  /**
   * 获取操作日志列表
   *
   * @param query - 查询参数，包含分页、筛选条件等
   * @returns {Promise<ILogResponse>} 返回日志列表及分页信息
   *
   */
  getLogs(@Query() query: LogQueryDto): Promise<ILogResponse> {
    return this.adminService.getLogs(query);
  }

  @UseGuards(AdminGuard)
  @Get('logs/options')
  getLogOptions() {
    return this.adminService.getLogOptions();
  }
}
