import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LoggerService } from 'src/core/logger/logger.service'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly loggerService: LoggerService) {
    super()
  }

  handleRequest(err, user, info) {
    this.loggerService.log(err, user, info)
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
