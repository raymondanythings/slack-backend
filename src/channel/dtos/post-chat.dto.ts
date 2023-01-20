import { PickType } from '@nestjs/swagger'
import { ChannelChats } from 'src/entities/ChannelChats.entity'
export class PostChatDto extends PickType(ChannelChats, ['content']) {}
