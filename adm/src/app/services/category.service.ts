import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { GRes, GSRes, Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private server: ServerService) { }

  addCategory(title: string, slug: string, f: ResParamFx) {
    this.server.post("admin/admin/add-category", { title, slug }, (r: Res) => {
      f(r);
    });
  }

  private cat: any = null;
  getForPostEdit(f: ResParamFx){
    if(this.cat == null){
      this.getCategories(r => {
        f(r);
      });
    }
    else{
      f(GRes.succ(this.cat));
    }
  }

  getCategories(f: ResParamFx) {
    this.server.post("admin/admin/get-categories", {}, (r: Res) => {
      if(!r.err){
        this.cat = r.message;
      }
      f(r);
    });
  }

  editTitle(title: string, id: number, f: ResParamFx) {
    this.server.post("admin/admin/edit-title", { title, id }, (r: Res) => {
      f(r);
    });
  }

  editSlug(slug: string, id: number, f: ResParamFx) {
    this.server.post("admin/admin/edit-slug", { slug, id }, (r: Res) => {
      f(r);
    });
  }

  deleteCategory(id: number, f: ResParamFx) {
    this.server.post("admin/admin/delete-category", { id }, (r: Res) => {
      f(r);
    });
  }
}
