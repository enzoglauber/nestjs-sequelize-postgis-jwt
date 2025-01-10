import { UserPayload } from '../interfaces/request-with-user'

type AuthInput = {
  email: string
  password: string
}

type AuthLogin = {
  id: number
  email: string
}

type AuthResult = {
  userId: number
  email: string
  accessToken: string
}

declare namespace Express {
  export interface Request {
    user: UserPayload
  }
}
