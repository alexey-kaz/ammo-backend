import { Injectable } from '@nestjs/common';
import {readFileSync} from 'fs';

@Injectable()
export class AppService {
  getlog() : string {
    const data = readFileSync('/Users/air/backend-v0.2/.env', {encoding: 'utf-8'});
    return data;
  }
}
