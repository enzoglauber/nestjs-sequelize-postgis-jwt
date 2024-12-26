import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { SignInDto } from '../dto/sign-in.dto'

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const body = plainToClass(SignInDto, request.body)
    const errors = await validate(body)
    const messages = errors.flatMap(({ constraints }) => Object.values(constraints))

    if (messages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: messages
      })
      return
    }

    return super.canActivate(context) as boolean
  }
}
