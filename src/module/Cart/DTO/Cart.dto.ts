

import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {  IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate, validate } from 'class-validator';
import { Types } from 'mongoose';
import { BrandIds } from 'src/common/decorators';
import { atLeastOne } from 'src/common/decorators/brandcostum';
import { Brand } from 'src/DB';
import { string } from 'zod';

export class CartProduct {
  @IsMongoId()
  @IsNotEmpty()
  productId:Types.ObjectId

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  quentity:number 
}

export class CreateCartDto {

  
    @IsMongoId()
    @IsNotEmpty()
    products:CartProduct[]

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  subTotal:number
   

    @IsNotEmpty()
    @IsMongoId()
    createdBy:Types.ObjectId

  
}

export class AddBrandToProducDto {
    @Validate(BrandIds)
     brands:Types.ObjectId[]
  
}


export class IDDto{
   @IsNotEmpty()
   @IsMongoId()
  Id:Types.ObjectId
}
export class QueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}

@atLeastOne(["quentity"])
export class UpdateCart extends PartialType(CartProduct){

}



