import { Module } from '@nestjs/common';

import {  TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { brandModel, brandRepository, ProductModel, UserModel, userRepository } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { categoryModel } from 'src/DB/models/category.model';
import { SubcategoryRepository } from 'src/DB/repository/supcatogeryrepositry';
import { SubcategoryModel } from 'src/DB/models/subcategory.model';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import { ProductRepository } from 'src/DB/repository/Product.repositry';


@Module({
  imports:[UserModel,brandModel,SubcategoryModel,categoryModel,ProductModel],
  controllers: [ProductController],
  providers: [ProductService,TokenService,JwtService,userRepository,brandRepository,S3Service,SubcategoryRepository,BrandValidatorService ,categoryRepository,ProductRepository]
})
export class ProductModule {}
