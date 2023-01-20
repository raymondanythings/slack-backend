import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'
import { PageDtos } from 'src/common/dtos/page.dto'
import { Users } from 'src/entities/Users.entity'
import { User } from 'src/user/user.decorator'
import { ChannelService } from './channel.service'
import { findChannelDto } from './dtos/find-channel.dto'
import { PostChatDto } from './dtos/post-chat.dto'

@ApiTags('Channel')
@Controller('workspace/:url/channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}
  @Get()
  getAllChannels() {
    return 'channel'
  }

  @Post()
  createChannels() {}

  @Get(':name')
  getSpecificChannel() {}

  @Get(':name/chats')
  getChat(
    @Param() param: findChannelDto,
    @Query() { page, perPage }: PageDtos,
  ) {
    return this.channelService.getWorkspaceChannelChats(
      param.url,
      param.name,
      perPage,
      page,
    )
  }

  @Post(':name/chats')
  postChat(
    @Param() param: findChannelDto,
    @Body() { content }: PostChatDto,
    @User() user: Users,
  ) {
    return this.channelService.postChat(
      {
        ...param,
        content,
      },
      user,
    )
  }

  @Post(':name/images')
  postImages(@Body() body) {}

  @Get(':name/unreads')
  getUnreads(
    @Param() { url, name }: findChannelDto,
    @Query('after') after: number,
  ) {
    return this.channelService.getChannelUnreadsCount(url, name, after)
  }

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelService.getWorkspaceChannelMembers(url, name)
  }

  @Post(':name/members')
  inviteMember() {}
}
