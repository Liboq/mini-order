// src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { IOrderCreateParams, IOrderQueryListParams } from '@shared/interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createOrder(
    @Request() req,
    @Body()
    body: IOrderCreateParams,
  ) {
    return this.ordersService.createOrder(req.user.id, body);
  }

  /**
   * 获取店铺订单列表
   *
   * @param req 请求对象，包含用户信息
   * @param query 查询参数，类型为IOrderQueryListParams
   * @returns 返回店铺订单列表
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('store-orders')
  async getStoreOrders(@Req() req, @Query() query: IOrderQueryListParams) {
    const userId = req.user.id;
    return this.ordersService.getStoreOrders(userId, query);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string },
  ) {
    return this.ordersService.updateOrderStatus(Number(orderId), body.status);
  }

  /**
   * 获取当前用户的订单列表
   * GET /orders
   */
  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async getUserOrders(@Request() req, @Query() query: IOrderQueryListParams) {
    return this.ordersService.getOrders(req.user.id, query);
  }

  /**
   * 获取当前用户的订单详情
   * GET /orders/:id
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUserOrderDetails(@Param('id', ParseIntPipe) orderId: number) {
    return this.ordersService.getOrderDetails(orderId);
  }
}
