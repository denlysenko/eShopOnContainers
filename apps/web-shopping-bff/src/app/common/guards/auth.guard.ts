import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _logger = new Logger(AuthGuard.name);

  constructor(private readonly _httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorization = context.switchToHttp().getRequest().headers[
      'authorization'
    ];

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    try {
      const tokenValid = await this._validateToken(
        authorization.split('Bearer ')[1]
      );

      this._logger.debug(`Token validity: ${tokenValid}`);

      if (!tokenValid) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      this._logger.error(error);

      throw new UnauthorizedException();
    }
  }

  private async _validateToken(token: string): Promise<boolean> {
    const introspectUrl = `${process.env.RESOURCE_SERVER_URL}/protocol/openid-connect/token/introspect`;
    const username = process.env.RESOURCE_SERVER_CLIENT_ID;
    const password = process.env.RESOURCE_SERVER_CLIENT_SECRET;
    const host = process.env.KEYKLOAK_FRONTEND_HOST;
    const auth =
      'Basic ' + Buffer.from(username + ':' + password).toString('base64');

    this._logger.debug('Start checking token on IdP');

    const response = await this._httpService.post(
      introspectUrl,
      `token=${token}`,
      {
        headers: {
          authorization: auth,
          'content-type': 'application/x-www-form-urlencoded',
          host,
        },
      }
    );

    this._logger.debug('Checking token on IdP is over');

    if (response.statusCode !== HttpStatus.OK) {
      return false;
    }

    const body = await response.body.json();

    return body.active;
  }
}
