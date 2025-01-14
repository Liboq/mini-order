// src/menu/menu.controller.ts
import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { AuthGuard } from '@nestjs/passport';
import { IMenuCreateParams, IMenuUpdateParams } from '@shared/interfaces';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  async createMenuItem(
    @Request() req,
    @Body()
    body: IMenuCreateParams,
  ) {
    // 确保只有店主可以添加菜单项
    const store = await this.menuService.getStoreById(body.storeId);

    if (store.userId !== req.user.id) {
      throw new HttpException('Only the store owner can add menu items', 500);
    }
    return this.menuService.createMenuItem(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateMenuItem(
    @Request() req,
    @Param('id') menuItemId: string,
    @Body()
    body: IMenuUpdateParams,
  ) {
    // 确保只有店主可以更新菜单项
    const menuItem = await this.menuService.getMenuItemById(Number(menuItemId));
    const store = await this.menuService.getStoreById(menuItem.storeId);
    if (store.userId !== req.user.id) {
      throw new BadRequestException(
        'Only the store owner can update menu items',
      );
    }
    return this.menuService.updateMenuItem(Number(menuItemId), body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteMenuItem(@Request() req, @Param('id') menuItemId: string) {
    // 确保只有店主可以删除菜单项
    const menuItem = await this.menuService.getMenuItemById(Number(menuItemId));
    const store = await this.menuService.getStoreById(menuItem.storeId);
    if (store.userId !== req.user.id) {
      throw new BadRequestException(
        'Only the store owner can delete menu items',
      );
    }
    return this.menuService.deleteMenuItem(Number(menuItemId));
  }

  @Get('store/:storeId')
  async getMenuItemsByStore(@Param('storeId') storeId: string) {
    return this.menuService.getMenuItemsByStore(Number(storeId));
  }
}
