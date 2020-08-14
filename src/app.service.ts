import { Injectable } from '@nestjs/common';
import { watch } from 'fs';
import { execSync } from 'child_process';
import {platform, loadavg, cpus } from 'os';
import { currentLoad, mem } from 'systeminformation';
import { Systeminformation, cpuTemperature, time, cpuCurrentspeed } from 'systeminformation';


@Injectable()
export class AppService {

  private cpuLoadHistory: number[] = [];
  private memoryUsageHistory: number[] = [];

  private memoryInfo: Systeminformation.MemData;
  first_watch = true;
  change = 0;
  listeners = 0;
  watcher;

  constructor(
    
    ) {
        this.getCpuLoadPoint = this.getCpuLoadPointAlt;
        this.getCpuTemp = this.getCpuTempAlt;
  
      setInterval(async () => {
        this.getCpuLoadPoint();
        this.getMemoryUsagePoint();
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

  private async getCpuTemp() {
    const cpuTempData = await cpuTemperature();

    /*if (cpuTempData.main === -1 && this.configService.ui.temp) {
      return this.getCpuTempLegacy();
    } */

    return cpuTempData;
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

  private async getCpuTempAlt() {
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
    let data = getData('src');
    //console.log(data);
    return data;
  }

  getLogData() : string {

    // console.log(this.change + '--')
    this.change--;
    let data = this.getDataHelp();
    return data;
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
}
