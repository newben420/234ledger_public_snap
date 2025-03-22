import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { Content } from '@shared/db/content';
import { LocaleService } from '../../services/locale.service';
import { NoteService } from '../../services/note.service';
import { PromptService } from '../../shared/prompt/prompt.service';
import { PreloaderService } from '../../services/preloader.service';
import { ThemeService } from '../../services/theme.service';
import { ThemeColors } from '@shared/model/colors';
import { Router } from '@angular/router';
import { ResParamFx } from '../../env';
import { GRes } from '@shared/model/res';
import { LocalRegex } from '@shared/model/regex';
import { Slugify } from '@shared/slugify';

@Component({
  selector: 'app-happening',
  templateUrl: './happening.component.html',
  styleUrl: './happening.component.css'
})
export class HappeningComponent {
  constructor(
    private current: CurrentService,
    private note: NoteService,
    private locale: LocaleService,
    private prompt: PromptService,
    private theme: ThemeService,
    private prel: PreloaderService,
    private router: Router,
  ) {
    current.getDataFromComponent((r: any) => {
      // console.log(r);
      this.section = r.section || [];
      this.content = r.content || [];
      this.postID = r.postID || 0;
      // console.log(this.section);
      // console.log(this.content);
      // console.log(this.postID);
    });
    this.colors = theme.isDark.value ? ThemeColors.monochrome.map(x => x).reverse() : ThemeColors.monochrome.map(x => x);
  }

  section!: any[];
  content!: Content[];
  postID!: number;

  usedSections: any[] = [];
  colors: string[] = [];
  swicthSpeed: number = 300;
  swicthWidth: number = 40;
  swicthHeight: number = 25;

  toBool(x: any): boolean {
    return x == 1 && x == true;
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

  justUsedSections() {
    let currentContentSectionIds: number[] = this.content.map(x => parseInt(x.section_id?.toString() || '0'));
    this.usedSections = (this.section || []).filter(x => currentContentSectionIds.indexOf(x.id) != -1);
  }

  addContentToSection(sid: number) {
    let nC: Content = new Content();
    nC.section_id = sid;
    nC.post_id = this.postID;
    nC.visibility = 1;
    this.content.push(nC);
    this.justUsedSections();
  }

  removeSection(id: number) {
    this.content = this.content.filter(x => x.section_id != id);
    this.justUsedSections();
  }

  filterContent(sid: number) {
    return this.content.filter(x => x.section_id == sid);
  }

  removeContent(sid: number, index: number) {
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

  addSection() {
    let currentContentSectionIds: number[] = this.content.map(x => parseInt(x.section_id?.toString() || '0'));
    let sectionsNotInContent: any[] = (this.section || []).filter(x => currentContentSectionIds.indexOf(x.id) == -1);
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
          nC.post_id = this.postID;
          nC.visibility = 1;
          this.content.unshift(nC);
          this.justUsedSections();
        }
      });
    }
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
    let text: string = event.html;
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

  cancel(ask: boolean = false) {
    this.locale.trans("prompts.sure_lost", tr => {
      this.note.confirm(tr.message, yes => {
        if (yes) {
          this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl("/current");
          });
        }
      });
    });
  }

  ngOnInit() {
    this.justUsedSections();
  }

  convert() {
    this.prel.show();
    this.current.getYesterdayContentIDs(this.postID, r => {
      this.prel.hide();
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        let ids: number[] = r.message;
        if (ids.length == 0) {
          this.locale.trans("current.no_yesterday", tr => {
            this.note.show("success", tr.message);
          });
        }
        else {
          // proceed to get new details for new post: title, titleslug, category,
          this.locale.transGroup([
            'post.title',
            'post.title_err',
            'post.slug',
            'post.slug_err',
            'post.category',
            'post.select_cat',
          ], tr => {
            let title: string = "";
            let category: number = 0;
            let title_slug: string = "";
            let categories: any[] = [];

            const getTitle = (fx: Function) => {
              this.prompt.input({
                title: tr[0],
                instr: tr[1],
                inputType: 'text',
                cancelButton: false,
                closeButton: true,
                maxlength: 100,
                minlength: 1,
                required: true,
                pattern: LocalRegex.title,
                callback: (tit: string) => {
                  title = tit;
                  title_slug = Slugify(title);
                  fx();
                }
              });
            };

            const getSlug = (fx: Function) => {
              this.prompt.input({
                title: tr[2],
                instr: tr[3],
                inputType: 'text',
                cancelButton: false,
                closeButton: true,
                maxlength: 100,
                minlength: 1,
                required: true,
                initVal: title_slug,
                pattern: LocalRegex.slug,
                callback: (slug: string) => {
                  title_slug = Slugify(slug);
                  fx();
                }
              });
            }

            const getCategory = (fx: Function) => {
              this.prompt.select({
                inputType: 'select',
                title: tr[4],
                options: categories.map(x => {
                  return {
                    name: x.title,
                    value: x.id,
                  }
                }),
                cancelButton: false,
                closeButton: true,
                required: true,
                callback: (id: number) => {
                  category = id;
                  fx();
                }
              });
            }

            const postGetSlug = () => {
              validateSlug(() => {
                getCategory(() => {
                  this.prel.show();
                  this.current.convert(title, title_slug, ids, category, r => {
                    this.prel.hide();
                    this.note.show(r.err ? "error" : "success", r.message);
                  });
                });
              });
            };

            const validateSlug = (fx: Function) => {
              this.prel.show();
              this.current.validatePostSlug(title_slug, r => {
                this.prel.hide();
                if(r.err){
                  this.note.show("error", r.message);
                  getSlug(postGetSlug);
                }
                else{
                  categories = r.message as any[];
                  fx();
                }
              });
            }

            // flow
            getTitle(() => {
              getSlug(postGetSlug);
            });
          });
        }
      }
    });
  }

  submit() {
    const showError = (preTrMessage: string) => {
      this.locale.transGroup([preTrMessage], tr => {
        this.note.show("error", tr[0]);
      });
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
      // else if (this.content.length == 0) {
      //   f(GRes.err('post.content_err2'));
      // }
      else {
        f(GRes.succ());
      }
    }
    // flow
    validateContent(r2 => {
      if (r2.err) {
        showError(r2.message);
      }
      else {
        // validation passed
        let body = {
          id: this.postID,
          content: this.content,
        }
        this.prel.show();
        this.current.saveContent(body, r => {
          this.prel.hide();
          this.note.show(r.err ? 'error' : 'success', r.message);
        });
      }
    });

  }

}
