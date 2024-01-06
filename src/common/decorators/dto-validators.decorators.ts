import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator
} from 'class-validator';
import { User } from 'src/entities';

@ValidatorConstraint({ name: 'isValidUser', async: true })
class IsValidUserConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean | Promise<boolean> {
    if (!value || typeof value !== 'string') {
      return false;
    }

    return User.findByPk(value, {
      attributes: ['id']
    })
      .then((user) => {
        return !!user;
      })
      .catch(() => {
        return false;
      });
  }

  defaultMessage(args: ValidationArguments) {
    return `User with the id ${args.value} does not exist`;
  }
}

export const IsValidUser = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUserConstraint
    });
  };
};

@ValidatorConstraint({ name: 'isBase64', async: false })
export class IsBase64Constraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value !== 'string') {
      return false;
    }
    const base64Regex = /^(data:image\/([a-zA-Z]+);base64,)/;
    return base64Regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid base64 string`;
  }
}

export function IsBase64(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBase64Constraint
    });
  };
}
