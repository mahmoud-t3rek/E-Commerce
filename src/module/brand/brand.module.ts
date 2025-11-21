import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { AuthGuard, TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { brandModel, brandRepository, UserModel, userRepository } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';



@Module({
  imports:[UserModel,brandModel],
  controllers: [BrandController],
  providers: [BrandService,TokenService,JwtService,userRepository,brandRepository,S3Service ]
})
export class BrandModule {}
