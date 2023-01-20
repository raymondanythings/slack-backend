import { PickType } from '@nestjs/swagger'
import { Workspaces } from 'src/entities/Workspaces.entity'

export class CreateWorkspaceDto extends PickType(Workspaces, ['name', 'url']) {
  myId: number
}
