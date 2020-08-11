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
  @Get('/cpu')
  getServerCpuInfo() {
    return this.appService.getServerCpuInfo();
  }

  @Get('/ram')
  getServerMemoryInfo() {
    return this.appService.getServerMemoryInfo();
  }

  @Get('/uptime')
  getServerUptimeInfo() {
    return this.appService.getServerUptimeInfo();
  }

}
