import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(
    private server: ServerService
  ) { }

  perform(query: string, f: ResParamFx) {
    this.server.post("admin/query/perform", { query }, (r: Res) => {
      f(r);
    });
  }

}
