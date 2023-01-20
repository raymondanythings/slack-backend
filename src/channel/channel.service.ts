import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Channels } from 'src/entities/Channels.entity'
import { DataSource, MoreThan, Repository } from 'typeorm'
import { ChannelMembers } from 'src/entities/ChannelMembers.entity'
import { Workspaces } from 'src/entities/Workspaces.entity'
import { ChannelChats } from 'src/entities/ChannelChats.entity'
import { Users } from 'src/entities/Users.entity'

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channels)
    private readonly channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private readonly channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private readonly workspaceRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private readonly channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } })
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channdelMembers',
        'channelMembers.userId = :myId',
        { myId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getMany()
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository.findOne({
      where: {
        name,
      },
      relations: ['Workspace'],
    })
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: myId },
    })
    if (!workspace) {
      return false
    }
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const channel = await queryRunner.manager.save(
        Channels,
        queryRunner.manager.create(Channels, {
          name,
          WorkspaceId: workspace.id,
        }),
      )
      return queryRunner.manager
        .save(
          ChannelMembers,
          queryRunner.manager.create(ChannelMembers, {
            UserId: myId,
            ChannelId: channel.id,
          }),
        )
        .then(() => queryRunner.commitTransaction())
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name = :name', { name })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany()
  }

  async createWorkspaceChannelMembers(url, name, email) {
    const channel = await this.channelsRepository.findOne({
      where: {
        name,
        Workspace: {
          url,
        },
      },
    })
    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.')
    }

    const user = await this.usersRepository.findOne({
      where: {
        email,
        Workspaces: {
          url,
        },
      },
    })
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.')
    }

    return this.channelMembersRepository.save(
      this.channelMembersRepository.create({
        ChannelId: channel.id,
        UserId: user.id,
      }),
    )
  }
  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository.find({
      where: {
        Channel: {
          name,
          Workspace: {
            url,
          },
        },
      },
      relations: ['Users'],
      order: {
        createdAt: 'DESC',
      },
      take: perPage,
      skip: perPage * (page - 1),
    })
  }

  async getChannelUnreadsCount(url: string, name: string, after: number) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne()
    return this.channelChatsRepository.count({
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)),
      },
    })
  }

  async postChat({ url, name, content }, user: Users) {
    const channel = await this.channelsRepository.findOne({
      where: {
        Workspace: {
          url,
        },
        name,
      },
    })
    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.')
    }
    const newChat = await this.channelChatsRepository.save(
      this.channelChatsRepository.create({
        content,
        UserId: user.id,
        ChannelId: channel.id,
      }),
    )
    newChat.Channel = channel
    newChat.User = user

    // socket
  }
}
