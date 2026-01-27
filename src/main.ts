import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function boottrap() {
  const app = await NestFactory.create(AppModule)
  const Port = 3000
  await app.listen(Port)
}
boottrap()
