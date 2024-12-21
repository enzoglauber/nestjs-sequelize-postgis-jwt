import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from 'src/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtCookieStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
  imports: [UserModule, PassportModule, JwtModule],
  providers: [
    AuthService,
    LocalStrategy,
    JwtCookieStrategy
    // JwtRefreshStrategy, GoogleStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
