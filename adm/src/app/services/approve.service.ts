import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class ApproveService {

  constructor(
    private server: ServerService
  ) { }

  getPosts(f: ResParamFx) {
    this.server.post("admin/approve/get-posts", { }, (r: Res) => {
      f(r);
    });
  }

  getPostContents(id: number, f: ResParamFx) {
    this.server.post("admin/approve/get-post-content", { id } , (r: Res) => {
      f(r);
    });
  }

  approvePost(id: number, f: ResParamFx) {
    this.server.post("admin/approve/approve-post", { id } , (r: Res) => {
      f(r);
    });
  }

  approveComment(id: number, f: ResParamFx) {
    this.server.post("admin/approve/approve-comment", { id } , (r: Res) => {
      f(r);
    });
  }

  getComments(f: ResParamFx){
    this.server.post("admin/approve/get-comments", { }, (r: Res) => {
      f(r);
    });
  }

  deleteComment(id: number, f: ResParamFx){
    this.server.post("admin/approve/delete-comment", { id }, (r: Res) => {
      f(r);
    });
  }
}
