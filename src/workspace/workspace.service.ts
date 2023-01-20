import { CreateWorkspaceDto } from './dtos/create-workspace.dto'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ChannelMembers } from 'src/entities/ChannelMembers.entity'
import { Channels } from 'src/entities/Channels.entity'
import { Users } from 'src/entities/Users.entity'
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity'
import { Workspaces } from 'src/entities/Workspaces.entity'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspaces)
    private readonly workspaceRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private readonly channelRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private readonly workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private readonly channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return this.workspaceRepository.findOne({ where: { id } })
  }

  async findMyWorkspaces(myId: number) {
    return this.workspaceRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    })
  }

  async createWorkspace(createWorkspaceDto: CreateWorkspaceDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const workspaceRunner = queryRunner.manager.getRepository(Workspaces)
      const workspaceMembersRunner =
        queryRunner.manager.getRepository(WorkspaceMembers)
      const channelRunner = queryRunner.manager.getRepository(Channels)
      const channelMembersRunner =
        queryRunner.manager.getRepository(ChannelMembers)
      const workspace = await workspaceRunner.save(
        workspaceRunner.create({
          ...createWorkspaceDto,
          OwnerId: createWorkspaceDto.myId,
        }),
      )
      const workspaceMember = workspaceMembersRunner.create({
        UserId: createWorkspaceDto.myId,
        WorkspaceId: workspace.id,
      })
      const channel = channelRunner.create({
        name: '일반',
        WorkspaceId: workspace.id,
      })

      const [, channelReturned] = await Promise.all([
        workspaceMembersRunner.save(workspaceMember),
        channelRunner.save(channel),
      ])
      const result = await channelMembersRunner.save(
        channelMembersRunner.create({
          UserId: createWorkspaceDto.myId,
          ChannelId: channelReturned.id,
        }),
      )
      await queryRunner.commitTransaction()
      return result
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.WorkspaceMembers', 'm')
      .innerJoin('m.Workspace', 'w', 'w.url = :url', { url })
      .getMany()
  }

  async createWorkspaceMembers(url: string, email: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { url },
      relations: ['Channels'],
    })

    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) {
      return null
    }

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.connect()

    try {
      await queryRunner.startTransaction()
      await Promise.all([
        queryRunner.manager.save(
          WorkspaceMembers,
          queryRunner.manager.create(WorkspaceMembers, {
            WorkspaceId: workspace.id,
            UserId: user.id,
          }),
        ),
        queryRunner.manager.save(
          ChannelMembers,
          queryRunner.manager.create(ChannelMembers, {
            ChannelId: workspace.Channels.find((y) => y.name === '일반').id,
            UserId: user.id,
          }),
        ),
      ])
      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      queryRunner.release()
    }
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('u')
      .where({ id })
      .innerJoinAndSelect('m.Workspace', 'w', 'w.url = :url', { url })
      .getOne()
  }
}
