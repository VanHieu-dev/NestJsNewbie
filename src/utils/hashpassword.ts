import * as bcrypt from 'bcrypt'
const saltOrRounds = 10
export const hash = async (password: string) => {
  return await bcrypt.hash(password, saltOrRounds)
}
export const isMatch = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}
