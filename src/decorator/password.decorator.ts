/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

export function IsPasswordStrong(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPasswordStrong',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          'Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và kí tự đặc biệt',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false

          const isLongEnough = value.length >= 8
          const hasUpperCase = /[A-Z]/.test(value)
          const hasLowerCase = /[a-z]/.test(value)
          const hasNumber = /[0-9]/.test(value)
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
          return (
            isLongEnough &&
            hasLowerCase &&
            hasUpperCase &&
            hasNumber &&
            hasSpecialChar
          )
        },
      },
    })
  }
}
