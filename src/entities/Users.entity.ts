import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'
import { IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ChannelChats } from './ChannelChats.entity'
import { ChannelMembers } from './ChannelMembers.entity'
import { Channels } from './Channels.entity'
import { DMs } from './DMs.entity'
import { Mentions } from './Mentions.entity'
import { WorkspaceMembers } from './WorkspaceMembers.entity'
import { Workspaces } from './Workspaces.entity'

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'sleact', name: 'users' })
export class Users {
  @ApiProperty({
    example: 1,
    description: '사용자 아이디',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @ApiProperty({
    example: 'akdfhr2@gmail.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string

  @ApiProperty({
    example: 'raymond',
    description: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string

  @ApiProperty({
    example: '123123!#',
    description: '비밀번호',
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string

  @ApiProperty({
    example: '2023-01-18',
    description: '생성일자',
  })
  @CreateDateColumn()
  createdAt: Date

  @ApiProperty({
    example: '2023-01-18',
    description: '갱신일자',
  })
  @UpdateDateColumn()
  updatedAt: Date

  @ApiProperty({
    example: '2023-01-18',
    description: '논리삭제일자',
  })
  @DeleteDateColumn()
  deletedAt: Date | null

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.User)
  ChannelChats: ChannelChats[]

  @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.User)
  ChannelMembers: ChannelMembers[]

  @OneToMany(() => DMs, (dms) => dms.Sender)
  Sender: DMs[]

  @OneToMany(() => DMs, (dms) => dms.Receiver)
  Receiver: DMs[]

  @OneToMany(() => Mentions, (mentions) => mentions.Sender)
  Mentions: Mentions[]

  @OneToMany(() => Mentions, (mentions) => mentions.Receiver)
  Mentions2: Mentions[]

  @OneToMany(
    () => WorkspaceMembers,
    (workspacemembers) => workspacemembers.User,
  )
  WorkspaceMembers: WorkspaceMembers[]

  @OneToMany(() => Workspaces, (workspaces) => workspaces.Owner)
  OwnedWorkspaces: Workspaces[]

  @ManyToMany(() => Workspaces, (workspaces) => workspaces.Members)
  @JoinTable({
    name: 'workspacemembers',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'WorkspaceId',
      referencedColumnName: 'id',
    },
  })
  Workspaces: Workspaces[]

  @ManyToMany(() => Channels, (channels) => channels.Members)
  @JoinTable({
    name: 'channelmembers',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ChannelId',
      referencedColumnName: 'id',
    },
  })
  Channels: Channels[]
}
