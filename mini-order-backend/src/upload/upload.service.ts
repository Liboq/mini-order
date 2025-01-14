import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as COS from 'cos-nodejs-sdk-v5';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UploadService {
  private readonly cos: COS = new COS({
    SecretId: process.env.COS_SECRET_ID, // 密钥Id
    SecretKey: process.env.COS_SECRET_KEY, // 密钥Key
  });
  private readonly bucket: string = 'pikachu-2022-1305579406';
  private readonly region: string = 'ap-nanjing';
  private readonly prefixKey: string = '/mini-order';
  private readonly baseParams: COS.PutObjectParams = {
    Bucket: this.bucket, // 桶名称
    Region: this.region, // 桶的所属地域
    Body: undefined, // 上传的文件二进制流
    Key: '', // 文件在桶中的存储path，以及存储名称
  };

  constructor(private readonly prisma: PrismaService) {}

  // 新增
  async create(
    file,
  ): Promise<{ id: number; filePath: string; httpUrl: string }> {
    const params = Object.assign(this.baseParams, {
      Body: file.buffer,
      Key: `${this.prefixKey}/image/${Date.now()}-${file.originalname}`,
    });
    try {
      // 视频上传
      if (file.mimetype.includes('video')) {
        params.Key =
          `${this.prefixKey}/video/` + Date.now() + '-' + file.originalname;
      }
      // 音频上传
      if (file.mimetype.includes('audio')) {
        params.Key =
          `${this.prefixKey}/audio/` + Date.now() + '-' + file.originalname;
      }
      const res = await this.cos.putObject(params);

      // 保存上传信息到数据库
      const upload = await this.prisma.upload.create({
        data: {
          filePath: res.Location, // 假设 res.Location 是文件路径
          httpUrl: `https://cdn.youCdn.com/${params.Key}`, //cdn地址
        },
      });

      return {
        id: upload.id,
        filePath: upload.filePath,
        httpUrl: upload.httpUrl,
      };
    } catch (error) {
      console.log(error);
      await this.remove(params.Key);
      throw new HttpException('文件上传失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 删除
  async remove(key: string) {
    const params = Object.assign(this.baseParams, {
      Key: key,
    });
    const res = await this.cos.deleteObject(params);
    return res;
  }
}
