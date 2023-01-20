import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'
import { Workspaces } from 'src/entities/Workspaces.entity'
import { Users } from 'src/entities/Users.entity'
import { Channels } from 'src/entities/Channels.entity'
import { ChannelMembers } from 'src/entities/ChannelMembers.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceMembers,
      Workspaces,
      Users,
      Channels,
      ChannelMembers,
    ]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
