import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { UserRole } from 'src/core/enums/user-role.enum'
import { RolesGuard } from 'src/core/guards/roles.guard'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { Roles } from './decorators/roles.decorator'
import { SignInResponseDto } from './dto/sign-in-response.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpResponseDto } from './dto/sign-up-response.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalGuard } from './guards/local.guard'
import { RequestWithUser } from './interfaces/request-with-user'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //
  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalGuard)
  @ApiOperation({
    summary: 'Login a user',
    description:
      'This endpoint allows a user to sign in by providing valid credentials. On successful authentication, a token is generated and returned.'
  })
  @ApiBody({ type: SignInDto, description: 'User sign-in credentials' })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: SignInResponseDto
  })
  async login(@Req() request: RequestWithUser) {
    const { accessToken, refreshToken } = await this.authService.login(request.user)
    return { accessToken, refreshToken }
  }

  //
  @Public()
  @Post('signup')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Sign up a new user',
    description:
      'This endpoint allows a new user to sign up by providing necessary registration details. On successful registration, user details are returned.'
  })
  @ApiBody({ type: CreateUserDto, description: 'User sign-up details' })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: SignUpResponseDto
  })
  async signUp(@Body() signUpDto: CreateUserDto) {
    return await this.authService.signUp(signUpDto)
  }

  //
  @Get('me')
  @Roles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'This endpoint returns the current authenticated user.'
  })
  @ApiOkResponse({
    description: 'Current user details',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        addresses: [
          {
            id: 1,
            name: 'Home Address',
            location: [-46.49303586178094, -23.5069054086106]
          }
        ]
      }
    }
  })
  async getMe(@Req() request: RequestWithUser) {
    return request.user
  }

  //
  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh authentication tokens',
    description: 'This endpoint allows the user to refresh their authentication tokens using a valid refresh token.'
  })
  @ApiOkResponse({
    description: 'New authentication tokens generated successfully.',
    schema: {
      example: {
        message: 'Refresh successful',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.'
  })
  @ApiForbiddenResponse({
    description: 'The refresh token does not match the user’s current token or other authorization issues.'
  })
  public async refresh(@Req() request: RequestWithUser) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(request.user)
    return { message: 'Refresh successful', refreshToken, accessToken }
  }

  //
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'This endpoint returns the current authenticated user.'
  })
  @ApiOkResponse({
    description: 'Current user details'
  })
  async logout(@Req() request: RequestWithUser) {
    this.authService.logout(request.user.id)
    return { message: 'Logged out successfull', id: request.user.id }
  }

  // // @HttpCode(HttpStatus.OK)
  // // @UseGuards(GoogleAuthGuard)
  // // @Get('/google/login')
  // // public async googleLogin() {}

  // // @HttpCode(HttpStatus.OK)
  // // @UseGuards(GoogleAuthGuard)
  // // @Get('/google/redirect')
  // // public async googleLoginRedirect(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
  // //   const { accessToken, refreshToken } = await this.authService.signIn(request.user)

  // //   response.cookie('access_token', accessToken, { httpOnly: true })
  // //   response.cookie('refresh_token', refreshToken, { httpOnly: true })

  // //   const redirectUrl = this.configService.getOrThrow('FRONTEND_REDIRECT_URI')
  // //   response.redirect(redirectUrl)
  // // }
}
