import { PickType } from '@nestjs/swagger'
import { Users } from 'src/entities/Users.entity'

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
]) {
  public password: string
}
