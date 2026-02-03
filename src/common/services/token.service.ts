import { JwtService } from '@nestjs/jwt'
import 'dotenv/config'
import { TokenPayload } from '../types/jwt.type'
import { Injectable } from '@nestjs/common'

@Injectable()
export class Token {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(payload: { userId: number; roles: string }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any,
      algorithm: 'HS256',
    })
  }
  signRefreshToken(payload: { userId: number; roles: string }) {
    return this.jwt.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any,
      algorithm: 'HS256',
    })
  }
  verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    })
  }

  verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    })
  }
}
