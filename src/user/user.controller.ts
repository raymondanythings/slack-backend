import { NotLoggedInGuard } from './../auth/not-logged-in.guard'
import { LoggedInGuard } from './../auth/logged-in.guard'
import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'
import { UserService } from './user.service'
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { JoinRequestDto } from './dtos/join.request.dto'
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger/dist'
import { UserDto } from './dtos/user.dto'
import { User } from './user.decorator'
import { LocalAuthGuard } from 'src/auth/local-auth.guard'
import { Users } from 'src/entities/Users.entity'
import { Response } from 'express'

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiOkResponse({
    description: '성공',
    type: UserDto,
  })
  @ApiInternalServerErrorResponse({
    description: '에러',
    content: {
      serverError: {
        example: {
          error: 'Internal Server Error',
        },
      },
      serverError2: {
        example: {
          error: 'Internal Server Error',
        },
      },
    },
  })
  @Get()
  getLoggedInUser(@User() user: Users) {
    return user || false
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(NotLoggedInGuard)
  @Post()
  async joinUser(@Body() user: JoinRequestDto) {
    return await this.userService.joinUser(user)
  }
  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: Users): Users {
    return user
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  logout(@Req() req, @Res() res: Response) {
    req.logOut()
    res.clearCookie('connect.sid', { httpOnly: true })
    res.send('OK')
  }
}
