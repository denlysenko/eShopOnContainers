import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Identity = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const token = ctx.switchToHttp().getRequest().headers['authorization'];
    const decoded = jwt.decode(token);

    return decoded.sub;
  }
);
