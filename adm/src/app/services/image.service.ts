import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { GRes, Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private server: ServerService) { }

  uploadFile(file: File, title: string, f: ResParamFx) {
    let body = new FormData();
    body.append("file", file);
    body.append("title", title);
    this.server.post("admin/post/upload-image", body, (r: Res) => {
      f(r);
    }, true);
  }

  private img: any = null;
  getForPostEdit(f: ResParamFx){
    if(this.img == null){
      this.getImages(r => {
        f(r);
      });
    }
    else{
      f(GRes.succ(this.img));
    }
  }

  getImages(f: ResParamFx) {
    this.server.post("admin/post/get-images", {}, (r: Res) => {
      if(!r.err){
        this.img = r.message;
      }
      f(r);
    });
  }

  editTitle(title: string, id: number, f: ResParamFx) {
    this.server.post("admin/post/edit-image-title", { title, id }, (r: Res) => {
      f(r);
    });
  }

  deleteImage(id: number, f: ResParamFx) {
    this.server.post("admin/post/delete-image", { id }, (r: Res) => {
      f(r);
    });
  }
}
