/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginBodyDTO,
  LogoutBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto'
import { RolesGuard } from 'src/common/Guards/role.guard'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from 'src/decorator/roles.decorator'
import { Role } from 'src/common/enum/role.enum'
import { LocalAuthGuard } from 'src/common/Guards/local.guard'
import express from 'express'
import { JwtRefreshTokenAuthGuard } from 'src/common/Guards/jwt-refresh.guard'
import { LoginResponse, RegisterResponse } from 'src/common/types/data.response'
import { ApiResponse } from 'src/common/bases/api-response'
import { error } from 'console'

@Controller('auth')
// @UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAllUserOrSearch(@Query('name') name?: string) {
    if (name) {
      return this.authService.findUser(name)
    }
    return this.authService.getUser()
  }

  @Post('/register')
  async register(
    @Body() body: RegisterBodyDTO,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<ApiResponse> {
    const result = await this.authService.register(body)
    res.cookie('refreshToken', result.refresh_token, {
      httpOnly: true,
      secure: false,
      path: '/auth',
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    const { user, access_token } = result
    const data = ApiResponse.ok(
      { user, access_token },
      'Đăng Kí Thành Công',
      HttpStatus.OK,
    )
    return data
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginBodyDTO,
    @Req() req,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<ApiResponse> {
    try {
      const result = await this.authService.login(req.user)
      res.cookie('refreshToken', result.refresh_token, {
        httpOnly: true,
        secure: false,
        path: '/auth',
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian sống (ví dụ 7 ngày)
      })
      return result.response
    } catch (error) {
      const err = ApiResponse.error(
        error,
        'Đã có lỗi xảy ra',
        HttpStatus.BAD_REQUEST,
      )
      throw new HttpException(err, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('/logout')
  @UseGuards(JwtRefreshTokenAuthGuard)
  logout(@Req() req: express.Request) {
    return this.authService.logout(req.user)
  }

  @Get(':id')
  @Roles(Role.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  /**
   * Cái thằng AuthGuard('jwt') chỉ để giải mã tokens gửi lên ở header rồi sao đó gán user lấy được từ tokens vào req
    Cái AuthGuard('jwt') được lấy từ thư viện của passport, cái 'jwt' là từ file jwt.strategy.ts, nó là cơ chế tự động tìm của AuthGuard
    Tiếp theo đó RolesGuard lấy được user ở req thì kiểm tra xem roles của user này có khớp với decorator @Roles(Role.Admin) mà mình gán cho cái route này không nếu khớp thì là user này được phép truy cập vào route  này
   */
  getUserById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    console.log('r-getUserById: ', req.user)
    console.log('r-getUserById: ', req.cookies['refreshToken'])
    return this.authService.getUserById(id)
  }
}
