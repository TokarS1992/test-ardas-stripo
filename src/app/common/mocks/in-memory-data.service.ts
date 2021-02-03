import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { TEMPLATES } from './in-memory-data';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {
  constructor() {}

  public createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
    return {
      templates: TEMPLATES
    };
  }
}
