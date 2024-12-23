import { Request } from 'express'

export type UserPayload = {
  id: number
  email: string
}

export interface RequestWithUser extends Request {
  user: UserPayload
}
