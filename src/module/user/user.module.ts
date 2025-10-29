import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel, userRepository } from 'src/DB';
import { OtpModel } from 'src/DB/models/otp.model';
import { otpRepository } from 'src/DB/repository/otp.repository ';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/guard/auth.guard';

@Module({
  imports:[UserModel,OtpModel],
  controllers: [UserController],
  providers: [ UserService,userRepository,otpRepository,JwtService,AuthGuard]
})
export class UserModule {}
