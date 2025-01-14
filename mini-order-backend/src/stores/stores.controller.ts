// src/stores/stores.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Get,
  Query,
  HttpException,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { AuthGuard } from '@nestjs/passport';
import { IStoreCreateParams, IStoreJoinParams } from '@shared/interfaces';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createStore(@Request() req, @Body() body: IStoreCreateParams) {
    return this.storesService.createStore(
      req.user.id,
      body.name,
      body.description,
    );
  }

  @Get('user-memberships')
  @UseGuards(AuthGuard('jwt'))
  async getUserMemberships(@Request() req) {
    if (!req.user.store) {
      throw new HttpException('User does not have a store', 500);
    }
    return this.storesService.getUserMembership(req.user.store.id);
  }

  @Post('update-membership')
  @UseGuards(AuthGuard('jwt'))
  async updateMembership(@Request() req, @Body() body: IStoreJoinParams) {
    // 确保只有店主可以处理请求
    const store = await this.storesService.getStoreById(Number(body.storeId));
    if (store.userId !== req.user.id) {
      throw new HttpException('Only the store owner can handle requests', 500);
    }
    return this.storesService.updateMembership(
      Number(body.storeId),
      body.userId,
      body.accept,
    );
  }

  /**
   * 查询所有符合名称条件的店铺
   * GET /stores/search?name=店铺名称
   */
  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchStores(@Query('name') name: string, @Request() req) {
    return this.storesService.searchStoresByName(name, req.user.id);
  }

  /**
   * 分页查询店铺
   * GET /stores/paginate?page=1&pageSize=10
   */
  @Get('paginate')
  @UseGuards(AuthGuard('jwt'))
  async paginateStores(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('name') name: string,
  ) {
    if (!name) {
      return [];
    }
    return this.storesService.paginateStores(page, pageSize, name);
  }

  @Post(':id/join')
  @UseGuards(AuthGuard('jwt'))
  async requestJoinStore(@Request() req, @Param('id') storeId: string) {
    return this.storesService.requestJoinStore(req.user.id, Number(storeId));
  }

  @Post('/update')
  @UseGuards(AuthGuard('jwt'))
  async updateStore(
    @Request() req,
    @Body() body: { name?: string; description?: string },
  ) {
    if (!req.user.store) {
      throw new HttpException('User does not have a store', 500);
    }
    return this.storesService.updateStore(
      req.user.store.id,
      body.name,
      body.description,
    );
  }

  /**
   * 查询当前用户选择的所有店铺
   * GET /stores/user-selected
   */
  @Get('user-selected')
  @UseGuards(AuthGuard('jwt'))
  async getUserSelectedStores(@Request() req) {
    return this.storesService.getUserSelectedStores(req.user.id);
  }

  /**
   * 获取用户所有商铺现有菜单的销售排行榜前五
   * GET /stores/top-menu-items
   */
  @Get('top-menu-items')
  @UseGuards(AuthGuard('jwt'))
  async getTopMenuItems(@Request() req) {
    return this.storesService.getTopFiveMenuItemsForUserStores(req.user.id);
  }
}
