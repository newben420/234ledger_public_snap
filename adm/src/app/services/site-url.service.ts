import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { BoolParamFx, StrOrNullParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class SiteUrlService {

  private siteURL: string | null = null;

  private loadSiteURL(f: BoolParamFx) {
    this.server.post("admin/site-url", {}, (r: Res) => {
      if(!r.err){
        this.siteURL = r.message;
      }
      f(!r.err);
    });
  }

  getBase(f: StrOrNullParamFx){
    if(this.siteURL == null){
      this.loadSiteURL(r => {
        f(this.siteURL);
      })
    }
    else{
      f(this.siteURL);
    }
  }

  constructor(private server: ServerService) { }
}
