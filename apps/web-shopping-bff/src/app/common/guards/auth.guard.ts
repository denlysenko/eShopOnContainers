import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { request } from 'undici';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorization = context.switchToHttp().getRequest().headers[
      'authorization'
    ];

    if (!authorization || authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const tokenValid = await this._validateToken(authorization);

    if (!tokenValid) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private async _validateToken(token: string): Promise<boolean> {
    const introspectUrl = `${process.env.RESOURCE_SERVER_URL}/protocol/openid-connect/token/introspect`;
    const username = process.env.RESOURCE_SERVER_CLIENT_ID;
    const password = process.env.RESOURCE_SERVER_CLIENT_SECRET;
    const auth =
      'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    const response = await request(introspectUrl, {
      method: 'POST',
      headers: {
        authorization: auth,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ token }),
    });

    const body = await response.body.json();

    if (body.sub && body.iss === process.env.RESOURCE_SERVER_URL) {
      return true;
    }

    if (!body.active) {
      return false;
    }

    return true;
  }
}
