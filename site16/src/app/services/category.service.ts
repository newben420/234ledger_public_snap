import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { GRes, Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: any[] | null = null;

  openedCategory: number = 0;
  openedCategoryTitle: string = "";
  openedCategorySlug: string = "";

  get(f: ResParamFx){
    if(this.categories != null){
      f(GRes.succ(this.categories));
    }
    else{
      this.server.get("site/categories", (r: Res) => {
        if(r.err){
          f(r);
        }
        else{
          this.categories =  r.message;
          f(r);
        }
      });
    }
  }

  constructor(private server: ServerService) { }
}
