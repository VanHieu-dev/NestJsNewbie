/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/common/prisma.service'
import { RegisterBodyDTO, RegisterResDTO } from './auth.dto'
import { hash, isMatch } from 'src/utils/hashpassword'
import { Token } from 'src/common/services/token.service'
import { isNotFoundPrismaError } from 'src/utils/helper'
import { ApiResponse } from 'src/common/bases/api-response'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import * as cacheManager from 'cache-manager'
import { GenerateTokenPayLoad, User } from 'src/common/types/entity.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly DB: PrismaService,
    private readonly token: Token,
    @Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache,
  ) {}

  async login(user: User) {
    const payload = { userId: user.id, roles: user.roles }
    const tokens = await this.generateTokens(payload)
    const { access_token, refresh_token } = tokens
    const data = { user, access_token }
    const response = ApiResponse.ok(data, 'Đăng nhập thành công', HttpStatus.OK)
    // await this.cacheManager.set('test', '123', 60000)
    return { response, refresh_token }
  }
  async register(body: RegisterBodyDTO) {
    const user = await this.DB.user.findUnique({
      where: { email: body.email },
    })
    if (user) {
      const response = ApiResponse.error(
        {
          filed: 'email',
          error: 'Email đã tồn tại',
        },
        'Conflict',
        HttpStatus.CONFLICT,
      )
      throw new HttpException(response, HttpStatus.CONFLICT)
    }
    const hashPassword = await hash(body.password)
    /**
     * Dùng transaction để đảm bảo cả việc tạo user lẫn việc generate tokens đều phải thành công thì mới lưu vào db
     * Chỉ cần 1 trong 2 cái không hoàn thành thì tất cả đều không hoàn thành
     * Truyền tx vào generate là để giúp cho generate cùng 1 phiên làm việc với bên trên, tại vì trong generate nó có in vào db refresh tokens nên nếu dùng this.DB thì nó sẽ tạo ra 1 phiên làm việc khác.
     */
    return this.DB.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: body.email,
          name: body.name,
          roles: body.roles,
          password: hashPassword,
        },
      })
      const payload = { userId: newUser.id, roles: newUser.roles }
      const tokens = await this.generateTokens(payload, tx)
      return {
        user: new RegisterResDTO(newUser),
        ...tokens,
      }
    })
  }
  async logout(user: any) {
    try {
      await this.DB.refreshToken.delete({
        where: {
          token: user.refreshToken,
        },
      })
      return { message: 'Logout thành công' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh Token not not found')
      }
      throw error
    }
  }
  async generateTokens(payload: GenerateTokenPayLoad, tx?: any) {
    const [access_token, refresh_token] = await Promise.all([
      this.token.signAccessToken(payload),
      this.token.signRefreshToken(payload),
    ])
    const decodeRefreshToken =
      await this.token.verifyRefreshToken(refresh_token)
    const prisma = tx || this.DB
    await prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: payload.userId,
        expiresAt: new Date(decodeRefreshToken.exp * 1000),
      },
    })
    return { access_token, refresh_token }
  }
  async validateUser(email: string, password: string) {
    const user = await this.DB.user.findUnique({
      where: {
        email: email,
      },
    })
    if (user && (await isMatch(password, user.password))) {
      const { password, createdAt, updatedAt, ...result } = user
      return result
    }
    throw new UnauthorizedException('Thông tin đăng nhập không chính xác')
  }
  async getUserById(id: number) {
    const user = await this.DB.user.findUnique({ where: { id: id } })
    if (!user) {
      throw new NotFoundException(`User witd id ${id} not found`)
    }
    return new RegisterResDTO(user)
  }
  findUser(name: string) {
    console.log('name:', name)
    return this.DB.user.findMany({ where: { name: name } })
  }
  async getUser() {
    const users = await this.DB.user.findMany()
    return users.map((user) => new RegisterResDTO(user))
  }
}
