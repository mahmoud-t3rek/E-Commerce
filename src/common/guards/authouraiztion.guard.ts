import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRole } from '../enums';
import { Access_Role } from 'src/module/decorators';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const access_roles: userRole[] = this.reflector.get<userRole[]>(Access_Role, context.getHandler());

      if (!access_roles.includes(req.user.role)) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
