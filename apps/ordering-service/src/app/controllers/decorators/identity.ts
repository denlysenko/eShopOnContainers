import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Identity = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const authorization = ctx.switchToHttp().getRequest().headers[
      'authorization'
    ];

    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authorization.split('Bearer ')[1];
    const decoded = jwt.decode(token);

    return decoded.sub;
  }
);
