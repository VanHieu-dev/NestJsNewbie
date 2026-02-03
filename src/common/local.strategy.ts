/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Result } from 'pg'
import { AuthService } from 'src/auth/auth.service'
import { ApiResponse } from './bases/api-response'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    })
  }
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password)
    return user
  }
}
