import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { userRepository } from 'src/DB';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: userRepository, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

   
    const { token, secret } = this.Authountcation(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
   
      const { userId } = await this.jwtService.verifyAsync(token, { secret });

      
      const user = await this.userRepo.findOne({
        filter: { _id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

     
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private Authountcation(request: Request): { token: string; secret: string } {
    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');

    const [prefix, token] = authHeader.split(' ');
    if (!token) throw new UnauthorizedException('Token not found');

    let secret = '';

    switch (prefix.toLowerCase()) {
      case 'admin':
        secret = process.env.ACCSESS_TOKENADMIN!;
        break;
      case 'bearer':
        secret = process.env.ACCSESS_TOKENUSER!;
        break;
      default:
        throw new BadRequestException('Prefix must be Admin or Bearer');
    }

    return { token, secret };
  }
}
