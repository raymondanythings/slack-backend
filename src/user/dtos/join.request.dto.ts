import { ApiProperty } from '@nestjs/swagger/dist/decorators'

export class JoinRequestDto {
  @ApiProperty({
    example: 'akdfhr2@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string

  @ApiProperty({
    example: 'raymond',
    description: '닉네임',
    required: true,
  })
  public nickname: string

  @ApiProperty({
    example: '123123!#',
    description: '비밀번호',
    required: true,
  })
  public password: string
}
