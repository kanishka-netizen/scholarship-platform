import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class ScraperAdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const expectedToken = this.config.get<string>('SCRAPER_ADMIN_TOKEN');

    if (!expectedToken || !authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const receivedToken = authorization.slice('Bearer '.length);
    const expectedBytes = Buffer.from(expectedToken, 'utf8');
    const receivedBytes = Buffer.from(receivedToken, 'utf8');

    if (
      expectedBytes.length !== receivedBytes.length ||
      !timingSafeEqual(expectedBytes, receivedBytes)
    ) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return true;
  }
}