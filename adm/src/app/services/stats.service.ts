import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(
    private server: ServerService,
  ) { }

  loadStats(f: ResParamFx){
    this.server.post("admin/stats/get", {}, (r: Res) => {
      f(r);
    });
  }
}
