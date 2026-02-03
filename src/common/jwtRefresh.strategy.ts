import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { extractRefreshTokenFromCookie } from 'src/utils/helper'
import express from 'express'
import { TokenPayload } from './types/jwt.type'

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractRefreshTokenFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: 'nestjs',
      passReqToCallback: true,
    })
  }
  validate(req: express.Request, payload: TokenPayload) {
    const refreshToken = req.cookies?.refreshToken
    return { ...payload, refreshToken }
  }
}
