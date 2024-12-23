// import { Injectable, UnauthorizedException } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { PassportStrategy } from '@nestjs/passport'
// import { Request } from 'express'
// import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
// import { AuthService } from '../auth.service'
// import { UserPayload } from '../interfaces/request-with-user'

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(JwtStrategy, 'jwt-refresh') {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly configService: ConfigService
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([JwtRefreshStrategy.extractJWT]),
//       secretOrKey: configService.get('JWT_REFRESH'),
//       passReqToCallback: true
//     })
//   }

//   async validate(
//     request: Request,
//     payload: {
//       sub: number
//       email: string
//     }
//   ): Promise<UserPayload> {
//     console.log(`JwtRefreshStrategy`, payload, request.cookies?.refresh_token)
//     const userPayload = await this.authService.veryifyUserRefreshToken(request.cookies?.refresh_token, payload.sub)

//     if (!userPayload) {
//       throw new UnauthorizedException('Invalid Refresh Token')
//     }

//     return userPayload
//   }

//   private static extractJWT(request: Request): string | null {
//     console.log(`extractJWT`, request.cookies?.refresh_token)
//     if (request.cookies && 'refresh_token' in request.cookies && request.cookies.refresh_token.length > 0) {
//       return request.cookies.refresh_token
//     }
//     return null
//   }
// }
