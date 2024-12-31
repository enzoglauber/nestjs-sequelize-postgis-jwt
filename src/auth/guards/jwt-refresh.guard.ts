import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LoggerService } from 'src/core/logger/logger.service'
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly loggerService: LoggerService) {
    super()
  }

  handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      this.loggerService.log(err, info)
      throw err || new UnauthorizedException()
    }
    return user
  }
}
