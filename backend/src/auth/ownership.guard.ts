import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();

    const authenticatedUser = request.dbUser;
    const requestedUserId = request.params.userId;

    if (!authenticatedUser) {
      throw new ForbiddenException(
        'Authenticated user not found',
      );
    }

    if (authenticatedUser.id !== requestedUserId) {
      throw new ForbiddenException(
        'You can only access your own data',
      );
    }

    return true;
  }
}