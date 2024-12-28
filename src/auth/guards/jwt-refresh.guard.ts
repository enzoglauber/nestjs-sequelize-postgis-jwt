import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { log } from 'console'
import { LoggerService } from 'src/core/logger/logger.service'

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly loggerService: LoggerService) {
    super()
  }

  public handleRequest(error: any, user: any, info: any) {
    log(`JwtRefreshAuthGuard>>>>>>`, error, user, info)

    // if (error || !user) {
    //   // this.loggerService.error(info)
    //   throw error || new UnauthorizedException('Invalid Refresh Token 222')
    // }
    return user
  }
}

// import { ExecutionContext, Injectable } from '@nestjs/common'
// import { Reflector } from '@nestjs/core'
// import { AuthGuard } from '@nestjs/passport'
// import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

// @Injectable()
// export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
//   constructor(private reflector: Reflector) {
//     super()
//   }

//   canActivate(context: ExecutionContext) {
//     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
//     return isPublic ? true : super.canActivate(context)
//   }
// }
