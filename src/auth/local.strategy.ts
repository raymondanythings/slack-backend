import { AuthService } from './auth.service'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' })
  }

  async validate(email: string, password: string, done: CallableFunction) {
    const validUser = { email, password }
    const user = await this.authService.validateUser(validUser)
    if (!user) {
      throw new UnauthorizedException()
    }
    return done(null, user)
  }
}
