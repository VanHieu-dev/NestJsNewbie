export interface User {
  id: number
  email: string
  name: string
  roles: string
}
export interface GenerateTokenPayLoad {
  userId: number
  roles: string
}
