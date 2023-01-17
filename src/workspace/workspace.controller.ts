import { Controller, Get, Post } from '@nestjs/common'

@Controller('workspace')
export class WorkspaceController {
  @Get()
  getMyWorkspace() {
    return ';'
  }

  @Post()
  createWorkspace() {}
}
