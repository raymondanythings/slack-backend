import { CreateWorkspaceDto } from './dtos/create-workspace.dto'
import { Controller, Delete, Get, Post, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'
import { Users } from 'src/entities/Users.entity'
import { User } from 'src/user/user.decorator'
import { WorkspaceService } from './workspace.service'

@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspacesService: WorkspaceService) {}

  @Get()
  getMyWorkspace(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id)
  }

  @Post()
  createWorkspace(
    @User() user: Users,
    createWorkspaceDto: Omit<CreateWorkspaceDto, 'myId'>,
  ) {
    return this.workspacesService.createWorkspace({
      myId: user.id,
      ...createWorkspaceDto,
    })
  }

  @Get(':url/members')
  getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url)
  }

  @Post(':url/members')
  inviteMemberFromWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoFromWorkspace() {}
}
