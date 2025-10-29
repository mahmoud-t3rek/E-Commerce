import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { UserModel, userRepository } from 'src/DB';

@Module({
  imports:[JwtModule.register({}),
    UserModel
  ],
  controllers: [AuthController],
  providers: [AuthService,userRepository,JwtService,AuthGuard]
})
export class AuthModule {}
