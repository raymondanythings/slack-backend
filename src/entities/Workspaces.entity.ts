import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Channels } from './Channels.entity'
import { DMs } from './DMs.entity'
import { Mentions } from './Mentions.entity'
import { WorkspaceMembers } from './WorkspaceMembers.entity'
import { Users } from './Users.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@Index('name', ['name'], { unique: true })
@Index('url', ['url'], { unique: true })
@Index('OwnerId', ['OwnerId'], {})
@Entity({ schema: 'sleact', name: 'workspaces' })
export class Workspaces {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '슬리액트',
    description: '워크스페이스명',
  })
  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sleact',
    description: 'url 주소',
  })
  @Column('varchar', { name: 'url', unique: true, length: 30 })
  url: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number | null

  @OneToMany(() => Channels, (channels) => channels.Workspace)
  Channels: Channels[]

  @OneToMany(() => DMs, (dms) => dms.Workspace)
  DMs: DMs[]

  @OneToMany(() => Mentions, (mentions) => mentions.Workspace)
  Mentions: Mentions[]

  @OneToMany(
    () => WorkspaceMembers,
    (workspacemembers) => workspacemembers.Workspace,
    { cascade: ['insert'] },
  )
  WorkspaceMembers: WorkspaceMembers[]

  @ManyToOne(() => Users, (users) => users.Workspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  Owner: Users

  @ManyToMany(() => Users, (users) => users.Workspaces)
  Members: Users[]
}
