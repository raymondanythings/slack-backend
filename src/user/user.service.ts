import { Users } from 'src/entities/Users.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JoinRequestDto } from './dtos/join.request.dto'
import { DataSource, Repository } from 'typeorm'
import bcrypt from 'bcrypt'
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers.entity'
import { ChannelMembers } from 'src/entities/ChannelMembers.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private readonly workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private readonly channelMembersRepository: Repository<ChannelMembers>,
    private readonly dataSource: DataSource,
  ) {}

  async joinUser({ email, nickname, password }: JoinRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const userRunner = queryRunner.manager.getRepository(Users)
    const workspaceMembersRunner =
      queryRunner.manager.getRepository(WorkspaceMembers)
    const channelMembersRunner =
      queryRunner.manager.getRepository(ChannelMembers)
    const user = await this.userRepository.findOne({ where: { email } })
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.')
    }
    try {
      const newPassword = await bcrypt.hash(password, +process.env.HASH_SALT)
      const newUser = await userRunner.save(
        userRunner.create({
          email,
          nickname,
          password: newPassword,
        }),
      )
      await workspaceMembersRunner.save(
        workspaceMembersRunner.create({
          UserId: newUser.id,
          WorkspaceId: 1,
        }),
      )

      await channelMembersRunner.save(
        channelMembersRunner.create({
          ChannelId: 1,
          UserId: newUser.id,
        }),
      )

      await queryRunner.commitTransaction()
      const { password: hidePassword, ...result } = newUser
      return result
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
