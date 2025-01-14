// src/orders/orders.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { IOrderCreateParams, IOrderQueryListParams } from '@shared/interfaces';
import { CreateOrderDto } from './dto/create-order.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new HttpException('Order not found', 500);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // 通知用户订单状态更新
    this.notificationsGateway.notifyUser(
      order.userId,
      `Your order ${orderId} status has been updated to ${status}`,
    );

    return updatedOrder;
  }

  /**
   * 获取订单列表，支持分页、状态和日期范围筛选
   * @param userId 用户ID
   * @param query 查询参数
   */
  async getOrders(userId: number, query: IOrderQueryListParams) {
    const { page = 1, pageSize = 10, status, startDate, endDate } = query;
    const skip = (page - 1) * pageSize;

    // 构建筛选条件
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // 查询订单
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          items: {
            include: {
              menuItem: {
                include: {
                  image: true,
                },
              },
            },
          },
          store: {
            include: {
              user: {
                select: {
                  avatar: true,
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取本人店铺的订单列表，支持分页、状态和日期范围筛选
   * @param userId 用户ID
   * @param query 查询参数
   */
  async getStoreOrders(userId: number, query: IOrderQueryListParams) {
    const { page = 1, pageSize = 10, status, startDate, endDate } = query;
    const skip = (page - 1) * pageSize;

    // 获取用户的店铺ID
    const store = await this.prisma.store.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!store) {
      return {
        orders: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const storeId = store.id;

    // 构建筛选条件
    const where: any = {
      storeId: storeId,
    };

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // 查询订单
    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          items: {
            include: {
              menuItem: {
                include: {
                  image: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          store: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({
        where,
      }),
    ]);

    return {
      orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  /**
   * 计算订单总价
   * @param items 订单项
   * @returns 总价
   */
  private async calculateTotalPrice(
    items: CreateOrderDto['items'],
  ): Promise<number> {
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });
    const menuItemMap = new Map<number, number>();
    menuItems.forEach((item) => {
      menuItemMap.set(item.id, item.price);
    });
    let total = 0;
    for (const item of items) {
      const price = menuItemMap.get(item.menuItemId);
      if (!price) {
        throw new HttpException(`菜单项 #${item.menuItemId} 不存在`, 500);
      }
      total += price * item.quantity;
    }
    return total;
  }

  /**
   * 创建订单
   * @param createOrderDto 创建订单的数据
   */
  async createOrder(userId: number, createOrderDto: IOrderCreateParams) {
    const { storeId, items } = createOrderDto;

    if (items.length === 0) {
      throw new HttpException('订单中至少需要一个商品', 500);
    }

    // 获取用户的当前余额
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new HttpException('用户不存在', 500);
    }
    // 计算总价
    const totalPrice = await this.calculateTotalPrice(items);

    // 检查用户余额是否足够
    if (user.balance < totalPrice) {
      throw new HttpException('余额不足以完成此次订单', 500);
    }

    // 使用事务创建订单、订单项并扣除用户余额
    const order = await this.prisma.$transaction(async (prisma) => {
      // 创建订单
      const createdOrder = await prisma.order.create({
        data: {
          userId,
          storeId,
          totalPrice,
          status: 'pending',
          items: {
            create: items.map(
              (item: { menuItemId: number; quantity: number }) => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
              }),
            ),
          },
        },
      });

      // 扣除用户余额
      await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: totalPrice,
          },
        },
      });
      // 创建用户的余额交易记录（DEBIT）
      await prisma.balanceTransaction.create({
        data: {
          userId,
          amount: totalPrice,
          type: TransactionType.DEBIT,
          description: `支付订单 #${createdOrder.id}`,
        },
      });
      // 假设获得者是店铺的所有者
      const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: { user: true },
      });
      if (!store || !store.user) {
        throw new HttpException('店铺或店铺所有者不存在', 500);
      }
      const recipientId = store.user.id;
      // 增加获得者余额
      await prisma.user.update({
        where: { id: recipientId },
        data: {
          balance: { increment: totalPrice },
        },
      });
      // 创建获得者的余额交易记录（CREDIT）
      await prisma.balanceTransaction.create({
        data: {
          userId: recipientId,
          amount: totalPrice,
          type: TransactionType.CREDIT,
          description: `收到订单 #${createdOrder.id} 支付`,
        },
      });

      return createdOrder;
    });

    return order;
  }
  /**
   * 获取订单详情
   * @param userId 用户ID
   * @param orderId 订单Id
   */
  async getOrderDetails(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                image: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: true,
      },
    });

    if (!order) {
      throw new HttpException('订单不存在', 500);
    }

    return order;
  }
}
