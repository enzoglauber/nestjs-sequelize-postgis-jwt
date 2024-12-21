import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { log } from 'console'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super()
  }

  public handleRequest(error: any, user: any, info: any) {
    log(`JwtAuthGuard`, error, user, info)
    if (error || !user) {
      log(info)
      throw error || new UnauthorizedException('Invalid Access Token')
    }
    return user
  }
}
