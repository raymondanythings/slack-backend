import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'

@ApiTags('Channel')
@Controller('workspace/:url/channel')
export class ChannelController {
  @Get()
  getAllChannels() {
    return 'channel'
  }

  @Post()
  createChannels() {}

  @Get(':name')
  getChannel() {}

  @Get(':name/chats')
  getChat(
    @Query('perPage') perPage: string,
    @Query('page') page: string,
    @Param() param,
  ) {
    param.id
    console.log(perPage, page)
  }

  @Post(':name/chats')
  postChat(@Body() body) {}

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMember() {}
}
