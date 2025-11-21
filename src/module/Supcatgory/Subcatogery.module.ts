import { Module } from '@nestjs/common';

import {  TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { brandModel, brandRepository, UserModel, userRepository } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { categoryModel } from 'src/DB/models/catogery.model';
import { SubcategoryController } from './SubCatogery.controller';
import { SubcategoryService } from './Subcatogery.service';
import { SubcategoryRepository } from 'src/DB/repository/supcatogeryrepositry';
import { SubcategoryModel } from 'src/DB/models/supcatogery.model';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';


@Module({
  imports:[UserModel,brandModel,SubcategoryModel,categoryModel],
  controllers: [SubcategoryController],
  providers: [SubcategoryService,TokenService,JwtService,userRepository,brandRepository,S3Service,SubcategoryRepository,BrandValidatorService ,categoryRepository]
})
export class SubcategoryModule {}
