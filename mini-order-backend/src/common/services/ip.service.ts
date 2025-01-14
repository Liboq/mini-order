import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { create } from 'node-ip2region';

@Injectable()
export class IpService implements OnModuleInit {
  private searcher: any;

  async onModuleInit() {
    try {
      const dbPath = join(process.cwd(), 'data', 'ip2region.xdb');
      this.searcher = await create(dbPath);
    } catch (error) {
      console.error('IP2Region 初始化失败:', error);
      // 打印更详细的错误信息
      console.error('错误详情:', error.stack);
    }
  }

  async parseIp(ip: string): Promise<string> {
    try {
      if (!ip || ip === '::1' || ip === 'localhost') {
        return '本地开发环境';
      }

      // 处理 IPv4-mapped IPv6 地址
      if (ip.includes('::ffff:')) {
        ip = ip.split('::ffff:')[1];
      }

      if (!this.searcher) {
        return '未知地址';
      }

      const result = await this.searcher.search(ip);
      if (result) {
        // 格式化地理位置信息
        const parts = result
          .split('|')
          .filter((part) => part && part !== '0')
          .join('-');
        return parts || '未知地址';
      }
    } catch (error) {
      console.error('IP解析错误:', error);
    }
    return '未知地址';
  }
}
