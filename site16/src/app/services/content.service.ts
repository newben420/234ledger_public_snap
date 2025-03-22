import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ServerService } from './server.service';
import { BoolParamFx, ResParamFx } from '../env';
import { Res } from '@shared/model/res';
import { NoteService } from './note.service';
import { isPlatformBrowser } from '@angular/common';
import { PromptService } from '../shared/prompt/prompt.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private server: ServerService,
    private nte: NoteService,
    @Inject(PLATFORM_ID) private platformID: object,
    // private prompt: PromptService,
  ) { }

  loadHomeInitial(f: ResParamFx) {
    this.server.get("site/home/init", (r: Res) => {
      f(r);
    });
  }

  loadHomeMore(index: number, f: ResParamFx) {
    this.server.get("site/home/more/" + index, (r: Res) => {
      f(r);
    });
  }

  loadPostsByCategory(index: number, category: number, f: ResParamFx) {
    this.server.get("site/category/" + category + "/" + index, (r: Res) => {
      f(r);
    });
  }

  loadPostsBySection(index: number, section: number, f: ResParamFx) {
    this.server.get("site/section/" + section + "/" + index, (r: Res) => {
      f(r);
    });
  }

  loadComments(index: number, postID: number, f: ResParamFx) {
    this.server.get("site/comments/" + postID + "/" + index, (r: Res) => {
      f(r);
    });
  }

  makeComment(name: string, contact: string, comment: string, pid: number, f: ResParamFx) {
    this.server.post("site/comment", { name, contact, comment, pid }, (r: Res) => {
      f(r);
    });
  }

  openedPost: any = {};
  openedContent: any[] = [];
  relatedPosts: any[] = [];
  category: any = {};

  loadPost(slug: string, f: BoolParamFx, note: boolean = false) {
    this.server.get("site/post/" + slug, (r: Res) => {
      if (r.err) {
        if (note) {
          if (isPlatformBrowser(this.platformID)) {
            setTimeout(() => {
              if (document) {
                this.nte.show("error", r.message);
              }
            }, 500);
          }

        }
        f(false);
      }
      else {
        this.openedPost = r.message.post;
        this.openedContent = r.message.content;
        this.relatedPosts = r.message.rel;
        this.category =
          f(true);
      }
    });
  }

  savePostAnalytics(loc: string, pid: number, f: ResParamFx){
    this.server.post("site/post-analytics", { loc, pid }, (r: Res) => {
      f(r);
    });
  }

  saveVisits(loc: string, f: ResParamFx){
    this.server.post("site/visits", { loc }, (r: Res) => {
      f(r);
    });
  }

  search(key: string, f: ResParamFx){
    this.server.post("site/search", { key }, (r: Res) => {
      f(r);
    });
  }
}
