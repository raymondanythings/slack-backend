import { Controller, Delete, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator'

@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  @Get()
  getMyWorkspace() {}

  @Post()
  createWorkspace() {}

  @Get(':url/members')
  getAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMemberFromWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoFromWorkspace() {}
}
