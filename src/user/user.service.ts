import { Users } from 'src/entities/Users.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JoinRequestDto } from './dtos/join.request.dto'
import { Repository } from 'typeorm'
import bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async joinUser({ email, nickname, password }: JoinRequestDto) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.')
    }

    const newPassword = await bcrypt.hash(password, +process.env.HASH_SALT)
    return this.userRepository.save(
      this.userRepository.create({
        email,
        nickname,
        password: newPassword,
      }),
    )
  }
}
