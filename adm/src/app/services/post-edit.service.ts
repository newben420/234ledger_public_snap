import { Content } from '@shared/db/content';
import { Post } from '@shared/db/post';
import { Injectable } from '@angular/core';
import { BoolParamFx, ResParamFx } from '../env';
import { Router } from '@angular/router';
import { PostService } from './post.service';
import { NoteService } from './note.service';
import { CategoryService } from './category.service';
import { SectionService } from './section.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class PostEditService {

  constructor(
    private router: Router,
    private post: PostService,
    private note: NoteService,
    private cat: CategoryService,
    private sec: SectionService,
    private img: ImageService,
  ) { }

  private isNew: boolean = true;

  private preloaded: boolean = false;

  private cats: any;
  private secs: any;
  private imgs: any;

  getPreloaded(): boolean {
    return this.preloaded;
  }

  private currentPost: Post = new Post();
  private content: Content[] = [];

  newPost() {
    this.currentPost = new Post();
    this.content = [];
    this.isNew = true;
    this.loadPage();
  }

  exit() {
    this.preloaded = false;
  }

  editPost(id: number) {
    this.post.getPostByID(id, r => {
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        this.currentPost = r.message.post as Post;
        this.content = r.message.content as Content[];
        this.isNew = false;
        this.loadPage();
      }
    });
  }

  loadFromEditPage(f: Function) {
    f({
      isNew: this.isNew,
      post: this.currentPost,
      cat: this.cats,
      sec: this.secs,
      img: this.imgs,
      content: this.content,
    });
  }

  private concludeLoading() {
    this.preloaded = true;
    this.router.navigateByUrl("/post/edit");
  }

  private loadPage() {
    this.cat.getForPostEdit(ct => {
      if (ct.err) {
        this.note.show("error", ct.message);
      }
      else {
        this.cats = ct.message
        this.sec.getForPostEdit(sc => {
          if (sc.err) {
            this.note.show("error", sc.message);
          }
          else {
            this.secs = sc.message;
            this.img.getForPostEdit(sc => {
              if (sc.err) {
                this.note.show("error", sc.message);
              }
              else {
                this.imgs = sc.message;
                this.concludeLoading()
              }
            });
          }
        });
      }
    });
  }
}
