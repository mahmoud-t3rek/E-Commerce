

import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {  IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Types } from 'mongoose';
import { atLeastOne } from 'src/common/decorators/brandcostum';
import { string } from 'zod';



export class CreateBrandDto {

    @IsString()
    @Length(5, 30)
    @IsNotEmpty()
    name:string
  
      @IsString()
      @IsNotEmpty()
      @Length(5,30)
     slogan:string
  
}

export class IDDto{
   @IsNotEmpty()
   @IsMongoId()
   id:Types.ObjectId
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


@atLeastOne(["name","slogan"])
export class UpdateBrand extends PartialType(CreateBrandDto){

}



