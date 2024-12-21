import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { SignInDto } from '../dto/sign-in.dto'

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  // constructor() {
  //   super()
  // }

  // public handleRequest(error: Error, user: any): any {
  //   if (error || !user) {
  //     log(error)
  //     throw error || new Error('User not authenticated')
  //   }
  //   log('User authenticated: ' + user.email)
  //   return user
  // }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    // transform the request body object to class instance
    const body = plainToClass(SignInDto, request.body)

    // get a list of errors
    const errors = await validate(body)

    // extract error messages from the errors array
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
