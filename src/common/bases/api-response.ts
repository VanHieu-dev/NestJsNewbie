import { HttpStatus } from '@nestjs/common'
import { ApiResponseKey } from '../enum/api-response-key'

export class ApiResponse {
  static ok<T>(
    data: T,
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.OK,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS]: true,
      [ApiResponseKey.CODE]: httpStatus,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.DATA]: data,
      [ApiResponseKey.TIMESTAMP]: new Date().toISOString(),
    }
  }
  static error<T>(
    errors: T,
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS]: false,
      [ApiResponseKey.CODE]: httpStatus,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.ERROR]: errors,
      [ApiResponseKey.TIMESTAMP]: new Date().toISOString(),
    }
  }

  static message(
    message: string = '',
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Record<string, unknown> {
    return {
      [ApiResponseKey.STATUS]:
        httpStatus === HttpStatus.OK || httpStatus === HttpStatus.CREATED,
      [ApiResponseKey.MESSAGE]: message,
      [ApiResponseKey.TIMESTAMP]: new Date().toISOString(),
    }
  }
}
