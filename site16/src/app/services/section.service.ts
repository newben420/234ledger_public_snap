import { Injectable } from '@angular/core';
import { GRes, Res } from '@shared/model/res';
import { ResParamFx } from '../env';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  sections: any[] | null = null;

  openedSection: number = 0;
  openedSectionTitle: string = "";
  openedSectionSlug: string = "";

  get(f: ResParamFx){
    if(this.sections!= null){
      f(GRes.succ(this.sections));
    }
    else{
      this.server.get("site/sections", (r: Res) => {
        if(r.err){
          f(r);
        }
        else{
          this.sections =  r.message;
          f(r);
        }
      });
    }
  }

  constructor(private server: ServerService) { }
}
