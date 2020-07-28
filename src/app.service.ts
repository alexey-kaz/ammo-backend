import { Injectable } from '@nestjs/common';
import {readFileSync} from 'fs';

@Injectable()
export class AppService {
  getlog() : string {
    const data = readFileSync('.env').toString();
    const re = /\n/g;
    const newstr = data.replace(re, "<br />");
    return newstr;
  }
}
