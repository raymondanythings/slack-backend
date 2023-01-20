import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChannelChats } from 'src/entities/ChannelChats.entity'
import { ChannelMembers } from 'src/entities/ChannelMembers.entity'
import { Channels } from 'src/entities/Channels.entity'
import { Users } from 'src/entities/Users.entity'
import { Workspaces } from 'src/entities/Workspaces.entity'
import { ChannelController } from './channel.controller'
import { ChannelService } from './channel.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels,
      ChannelMembers,
      Workspaces,
      ChannelChats,
      Users,
    ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
