import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
  private readonly supabase: SupabaseService,
  private readonly prisma: PrismaService,
) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing authentication token',
      );
    }

    const token = authHeader.substring(7);

    const { data, error } =
      await this.supabase
        .getClient()
        .auth
        .getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException(
        'Invalid authentication token',
      );
    }

    request.user = data.user;
    const email = data.user.email;

    if (!email) {
      throw new UnauthorizedException(
        'Authenticated user email is required',
      );
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user?.googleId && user.googleId !== data.user.id) {
      throw new UnauthorizedException(
        'Authenticated identity does not match the user account',
      );
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            undefined,
          googleId: data.user.id,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: data.user.id },
      });
    }

    request.dbUser = user;
    return true;
  }
}