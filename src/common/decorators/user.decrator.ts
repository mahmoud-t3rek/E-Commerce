import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'matchfeilds', async: false })
export class matchFeilds implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
   return value===args.object['password']
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not match with ${args.constraints[0 ]}`;
  }
}
export function IsMatchFeilds(constraints:string[],validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: matchFeilds,
    });
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserDecrator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
