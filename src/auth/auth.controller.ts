import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { SignInResponseDto } from './dto/sign-in-response.dto'
import { LocalGuard } from './guards/local.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalGuard)
  @ApiOperation({
    summary: 'Sign in a user',
    description:
      'This endpoint allows a user to sign in by providing valid credentials. On successful authentication, a token is generated and returned.'
  })
  @ApiBody({ type: CreateUserDto, description: 'User sign-in credentials' })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: SignInResponseDto
  })
  async signIn(@Req() request: Request) {
    const userId = request.user.id
    return this.authService.generateTokens(userId)
  }

  // @Public()
  // @Post('signup')
  // @HttpCode(201)
  // @ApiOperation({
  //   summary: 'Sign up a new user',
  //   description:
  //     'This endpoint allows a new user to sign up by providing necessary registration details. On successful registration, user details are returned.'
  // })
  // @ApiBody({ type: CreateUserDto, description: 'User sign-up details' })
  // @ApiCreatedResponse({
  //   description: 'User successfully registered',
  //   type: SignUpResponseDto
  // })
  // async signUp(@Body() signUpDto: CreateUserDto) {
  //   const user = await this.authService.signUp(signUpDto)
  //   return user
  // }

  // @Get('me')
  // @UseGuards(JwtGuard)
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary: 'Get current user',
  //   description: 'This endpoint returns the current authenticated user.'
  // })
  // @ApiOkResponse({
  //   description: 'Current user details'
  // })
  // async getMe(@Req() request: RequestWithUser) {
  //   return request.user
  // }

  // @HttpCode(HttpStatus.OK)
  // @UseGuards(PassportLocalGuard)
  // @Post('/login')
  // public async login(@Req() request: Request, @Res() response: Response): Promise<Response<{ message: string }>> {
  //   const { accessToken, refreshToken } = await this.authService.signIn(request.user)
  //   response.cookie('access_token', accessToken, { httpOnly: true })
  //   response.cookie('refresh_token', refreshToken, { httpOnly: true })
  //   return response.send({ message: 'Login successful' })
  // }

  // @HttpCode(HttpStatus.OK)
  // @UseGuards(PassportJwtRefreshAuthGuard)
  // @Post('/refresh')
  // public async refresh(@Req() request: Request, @Res() response: Response): Promise<Response<{ message: string }>> {
  //   const { accessToken, refreshToken } = await this.authService.signIn(request.user)
  //   response.cookie('access_token', accessToken, { httpOnly: true })
  //   response.cookie('refresh_token', refreshToken, { httpOnly: true })
  //   return response.send({ message: 'Refresh successful' })
  // }

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

  // @UseGuards(PassportJwtAuthGuard)
  // @Get('/me')
  // public async getUserPayload(@Req() request: Request) {
  //   return request.user
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/logout')
  // public async logout(@Res() response: Response): Promise<Response<{ message: string }>> {
  //   response.clearCookie('access_token')
  //   response.clearCookie('refresh_token')
  //   return response.send({ message: 'Logged out successfully' })
  // }
}