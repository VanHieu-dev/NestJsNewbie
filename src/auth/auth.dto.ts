import { Exclude } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'
import { Match } from 'src/decorator/match.decorator'
import { IsPasswordStrong } from 'src/decorator/password.decorator'

export class LoginBodyDTO {
  @IsString()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string

  @Length(4, 15, { message: 'Mật khẩu phải có độ dài từ 4 đến 15 kí tự' })
  @IsString()
  @IsPasswordStrong({ message: 'Mật khẩu yếu quá đặt lại đi bạn ơi' })
  password: string
}
export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string

  @IsString()
  roles: string

  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string
}
export class RegisterResDTO {
  id: number
  email: string
  name: string
  @Exclude()
  password: string
  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial)
  }
}
export class LogoutBodyDTO {
  @IsString()
  refresh_token: string
}

export class LoginResponseDTO {
  access_token: string
  @Exclude()
  refresh_token: string
  constructor(partial: Partial<LoginResponseDTO>) {
    Object.assign(this, partial)
  }
}
