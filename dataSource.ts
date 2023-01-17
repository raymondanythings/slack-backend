import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { ChannelChats } from './src/entities/ChannelChats.entity'
import { ChannelMembers } from './src/entities/ChannelMembers.entity'
import { Channels } from './src/entities/Channels.entity'
import { DMs } from './src/entities/DMs.entity'
import { Mentions } from './src/entities/Mentions.entity'
import { Users } from './src/entities/Users.entity'
import { WorkspaceMembers } from './src/entities/WorkspaceMembers.entity'
import { Workspaces } from './src/entities/Workspaces.entity'
import path from 'path'

dotenv.config({
  path: path.join(__dirname, '.env.dev'),
})

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4_general_ci',
  synchronize: false,
  logging: true,
})

export default dataSource
