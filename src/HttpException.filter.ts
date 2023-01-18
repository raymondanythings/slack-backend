import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const { message, ...err } = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] } // class-validator 응답값, 현재 커스텀 불가능한듯

    if (typeof err !== 'string' && err.statusCode === 400) {
      return response
        .status(status)
        .json({ success: false, code: status, data: message })
    }
    return response
      .status(status)
      .json({ success: false, code: status, data: message })
  }
}
