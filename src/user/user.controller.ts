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
  getLoggedInUser(@User() user) {
    return user
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUser(@Body() user: JoinRequestDto) {
    this.userService.postUser(user)
  }
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@User() user) {
    return user
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Req() req, @Res() res) {
    req.logOut()
    res.clearCookie('connect.sid', { httpOnly: true })
    res.send('OK')
  }
}
