import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { SharedModule } from './common/shared.module'
import { CacheModule } from '@nestjs/cache-manager'
import { Keyv } from 'keyv'
import { createKeyv } from '@keyv/redis'
import { CacheableMemory } from 'cacheable'

@Module({
  providers: [AppService],
  controllers: [AppController],
  imports: [
    AuthModule,
    SharedModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
              namespace: 'nest_newbie',
            }),
            createKeyv('redis://localhost:6379/1', {
              namespace: 'nest_newbie',
            }),
          ],
        }
      },
    }),
  ],
})
export class AppModule {}
