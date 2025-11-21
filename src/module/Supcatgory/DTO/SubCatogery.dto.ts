

import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {  IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Validate, validate } from 'class-validator';
import { Types } from 'mongoose';
import { BrandIds } from 'src/common/decorators';
import { atLeastOne } from 'src/common/decorators/brandcostum';
import { string } from 'zod';



export class CreateSubcategoryDto {

    @IsString()
    @Length(5, 30)
    @IsNotEmpty()
    name:string

      @IsString()
      @IsNotEmpty()
      @Length(5,30)
     slogan:string
    @Validate(BrandIds)
    @IsOptional()
     brands:Types.ObjectId[]
  
}

export class AddBrandToSubcategoryDto {
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


@atLeastOne(["name","slogan","brands"])
export class UpdateSubcategory extends PartialType(CreateSubcategoryDto){

}



