import { ApiProperty } from '@nestjs/swagger/dist/decorators'
import { JoinRequestDto } from './join.request.dto'
export class UserDto extends JoinRequestDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: '아이디',
    examples: ['sdfd', 'sdfd', 'sdfd'],
  })
  id: number
}
