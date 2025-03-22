import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private server: ServerService) { }

  submitEmail(freq: number, email: string, f: ResParamFx){
    this.server.post("site/news", {freq, email}, (r: Res) => {
      f(r);
    });
  }
}
