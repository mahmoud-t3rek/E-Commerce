import { Module } from '@nestjs/common';

import {  TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/common/services/email/S3Config';
import { CartService } from './Cart.service';
import { CartController } from './Cart.controller';
import { CartRepository } from 'src/DB/repository/Cartrepositry';
import { ProductRepository } from 'src/DB/repository/Product.repositry';
import { CartModel, ProductModel, UserModel, userRepository } from 'src/DB';



@Module({
  imports:[UserModel,ProductModel,CartModel],
  controllers: [CartController],
  providers: [CartService,TokenService,JwtService,userRepository,S3Service,ProductRepository,CartRepository]
})
export class CartModule {}
