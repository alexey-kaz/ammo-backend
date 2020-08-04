import { Injectable } from '@nestjs/common';
import { watch } from 'fs';
import { execSync } from 'child_process';

@Injectable()
export class AppService {
  first_watch = true;
  change = 0;
  listeners = 0;
  watcher;

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
