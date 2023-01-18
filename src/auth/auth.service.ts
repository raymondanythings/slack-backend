import { Injectable } from '@nestjs/common'
import { Users } from 'src/entities/Users.entity'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async validateUser({ email, password }: Pick<Users, 'email' | 'password'>) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      select: ['email', 'password', 'nickname', 'id'],
    })
    console.log(user, password)
    if (!user) {
      return null
    }
    const result = await bcrypt.compare(password, user.password)
    if (result) {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  }
}
