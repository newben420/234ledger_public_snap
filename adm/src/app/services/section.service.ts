import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { GRes, Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  constructor(private server: ServerService) { }

  addSection(title: string, slug: string, f: ResParamFx) {
    this.server.post("admin/admin/add-section", { title, slug }, (r: Res) => {
      f(r);
    });
  }

  private sec: any = null;
  getForPostEdit(f: ResParamFx){
    if(this.sec == null){
      this.getSections(r => {
        f(r);
      });
    }
    else{
      f(GRes.succ(this.sec));
    }
  }

  getSections(f: ResParamFx) {
    this.server.post("admin/admin/get-sections", {}, (r: Res) => {
      if(!r.err){
        this.sec = r.message;
      }
      f(r);
    });
  }

  editTitleSection(title: string, id: number, f: ResParamFx) {
    this.server.post("admin/admin/edit-title-section", { title, id }, (r: Res) => {
      f(r);
    });
  }

  editSlugSection(slug: string, id: number, f: ResParamFx) {
    this.server.post("admin/admin/edit-slug-section", { slug, id }, (r: Res) => {
      f(r);
    });
  }

  deleteSection(id: number, f: ResParamFx) {
    this.server.post("admin/admin/delete-section", { id }, (r: Res) => {
      f(r);
    });
  }
}
