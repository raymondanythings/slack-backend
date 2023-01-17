import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import Joi from 'joi'
import { LoggerMiddleware } from './logger/logger.middleware'
import { UserModule } from './user/user.module'
import { ChannelModule } from './channel/channel.module'
import { WorkspaceModule } from './workspace/workspace.module'
import { DmModule } from './dm/dm.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChannelChats } from './entities/ChannelChats.entity'
import { ChannelMembers } from './entities/ChannelMembers.entity'
import { Channels } from './entities/Channels.entity'
import { DMs } from './entities/DMs.entity'
import { Mentions } from './entities/Mentions.entity'
import { Users } from './entities/Users.entity'
import { WorkspaceMembers } from './entities/WorkspaceMembers.entity'
import { Workspaces } from './entities/Workspaces.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_TYPE: Joi.string().required(),
        PORT: Joi.string(),
      }),
    }),
    UserModule,
    ChannelModule,
    WorkspaceModule,
    DmModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      // migrations: [__dirname + '/src/migrations/*.ts'],
      charset: 'utf8mb4',
      // logger: 'debug',
      entities: [
        ChannelChats,
        ChannelMembers,
        Channels,
        DMs,
        Mentions,
        Workspaces,
        WorkspaceMembers,
        Users,
      ],
    }),
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
