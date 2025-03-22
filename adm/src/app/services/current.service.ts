import { Injectable } from '@angular/core';
import { ResParamFx } from '../env';
import { SectionService } from './section.service';
import { ServerService } from './server.service';
import { GRes, Res } from '@shared/model/res';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  constructor(
    private sec: SectionService,
    private server: ServerService,
  ) { }

  private secs!: any[];
  private postID!: number;
  private content!: any[];

  getDataFromComponent(f: Function) {
    f({
      section: this.secs,
      postID: this.postID,
      content: this.content,
    });
  }

  private loaded: boolean = false;
  resetLoaded() {
    this.loaded = false;
  }

  getLoadedStatus(): boolean {
    return this.loaded;
  }

  private ensureCurrentPost(f: ResParamFx) {
    this.server.post("admin/current/get-content", {}, (r: Res) => {
      f(r);
    });
  }

  loadCurrent() {
    return new Promise<Res>((resolve, reject) => {
      this.sec.getForPostEdit(sc => {
        if (sc.err) {
          resolve(sc);
        }
        else {
          this.secs = sc.message;
          this.ensureCurrentPost(r => {
            if (r.err) {
              resolve(r);
            }
            else {
              this.loaded = true;
              this.postID = r.message.postID;
              this.content = r.message.content;
              resolve(GRes.succ());
            }
          });
        }
      });
    });
  }

  saveContent(body: any, f: ResParamFx) {
    this.server.post("admin/current/save", body, (r: Res) => {
      f(r);
    });
  }

  getYesterdayContentIDs(id: number, f: ResParamFx) {
    this.server.post("admin/current/yester-ids", { id }, (r: Res) => {
      f(r);
    });
  }

  validatePostSlug(slug: string, f: ResParamFx) {
    this.server.post("admin/current/validate-post-slug", { slug }, (r: Res) => {
      f(r);
    });
  }

  convert(title: string, slug: string, ids: number[], category: number, f: ResParamFx){
    this.server.post("admin/current/convert-yesterday", { title, slug, ids, category }, (r: Res) => {
      f(r);
    });
  }
}
