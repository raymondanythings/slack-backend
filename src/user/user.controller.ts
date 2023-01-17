import { UserService } from './user.service'
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { JoinRequestDto } from './dtos/join.request.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Req() req) {
    return req.user
  }
  @Get('test')
  test(@Req() req) {
    return 'ok'
  }

  @Post()
  postUser(@Body() user: JoinRequestDto) {
    this.userService.postUser(user)
  }

  @Post('login')
  login() {}

  @Post('logout')
  logout(@Req() req, @Res() res) {
    req.logOut()
    res.clearCookie('connect.sid', { httpOnly: true })
    res.send('OK')
  }
}
