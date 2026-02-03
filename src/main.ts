import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import { LoggingInterceptor } from './common/interceptor/logging.interceptor'
import { TransformInterceptor } from './common/interceptor/transform.interceptor'

import { ApiResponse } from './common/bases/api-response'
import cookieParser from 'cookie-parser'
async function boottrap() {
  const app = await NestFactory.create(AppModule)
  const Port = 3000
  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Bắt buộc để trình duyệt nhận cookie
  })
  //Pipe mới là cái validate dữ liệu còn cái interceptor bên dưới chỉ là trả về dữ liệu sau khi có response
  app.useGlobalPipes(
    //xử lí lỗi liên quan đến validation
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (validationError) => {
        const errors = validationError.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints as any).join(', '),
        }))
        const response = ApiResponse.error(
          errors,
          'UnprocessableEntityException',
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
        return new HttpException(response, HttpStatus.UNPROCESSABLE_ENTITY)
        return new UnprocessableEntityException(
          // validationError.map((error) => ({
          //   field: error.property,
          //   error: Object.values(error.constraints as any).join(', '),
          // })),
          ['loi validate'],
        )
      },
    }),
  )
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  await app.listen(Port)
}
boottrap()
