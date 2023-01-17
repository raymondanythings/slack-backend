import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { Workspaces } from '../../entities/Workspaces.entity'
import { Channels } from '../../entities/Channels.entity'

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const workspaceRepository = dataSource.getRepository(Workspaces)
    await workspaceRepository.insert([
      {
        id: 1,
        name: 'Sleact',
        url: 'sleact',
      },
    ])

    const channelsRepository = dataSource.getRepository(Channels)
    await channelsRepository.insert([
      {
        id: 1,
        name: '일반',
        WorkspaceId: 1,
        private: false,
      },
    ])
  }
}
