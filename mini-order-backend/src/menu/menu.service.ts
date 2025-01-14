// src/menu/menu.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { IMenuCreateParams } from '@shared/interfaces';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getStoreById(storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new HttpException('Store not found', 500);
    }

    return store;
  }

  async getMenuItemById(menuItemId: number) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        image: true,
      },
    });

    if (!menuItem) {
      throw new HttpException('Menu item not found', 500);
    }

    return menuItem;
  }

  async createMenuItem(data: IMenuCreateParams) {
    return this.prisma.menuItem.create({
      data: {
        name: data.name,
        category: data.category,
        image: {
          connect: { id: data.imageId },
        },
        price: data.price,
        store: {
          connect: { id: data.storeId },
        },
        desc: data.desc,
      },
    });
  }

  async updateMenuItem(
    menuItemId: number,
    data: {
      name?: string;
      category?: string;
      imageId: number;
      price?: number;
    },
  ) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!menuItem) {
      throw new HttpException('Menu item not found', 500);
    }

    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data,
    });
  }

  async deleteMenuItem(menuItemId: number) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!menuItem) {
      throw new HttpException('Menu item not found', 500);
    }

    return this.prisma.menuItem.delete({
      where: { id: menuItemId },
    });
  }

  async getMenuItemsByStore(storeId: number) {
    return this.prisma.menuItem.findMany({
      where: { storeId },
      include: {
        image: true,
      },
    });
  }
}
