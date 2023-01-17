import { Injectable } from '@nestjs/common'
import { JoinRequestDto } from './dtos/join.request.dto'

@Injectable()
export class UserService {
  postUser(user: JoinRequestDto) {
    return user
  }
}
