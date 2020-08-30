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

  @Post('/post_infrastructure_table:method')
  async postInfrastructureTable(@Body() saveInfTable: any,
                                @Param('method') method) {
    console.log('post_infrastructure_table')
    console.log(saveInfTable)
    console.log(this.appService.hosts)
    let obj = {'vm': saveInfTable['vm'], 'ip': saveInfTable['ip'], 'isEditable': false}
    if (method == 'create') {
      console.log('create')
      this.appService.saveInfTable[this.appService.key].push(obj)
      const host = await this.appService.zabbix.request('host.create', {
        host: saveInfTable['vm'],
        groups: [{ groupid: '6' }],
        templates: [{ templateid: '10272' }],
        interfaces: [{
          type: 1,
          main: 1,
          useip: 1,
          ip: saveInfTable['ip'],
          dns: '',
          port: '10050'
        }]
      })
      this.appService.hosts[saveInfTable['vm']] = host['hostids'][0];
      console.log(host)
      console.log(this.appService.hosts)
    } else {
      if (method == 'delete') {
        console.log('delete')

        let index = -1;
        let val = saveInfTable['vm']
        let filteredObj = this.appService.saveInfTable[this.appService.key].find(function(item, i){
          if(item.vm === val){
            index = i;
            return item.vm;
          }
        });
        console.log(index, ',', filteredObj);
        this.appService.saveInfTable[this.appService.key].splice(index,1)

        console.log(this.appService.saveInfTable[this.appService.key])
        console.log(this.appService.hosts)
        console.log(this.appService.hosts[saveInfTable['vm']])
        const host = await this.appService.zabbix.request('host.delete', [
          this.appService.hosts[saveInfTable['vm']]
        ])
        console.log(host)
      } else {
        console.log("Error in method name")
      }
    }
    return this.appService.Infrastructure_table;
  }

  @Get('/get_infrastructure_table')
  getInfrastructureTable() {
    console.log('get_infrastructure_table')
    return this.appService.saveInfTable;
  }

  @Post('/post_auth_token')
  postAuthToken(@Body() authTok: any) {
    console.log('post_auth_token')
    console.log(authTok.result)
    this.appService.authToken = authTok.result;
    return this.appService.authToken;
  }

  @Get('/get_auth_token')
  getAuthToken() {
    console.log('get_auth_token')
    console.log(this.appService.authToken)
    return this.appService.authToken;
  }

  @Get('/get_zabbix_cpu')
  async getZabbixCpu() {
    console.log('get_zabbix_cpu')
    console.log(this.appService.authToken)
    console.log(this.appService.hosts['server'])
    const cpu = await this.appService.zabbix.request(
      'item.get', {
        'hostids': this.appService.hosts['server'],
        "output": "extend",
        "search": {
          "key_": "system.cpu.load[all,avg1]"
        },
        "sortfield": "name"
      }
    )
    console.log(cpu)
    return cpu;
  }
}
