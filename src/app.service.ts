import { Injectable } from '@nestjs/common';
import { watch } from 'fs';
import { execSync } from 'child_process';
import { cpus, loadavg } from 'os';
import { cpuTemperature, currentLoad, mem, Systeminformation, time } from 'systeminformation';
import { GridsterItem } from 'angular-gridster2';


@Injectable()
export class AppService {

  private cpuLoadHistory: number[] = [];
  private memoryUsageHistory: number[] = [];

  private memoryInfo: Systeminformation.MemData;
  first_watch = true;
  change = 0;
  listeners = 0;
  watcher;
  dashboard: Array<GridsterItem[]> = [];

  constructor()
  {
        this.getCpuLoadPoint = this.getCpuLoadPointAlt;
        AppService.getCpuTemp = AppService.getCpuTempAlt;
  
      setInterval(async () => {
        await this.getCpuLoadPoint();
        await this.getMemoryUsagePoint();
      }, 1000);
    }

  private async getMemoryUsagePoint() {
    const memory = await mem();
    this.memoryInfo = memory;

    const memoryFreePercent = ((memory.total - memory.available) / memory.total) * 100;
    this.memoryUsageHistory = this.memoryUsageHistory.slice(-60);
    this.memoryUsageHistory.push(memoryFreePercent);
  }

  private async getCpuLoadPoint() {
    const currtLoad = (await currentLoad()).currentload;
    this.cpuLoadHistory = this.cpuLoadHistory.slice(-60);
    this.cpuLoadHistory.push(currtLoad);
  }

  private async getCpuLoadPointAlt() {
    const currentLoad = (loadavg()[0] * 100 / cpus().length);
    this.cpuLoadHistory = this.cpuLoadHistory.slice(-60);
    this.cpuLoadHistory.push(currentLoad);
  }

  public async getServerCpuInfo() {
    return cpus();
  }

  private static async getCpuTemp() {
    /*if (cpuTempData.main === -1 && this.configService.ui.temp) {
      return this.getCpuTempLegacy();
    } */

    return await cpuTemperature();
  }


  public async getServerMemoryInfo() {
    if (!this.memoryUsageHistory.length) {
      await this.getMemoryUsagePoint();
    }

    return {
      mem: this.memoryInfo,
      memoryUsageHistory: this.memoryUsageHistory,
    };
  }
  public async getServerUptimeInfo() {
    return {
      time: await time(),
      processUptime: process.uptime(),
    };
  }

  private static async getCpuTempAlt() {
    return {
      main: -1,
      cores: [],
      max: -1,
    };
  }

  getDataHelp(): string{
    function run(cwd, command) {
      return execSync(command, { cwd, encoding: "utf8" });
    }
    function getData(cwd) {
      return run(cwd, 'tail -n 10 /Users/air/backend-v0.1/textLogFile');
    }
    //console.log(data);
    return getData('src');
  }

  getLogData() : string {

    // console.log(this.change + '--')
    this.change--;
    return this.getDataHelp();
  }

  getLogListener() : string {
    this.listeners++;
    this.change++;
    // console.log('listeners++ = ' + this.listeners)
    return this.getDataHelp();
  }

  getLogChange() : boolean {
    if (this.first_watch === true) {
      this.watcher = watch('textLogFile', (eventType, filename) => {
        if (filename) {
          // console.log(`${filename} file Changed`);
          // console.log(this.listeners);
          // console.log('this.change += this.listeners');
          this.change += this.listeners;
          // console.log('this.change = ' + this.change);
        }
      });
      // console.log('this.first_watch = false')
      this.first_watch = false;
    }
      // console.log('getLogChange ' + (this.change > 0))
      return (this.change > 0);
  }

  getLogDelete() : boolean {
    this.listeners--;
    // console.log(this.first_watch);
    this.first_watch = true;
    return false;
  }

  postDashboardChange(saveDashboard: any, tabIndex: number) {
    this.dashboard[tabIndex] = saveDashboard;
    console.log(this.dashboard)
  }
}
