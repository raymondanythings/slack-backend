import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { Users } from 'src/entities/Users.entity'
import { LocalStrategy } from './local.strategy'
import { LocalSerializer } from './local.serializer'

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
