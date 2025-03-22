import { ThemeService } from './../../../../services/theme.service';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { PostEditService } from '../../../../services/post-edit.service';
import { Post } from '@shared/db/post';
import { Router } from '@angular/router';
import { NoteService } from '../../../../services/note.service';
import { LocaleService } from '../../../../services/locale.service';
import { LocalRegex } from '@shared/model/regex';
import { Slugify } from '@shared/slugify';
import { Content } from '@shared/db/content';
import { PromptService } from '../../../../shared/prompt/prompt.service';
import { ThemeColors } from '@shared/model/colors';
import { ResParamFx } from '../../../../env';
import { GRes } from '@shared/model/res';
import { PostService } from '../../../../services/post.service';
import { PreloaderService } from '../../../../services/preloader.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent {
  isNew: boolean = true;
  post: Post = new Post();
  cat: any[] = [];
  sec: any[] = [];
  img: any[] = [];
  content: Content[] = [];
  colors: string[] = [];
  swicthSpeed: number = 300;
  swicthWidth: number = 40;
  swicthHeight: number = 25;
  ico: any = {
    cl: "bi bi-grid-fill",
    fs: '14px'
  }
  @ViewChild('form', { read: ElementRef }) myForm!: ElementRef;
  pattern = LocalRegex;

  constructor(
    private pedit: PostEditService,
    private router: Router,
    private note: NoteService,
    private locale: LocaleService,
    private prompt: PromptService,
    private theme: ThemeService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private prel: PreloaderService,
    private postService: PostService,
  ) {
    pedit.loadFromEditPage((r: any) => {
      this.isNew = r.isNew;
      this.post = r.post;
      this.cat = r.cat as any[];
      this.sec = r.sec as any[];
      this.img = r.img as any[];
      this.content = r.content as Content[];

      this.colors = theme.isDark.value ? ThemeColors.monochrome.map(x => x).reverse() : ThemeColors.monochrome.map(x => x);
    });
  }

  quillMaxLength: number = parseInt(import.meta.env["NG_APP_QUILL_MAXLENGTH"]);

  ngOnDestroy() {

  }

  quillEditorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        ['link', 'strike', 'blockquote',],
      ],
    }
  }


  quillOnChangeHandler(event: any, sid: number, index: number) {
    let text = event.html;
    let start: number = 0;
    let realIndex: number = -1;
    this.content.forEach((x, i) => {
      if (x.section_id == sid) {
        if (start == index) {
          realIndex = i;
        }
        start++;
      }
    });
    if (realIndex != -1) {
      this.content[realIndex].body = text || "";
    }
  }

  catStuff(): any[] {
    return this.cat || [];
  }

  imgStuff(): any[] {
    return this.img || [];
  }

  toBool(x: any): boolean {
    return x == 1 && x == true;
  }

  addSection() {
    let currentContentSectionIds: number[] = this.content.map(x => parseInt(x.section_id?.toString() || '0'));
    let sectionsNotInContent: any[] = (this.sec || []).filter(x => currentContentSectionIds.indexOf(x.id) == -1);
    if (sectionsNotInContent.length == 0) {
      this.locale.trans("post.all_sections_added", tr => {
        this.note.show("error", tr.message);
      });
    }
    else {
      this.prompt.select({
        inputType: 'select',
        title: 'post.select_section',
        options: sectionsNotInContent.map(x => {
          return {
            name: x.title,
            value: x.id,
          }
        }),
        cancelButton: false,
        closeButton: true,
        required: true,
        callback: (id: number) => {
          let nC: Content = new Content();
          nC.section_id = id;
          nC.post_id = this.post.id;
          nC.visibility = 1;
          this.content.unshift(nC);
          this.justUsedSections();
        }
      });
    }
  }

  secStuff(): any[] {
    return this.sec || [];
  }

  ngOnInit() {
    this.justUsedSections();
  }

  usedSections: any[] = [];

  justUsedSections() {
    let currentContentSectionIds: number[] = this.content.map(x => parseInt(x.section_id?.toString() || '0'));
    this.usedSections = (this.sec || []).filter(x => currentContentSectionIds.indexOf(x.id) != -1);
  }

  removeSection(id: number) {
    this.locale.transGroup(["prompts.sure"], tr => {
      this.note.confirm(tr[0], yes => {
        if (yes) {
          this.content = this.content.filter(x => x.section_id != id);
          this.justUsedSections();
        }
      });
    });
  }

  removeContent(sid: number, index: number) {
    this.locale.transGroup(["prompts.sure"], tr => {
      this.note.confirm(tr[0], yes => {
        if (yes) {
          let start: number = 0;
          let realIndex: number = -1;
          this.content.forEach((x, i) => {
            if (x.section_id == sid) {
              if (start == index) {
                realIndex = i;
              }
              start++;
            }
          });
          if (realIndex != -1) {
            this.content.splice(realIndex, 1);
            this.justUsedSections();
          }
        }
      });
    });
  }

  updateContentVisibility(sid: number, index: number) {
    let start: number = 0;
    let realIndex: number = -1;
    this.content.forEach((x, i) => {
      if (x.section_id == sid) {
        if (start == index) {
          realIndex = i;
        }
        start++;
      }
    });
    if (realIndex != -1) {
      this.content[realIndex].visibility = (this.content[realIndex].visibility == 1) ? 0 : 1;
    }
  }

  addContentToSection(sid: number) {
    let nC: Content = new Content();
    nC.section_id = sid;
    nC.post_id = this.post.id;
    nC.visibility = 1;
    this.content.push(nC);
    this.justUsedSections();
  }

  filterContent(sid: number) {
    return this.content.filter(x => x.section_id == sid);
  }

  cancel(ask: boolean = false) {
    if (ask) {
      this.locale.trans("prompts.sure_lost", tr => {
        this.note.confirm(tr.message, yes => {
          if (yes) {
            this.pedit.exit();
            this.router.navigateByUrl("/post");
          }
        });
      });
    }
    else {
      this.pedit.exit();
      this.router.navigateByUrl("/post");
    }
  }

  slugifyTitle() {
    this.post.title_slug = Slugify(this.post.title || "");
  }

  onSubmit(v: boolean) {
    // do nothing
    // prevent default
  }

  viewerSRC!: string;
  viewerShow: boolean = false;

  toggleViewer() {
    this.viewerShow = !this.viewerShow;
  }

  view(id: number) {
    let nid: number = id;
    this.viewerSRC = (this.img as any[]).filter(x => x.id == nid)[0].link;
    this.viewerShow = true;
  }

  submit(formValid: boolean, asDraft: boolean) {
    const showError = (preTrMessage: string) => {
      this.locale.transGroup([preTrMessage], tr => {
        this.note.show("error", tr[0]);
      });
    }
    const validateMetadata = (f: ResParamFx) => {
      if (formValid) {
        f(GRes.succ());
      }
      else {
        f(GRes.err('post.meta_err'));
      }
    }
    const validateContent = (f: ResParamFx) => {
      let err: boolean = false;
      this.content.forEach(x => {
        if (!x.body) {
          err = true;
        }
      });
      if (err) {
        f(GRes.err('post.content_err'));
      }
      else if (this.content.length == 0 && !asDraft) {
        f(GRes.err('post.content_err2'));
      }
      else {
        f(GRes.succ());
      }
    }
    // flow
    validateMetadata(r1 => {
      if (r1.err) {
        showError(r1.message);
      }
      else {
        validateContent(r2 => {
          if (r2.err) {
            showError(r2.message);
          }
          else {
            // validation passed
            let body = {
              post: this.post,
              content: this.content,
              draft: asDraft,
            }
            this.prel.show();
            this.postService.savePost(body, r => {
              this.prel.hide();
              this.note.show(r.err ? 'error' : 'success', r.message);
              if (!r.err) {
                this.router.navigateByUrl("/post");
              }
            });
          }
        });
      }
    });
  }
}
