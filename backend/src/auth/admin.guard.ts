import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.dbUser;

    if (!user) {
      throw new ForbiddenException(
        'Authenticated user not found',
      );
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Admin access required',
      );
    }

    return true;
  }
}