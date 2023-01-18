import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/Users.entity'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private authService: AuthService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {
    super()
  }

  serializeUser(user: Users, done: CallableFunction) {
    done(null, user.id)
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: {
          id: +userId,
        },
        select: ['id', 'email', 'nickname'],
        relations: ['Workspaces'],
      })
      done(null, user)
    } catch (err) {
      done(err)
    }
  }
}
