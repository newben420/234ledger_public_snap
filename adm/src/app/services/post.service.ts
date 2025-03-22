import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { ResParamFx } from '../env';
import { Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private server: ServerService
  ) { }

  getPostByID(id: number, f: ResParamFx) {
    this.server.post("admin/post/get-post", { id }, (r: Res) => {
      f(r);
    });
  }

  savePost(body: any, f: ResParamFx){
    this.server.post("admin/post/save", body, (r: Res) => {
      f(r);
    });
  }

  getPosts(f: ResParamFx) {
    this.server.post("admin/post/get-posts", {}, (r: Res) => {
      f(r);
    });
  }

  getComments(id: number, f: ResParamFx) {
    this.server.post("admin/post/get-comments", { id }, (r: Res) => {
      f(r);
    });
  }

  deleteComment(id: number, f: ResParamFx){
    this.server.post("admin/post/delete-comment", { id }, (r: Res) => {
      f(r);
    });
  }

  deleteComments(id: number, f: ResParamFx){
    this.server.post("admin/post/delete-comments", { id }, (r: Res) => {
      f(r);
    });
  }

  unpublishPost(id: number, f: ResParamFx) {
    this.server.post("admin/post/unpublish-post", { id }, (r: Res) => {
      f(r);
    });
  }

  deletePost(id: number, f: ResParamFx) {
    this.server.post("admin/post/delete-post", { id }, (r: Res) => {
      f(r);
    });
  }
}
