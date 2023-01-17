import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'

@Controller('workspace/:url/dm')
export class DmController {
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
