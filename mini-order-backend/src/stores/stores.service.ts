// src/stores/stores.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class StoresService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * 创建一个新的店铺
   *
   * @param userId 用户ID
   * @param name 店铺名称
   * @param description 店铺描述
   * @returns 创建的店铺对象
   */
  async createStore(userId: number, name: string, description: string) {
    return this.prisma.store.create({
      data: {
        name,
        description,
        userId,
      },
    });
  }
  /**
   * 获取用户选择的店铺列表
   *
   * @param userId 用户ID
   * @returns 返回用户选择的店铺列表
   */
  async getUserSelectedStores(userId: number) {
    return this.prisma.store.findMany({
      where: {
        memberships: {
          some: {
            userId,
            status: 'accepted', // 仅包含已接受的会员关系
          },
        },
        NOT: {
          userId: userId, // 排除自己拥有的店铺
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        menuItems: {
          include: {
            image: true,
          },
        },
        memberships: {
          where: {
            userId,
            status: 'accepted',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }
  /**
   * 更新商店信息
   *
   * @param storeId 商店ID
   * @param name 商店名称（可选）
   * @param description 商店描述（可选）
   * @returns 更新后的商店信息
   */
  async updateStore(storeId: number, name?: string, description?: string) {
    return this.prisma.store.update({
      where: { id: storeId },
      data: { name, description },
    });
  }
  /**
   * 根据商店ID获取商店信息
   *
   * @param storeId 商店ID
   * @returns 返回商店信息对象，如果商店不存在则抛出异常
   * @throws 抛出HttpException异常，错误码为500，错误消息为'Store not found'
   */
  async getStoreById(storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new HttpException('Store not found', 500);
    }

    return store;
  }
  /**
   * 请求加入商店
   *
   * @param userId 用户ID
   * @param storeId 商店ID
   * @returns 返回创建的会员信息
   * @throws HttpException 如果商店不存在，则抛出500错误
   * @throws HttpException 如果用户已经申请或已经是会员，则抛出500错误
   */
  async requestJoinStore(userId: number, storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      throw new HttpException('Store not found', 500);
    }

    // 检查用户是否已经申请或加入
    const existingMembership = await this.prisma.membership.findFirst({
      where: { userId, storeId },
    });
    if (existingMembership) {
      throw new HttpException('Already requested or a member', 500);
    }

    return this.prisma.membership.create({
      data: {
        userId,
        storeId,
        status: 'pending',
      },
    });
  }
  /**
   * 更新会员状态
   *
   * @param storeId 店铺ID
   * @param userId 用户ID
   * @param accept 是否接受请求
   * @returns 更新后的会员信息
   * @throws 如果未找到待处理的会员请求，则抛出 HttpException 异常
   */
  async updateMembership(storeId: number, userId: number, accept: boolean) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, storeId, status: 'pending' },
    });
    if (!membership) {
      throw new HttpException('Membership request not found', 500);
    }

    const updatedMembership = await this.prisma.membership.update({
      where: { id: membership.id },
      data: { status: accept ? 'accepted' : 'rejected' },
    });

    // 获取店铺信息以获取店主ID
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    // 通知店主和用户
    this.notificationsGateway.notifyUser(
      userId,
      `Your request to join store ${storeId} was ${accept ? 'accepted' : 'rejected'}`,
    );
    this.notificationsGateway.notifyUser(
      store.userId,
      `User ${userId} has ${accept ? 'joined' : 'been rejected from'} your store`,
    );

    return updatedMembership;
  }

  /**
   * 根据名称模糊搜索店铺
   * @param name 店铺名称
   */
  async searchStoresByName(name: string, userId: number) {
    const stores = await this.prisma.store.findMany({
      where: {
        name: {
          contains: name.toLowerCase(),
        },
      },
      include: {
        user: {
          include: {
            avatar: true,
          },
        },
        memberships: {
          where: {
            userId: userId,
          },
          select: {
            status: true,
          },
        },
      },
    });
    return stores.map((store) => ({
      ...store,
      userStatus:
        store.memberships.length > 0 ? store.memberships[0].status : null,
    }));
  }

  /**
   * 分页查询店铺
   * @param page 当前页数
   * @param pageSize 每页数量
   */
  async paginateStores(page: number, pageSize: number, name: string) {
    const skip = (page - 1) * pageSize;
    const [stores, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          name: {
            contains: name.toLowerCase(),
          },
        },
      }),
      this.prisma.store.count(),
    ]);

    return {
      data: stores,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  async getUserMembership(storeId: number) {
    return this.prisma.membership.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        store: true,
      },
    });
  }
  /**
   * 获取用户所有商铺现有菜单的销售排行榜前五
   * @param userId 用户ID
   */
  // src/stores/stores.service.ts
  async getTopFiveMenuItemsForUserStores(userId: number) {
    // 获取用户关联的所有商铺ID
    const stores = await this.prisma.store.findMany({
      where: {
        OR: [
          {
            memberships: {
              some: {
                userId,
                status: 'accepted', // 仅包含已接受的会员关系
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const storeIds = stores.map((store) => store.id);

    if (storeIds.length === 0) {
      return [];
    }

    // 获取所有相关商铺的菜单项，并统计销售数量
    const topMenuItems = await this.prisma.menuItem.findMany({
      where: {
        storeId: { in: storeIds },
      },
      include: {
        _count: {
          select: { orderItems: true },
        },
        image: true,
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: 5, // 只取前五个
    });

    // 格式化返回数据
    return topMenuItems.map((item) => ({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      image: item.image,
      storeId: item.storeId,
      salesCount: item._count.orderItems,
    }));
  }
}
