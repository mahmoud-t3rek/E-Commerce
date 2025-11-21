import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'brandIds', async: false })
export class BrandIds implements ValidatorConstraintInterface {
  validate(ids: string[], args: ValidationArguments) {
   if (!ids || !Array.isArray(ids)) {
  return false;
}
   return ids.filter((id)=>Types.ObjectId.isValid(id)).length==ids.length
  }

 defaultMessage(args: ValidationArguments) {
  return `${args.property} must be an array of valid ObjectIds`;
}

}
 
