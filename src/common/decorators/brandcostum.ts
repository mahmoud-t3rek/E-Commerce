import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


export function atLeastOne(constraints:string[],validationOptions?: ValidationOptions) {
    return function (constructor:Function) {
       registerDecorator({
      target: constructor,
      propertyName: "",
      options: validationOptions,
      constraints,
      validator: {
         validate(value: string, args: ValidationArguments) {
    return constraints.some(field=>args.object[field])
  },
   defaultMessage(args: ValidationArguments) {
    return `$at least one feild required ${constraints.join(" , ")} is missing `;
      }
    },
    });
  }
}

