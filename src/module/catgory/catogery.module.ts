import { Module } from '@nestjs/common';

import {  TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { brandModel, brandRepository, UserModel, userRepository } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { categoryModel } from 'src/DB/models/category.model';
import { categoryController } from './Catogery.controller';
import { categoryService } from './catogery.service';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';


@Module({
  imports:[UserModel,brandModel,categoryModel],
  controllers: [categoryController],
  providers: [categoryService,TokenService,JwtService,userRepository,brandRepository,S3Service,categoryRepository,BrandValidatorService ]
})
export class categoryModule {}
