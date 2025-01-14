import { randomUUID } from 'crypto';
import { Request } from 'express';
import type { Params } from 'nestjs-pino';
import { DestinationStream, multistream } from 'pino';
import type { Options } from 'pino-http';

const passUrl = new Set(['/health']);

export const genReqId = (req: any) =>
  <string>req.headers['X-Request-Id'] || randomUUID();
export const loggerOptions = <Params>{
  pinoHttp: <[Options<Request>, DestinationStream]>[
    {
      quietReqLogger: true,
      ...(process.env.NODE_ENV === 'production'
        ? {}
        : {
            level: 'debug',
            transport: {
              target: 'pino-pretty',
              options: { sync: true, singleLine: true },
            },
          }),
      autoLogging: {
        ignore: (req) => passUrl.has(req.originalUrl),
      },
      customProps: (req) => req.route,
    },
    multistream(
      [
        { level: 'debug', stream: process.stdout },
        { level: 'error', stream: process.stderr },
        { level: 'fatal', stream: process.stderr },
      ],
      { dedupe: true },
    ),
  ],
};
