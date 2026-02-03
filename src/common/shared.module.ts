import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { Token } from './services/token.service'
import { JwtStrategy } from './jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'
import { AuthModule } from 'src/auth/auth.module'
import { JwtRefreshStrategy } from './jwtRefresh.strategy'

@Global()
@Module({
  imports: [JwtModule.register({}), PassportModule, AuthModule],
  providers: [
    PrismaService,
    Token,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    PrismaService,
    Token,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
  ],
})
export class SharedModule {}
