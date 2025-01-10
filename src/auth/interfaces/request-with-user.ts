import { Request } from 'express'
import { UserDto } from 'src/user/dto/user.dto'

export type UserPayload = {
  sub: number
  user?: UserDto
}

export interface RequestWithUser extends Request {
  user: UserDto
}
