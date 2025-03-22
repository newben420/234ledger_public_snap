import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private server: ServerService
  ) { }

  loadComponent(f: ResParamFx) {
    this.server.post("admin/email/load", {}, (r: Res) => {
      f(r);
    });
  }

  deleteEmail(freq: string, f: ResParamFx){
    this.server.post("admin/email/delete", { freq }, (r: Res) => {
      f(r);
    });
  }
}
