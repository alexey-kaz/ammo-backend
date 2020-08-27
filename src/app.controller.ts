import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('/post_dash:TabIndex')
  postDash(@Body() saveDashboard: any, @Param ('TabIndex') tabIndex) {
    console.log('postdash')
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
    this.appService.dashboard.push([]);
    return('new tab')
  }

  @Get('/del_tab:TabIndex')
  getDelTab(@Param('TabIndex') tabIndex) {
    console.log('del tab')
    console.log('tabIndex = ' + Number(tabIndex))
    this.appService.dashboard.splice(Number(tabIndex), 1);
    // this.appService.tabs.splice(Number(tabIndex), 1);
    return('del tab')
  }

  @Get('/get_tabs')
  getTabs() {
    console.log('get_tabs')
    console.log(this.appService.dashboard.length)
    return this.appService.dashboard.length;
  }

  @Get('/delete_all_saved')
  getDeleteSaved() {
    console.log('get_delete_saved')
    this.appService.dashboard = [];
    this.appService.getTabsClick = false;
    console.log(this.appService.dashboard.length)
    return ('get_delete_saved');
  }

  @Post('/post_infrastructure_table')
  postInfrastructureTable(@Body() saveInfTable: any) {
    console.log('post_infrastructure_table')
    console.log(saveInfTable)
    this.appService.Infrastructure_table = saveInfTable;
    return this.appService.Infrastructure_table;
  }

  @Get('/get_infrastructure_table')
  getInfrastructureTable() {
    console.log('get_infrastructure_table')
    return this.appService.Infrastructure_table;
  }
}
