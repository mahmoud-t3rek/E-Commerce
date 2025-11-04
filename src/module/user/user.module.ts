 import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel, userRepository } from 'src/DB';
import { OtpModel } from 'src/DB/models/otp.model';
import { otpRepository } from 'src/DB/repository/otp.repository ';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token/Token';
import { GenerateTokens } from 'src/common/services/Token';




@Module({
  imports:[UserModel,OtpModel],
  controllers: [UserController],
  providers: [ UserService,userRepository,otpRepository,JwtService,TokenService,GenerateTokens]
})
export class UserModule {}
