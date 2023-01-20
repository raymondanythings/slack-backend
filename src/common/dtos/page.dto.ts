import { IsNotEmpty, IsNumber } from 'class-validator'

export class PageDtos {
  @IsNumber()
  @IsNotEmpty()
  page: number
  @IsNumber()
  @IsNotEmpty()
  perPage: number
}
