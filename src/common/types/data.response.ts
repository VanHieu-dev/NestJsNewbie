import { RegisterResDTO } from 'src/auth/auth.dto'
import { User } from './entity.type'

export interface LoginResponse {
  access_token: string
  user: User
}
export interface RegisterResponse {
  access_token: string
  user: RegisterResDTO
}
