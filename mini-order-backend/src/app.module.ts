import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { configuration, loggerOptions } from './config';
import * as path from 'path';
import { PrismaModule } from 'nestjs-prisma';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          ignoreTLS: true,
          secure: true,
          service: 'qq',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: { rejectUnauthorized: false },
        },
        defaults: {
          from: process.env.EMAIL_FROM,
        },
        preview: false,
        template: {
          dir: path.join(process.cwd(), './src/email/template'),
          adapter: new EjsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    LoggerModule.forRoot(loggerOptions),
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => ({
        prismaOptions: {
          log: ['error'],
          datasources: {
            db: {
              url: process.env.DATABASE_URL,
            },
          },
        },
      }),
    }),
    UsersModule,
    StoresModule,
    MenuModule,
    OrdersModule,
    NotificationsModule,
    UploadModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway, JwtStrategy],
})
export class AppModule {}
