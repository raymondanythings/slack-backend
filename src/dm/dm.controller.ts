import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger/dist/decorators/api-param.decorator'
import { ApiQuery } from '@nestjs/swagger/dist/decorators/api-query.decorator'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'
@ApiTags('DM')
@Controller('workspace/:url/dm')
export class DmController {
  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 id',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한 번에 가져오는 개수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @Get(':id/chats')
  getChat(
    @Query('perPage') perPage: string,
    @Query('page') page: string,
    @Param() param,
  ) {
    param.id
    console.log(perPage, page)
  }

  @Post(':id/chats')
  postChat(@Body() body) {}
}
