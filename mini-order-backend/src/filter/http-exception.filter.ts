// http.exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BusinessError, BusinessException } from './business.exception';
import { Request, Response } from 'express';

@Catch(HttpException) // 指定HttpException，只捕获所有http相关的异常
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus(); // 获取当前错误的状态码。由于所有http异常都继承自HttpException，所以这里可以拿到

    // 处理业务异常（主动抛出的异常）
    if (exception instanceof BusinessException) {
      const error = exception.getResponse() as BusinessError; // BusinessException 异常内部提供error, message属性
      response.status(HttpStatus.OK).send({
        data: null,
        code: error['code'],
        extra: {},
        message: error['message'],
        success: false,
        trace: +new Date(),
      });
      return;
    }
    response.status(status).send({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
      trace: +new Date(),
    });
  }
}
