import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest()
    return !request.isAuthenticated()
  }
}
