import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Users } from 'src/entities/Users.entity'
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity'
import { ChannelMembers } from 'src/entities/ChannelMembers.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
