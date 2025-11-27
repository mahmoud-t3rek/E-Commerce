

import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {  IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate, validate } from 'class-validator';
import { Types } from 'mongoose';
import { BrandIds } from 'src/common/decorators';
import { atLeastOne } from 'src/common/decorators/brandcostum';
import { Brand } from 'src/DB';
import { string } from 'zod';



export class CreateProductDto {

    @IsString()
    @Length(5, 100)
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    @Length(5,10000)
    description:string

    @IsNotEmpty()
    @IsMongoId()
    category:Types.ObjectId

   @IsNotEmpty()
   @IsMongoId()
  brand:Types.ObjectId

   @IsNotEmpty()
   @IsMongoId()
  subCategory:Types.ObjectId

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  price:number

   @IsNumber()
   @IsOptional()
   @Type(()=>Number)
   discount:number
   @IsNumber()
   @IsOptional()
   @Type(()=>Number)
   quentity:number
   @IsNumber()
   @IsOptional()
   @Type(()=>Number)
   stock:number

   @IsNumber()
   @IsOptional()
   @Type(()=>Number)
   rateNum:Number

   @IsNumber()
   @IsOptional()
   @Type(()=>Number)
   rateAvg:Number
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


export class UpdateProduct extends PartialType(CreateProductDto){

}



