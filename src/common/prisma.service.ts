import { PrismaClient } from '../generated/prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    super({ adapter })
  }
  async onModuleInit() {
    // Với Adapter, Prisma sẽ tự kết nối thông qua Pool của 'pg'
    await this.$connect()
    console.log(process.env.DATABASE_URL)
    console.log('✅ Đã kết nối Postgres Local thành công bằng Driver Adapter!')
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
