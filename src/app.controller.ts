import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }
  @Get('loglistener')
  getListen(): string {
    return this.appService.getLogListener();
  }
  @Get('change')
  getChange(): boolean {
    return this.appService.getLogChange();
  }
  @Get('data')
  getLog(): string {
    return this.appService.getLogData();
  }
  @Get('delete')
  delLog(): boolean {
    return this.appService.getLogDelete();
  }
}
