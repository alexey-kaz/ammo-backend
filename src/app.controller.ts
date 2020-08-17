import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GridsterItem } from 'angular-gridster2';

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

  @Post('/post_dash:TabIndex')
  postDash(@Body() saveDashboard: any, @Param ('TabIndex') tabIndex) {
    console.log('savedash')
    console.log('tabIndex = ' + Number(tabIndex))
    console.log(saveDashboard)
    return this.appService.postDashboardChange(saveDashboard, Number(tabIndex));
  }

  @Get('/get_dash:TabIndex')
  async getDash(@Param ('TabIndex') tabIndex) {
    console.log('getdash')
    console.log('tabIndex = ' + Number(tabIndex))
    console.log(this.appService.dashboard[Number(tabIndex)])
    return this.appService.dashboard[Number(tabIndex)];
  }

  @Get('/new_tab')
  getNewTab() {
    console.log('new tab')
    const tmp : GridsterItem[] = [{ cols: 0, rows: 0, x: 0, y: 0 }]
    console.log(tmp)
    this.appService.dashboard.push(tmp);
    return('new tab')
  }

  @Get('/del_tab:TabIndex')
  getDelTab(@Param('TabIndex') tabIndex) {
    console.log('del tab')
    console.log('tabIndex = ' + Number(tabIndex))
    this.appService.dashboard.splice(Number(tabIndex), 1);
    return('del tab')
  }
}
