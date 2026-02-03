/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common'

export class LowCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
    return value
  }
}
