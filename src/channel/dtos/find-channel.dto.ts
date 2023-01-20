import { IsNotEmpty, IsString } from 'class-validator'

export class findChannelDto {
  @IsString()
  @IsNotEmpty()
  url: string
  @IsString()
  @IsNotEmpty()
  name: string
}
