import { afterNextRender, Component, Inject, NgZone } from '@angular/core';
import { postDefaultImage, placeholderImage, BoolParamFx, Author, branding } from 'src/app/env';
import { ContentService } from 'src/app/services/content.service';
import { NoteService } from 'src/app/services/note.service';
import { SectionService } from 'src/app/services/section.service';
import { StorageService } from 'src/app/services/storage.service';
import { BreadItem } from 'src/app/shared/breadcrumb/breadcrumb-model';
import { JSONSafeParse } from '@shared/json_safe_parse'
import { LocaleService } from 'src/app/services/locale.service';
import { PromptService } from 'src/app/shared/prompt/prompt.service';
import { LocalRegex } from '@shared/model/regex';
import { PreloaderService } from 'src/app/services/preloader.service';
import { LocationService } from 'src/app/services/location.service';
import { getDateString } from '@shared/model/date_string';
import { SEODate } from '@shared/model/seo_date';
import { Meta, Title } from '@angular/platform-browser';
import { SiteURL } from 'src/app/app.module';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  title = this.cont.openedPost.title
  post = this.cont.openedPost;
  content = this.cont.openedContent;
  PDI = postDefaultImage;
  PI = placeholderImage;
  SEOD = SEODate;
  sections = this.sec.sections?.map(x => ({ ...x, pref: true }));
  copiedSections = this.sec.sections?.map(x => x);
  related = this.cont.relatedPosts;
  breadItems: BreadItem[] = [
    {
      title: 'header.home',
      url: '/'
    },
    {
      title: this.cont.openedPost.cat_title,
      url: `/category/${this.cont.openedPost.cat_slug}`
    },
    {
      title: this.cont.openedPost.title,
    }
  ].filter(x => x.title);

  usedSections: any[] = [];

  justUsedSections() {
    let currentContentSectionIds: number[] = this.content.map(x => parseInt(x.sid?.toString() || '0'));
    this.usedSections = (this.copiedSections || []).filter(x => currentContentSectionIds.indexOf(x.id) != -1);
  }

  isSection: boolean = false;

  constructor(
    private cont: ContentService,
    private sec: SectionService,
    private note: NoteService,
    private store: StorageService,
    private locale: LocaleService,
    private prompt: PromptService,
    private prel: PreloaderService,
    private ngZone: NgZone,
    private loc: LocationService,
    private titl: Title,
    private meta: Meta,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
  ) {
    if(/\.[\d]+$/.test(route.snapshot.url[0].path)){
      this.isSection = true;
    }
    this.setSEO();
    this.justUsedSections();
    afterNextRender(() => {
      this.loadPref();
      this.loadComments();
      this.runAnalytics();
    });
  }

  setCanonicalURL(url: string): void {
    const head = this.document.head;
    let link = head.querySelector("link[rel='canonical']");

    if (link) {
      // Update existing canonical link
      link.setAttribute('href', url);
    } else {
      // Create a new canonical link
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      head.appendChild(link);
    }
  }

  setSchema() {
    const body = this.document.body;
    let schema = body.querySelector("script[type='application/ld+json']")
    if (!schema) {
      schema = this.document.createElement('script');
      schema.setAttribute('type', 'application/ld+json');
      schema.innerHTML =
        `
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${this.tit}",
  "description": "${this.des}",
  "author": {
    "@type": "Person",
    "name": "${this.author.name}"
  },
  "datePublished": "${this.SEOD(this.post.timestamp)}",
  "dateModified": "${this.SEOD(this.post.last_modified)}",
  "publisher": {
    "@type": "Organization",
    "name": "${this.br.name}",
    "logo": {
      "@type": "ImageObject",
      "url": "${SiteURL()}/assets/img/logo.svg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${SiteURL()}/post/${this.post.slug}"
  },
  "image": "${this.image}"
}
`;
      body.appendChild(schema);
    }
  }

  br = branding;
  author = Author
  tit = this.title;
  des = this.post.descr || import.meta.env["NG_APP_POST_DEFAULT_DESCR"];
  image = this.post.image || `${SiteURL()}${this.PDI}`;
  setSEO(){
    this.titl.setTitle(`${this.tit} | ${this.br.name}`);
    this.setCanonicalURL(`${SiteURL()}/post/${this.post.slug}`);
    if(this.isSection){
      this.meta.addTag({name: 'robots', content: 'noindex,nofollow'});
    }
    else{
      this.meta.removeTag("name=robots");
    }
    this.meta.addTags([
      // TODO: use activatedroute to detect if route has a section tag to add noindex tag to the page
      {name: 'description', content: this.des},
      {name: 'keywords', content: this.br.keywords},
      {property: 'article:published_time', content: this.SEOD(this.post.timestamp)},
      {property: 'article:tag', content: this.tit},
      {property: 'article:section', content: "blog"},
      {property: 'og:description', content: this.des},
      {property: 'og:title', content: `${this.tit} | ${this.br.name}`},
      {property: 'og:url', content: `${SiteURL()}/post/${this.post.slug}`},
      {property: 'og:type', content: `website`},
      {property: 'og:locale', content: this.br.seoLocale},
      {property: 'og:image', content: `${this.image}`},
      {property: 'og:site_name', content: this.br.name},
      {name: 'twitter:card', content: "summary"},
      {name: 'twitter:creator', content: this.author.name},
      {name: 'twitter:title', content: `${this.tit} | ${this.br.name}`},
      {name: 'twitter:description', content: this.des},
      {name: 'twitter:image', content: `${this.image}`},
      {name: 'twitter:site', content: this.br.xat},
      {name: 'theme-color', content: this.br.theme},
      {name: 'mobile-web-app-capable', content: "yes"},
      {name: 'application-name', content: (this.br.name as string).toLowerCase()},
      {name: 'msapplication-TileColor', content: this.br.theme},
      {name: 'msapplication-TileImage', content: this.br.favicon},
    ]);
    this.setSchema();
  }

  authorName = Author.name;

  private ts = Date.now();
  private akey: string = "postts";
  runAnalytics() {
    if (this.store.isStorage()) {
      const ds = getDateString(this.ts);
      let stored = this.store.get(this.akey);
      const saveToServer = (f: BoolParamFx) => {
        this.loc.getLoc(r => {
          this.cont.savePostAnalytics(r, this.post.id, rr => {
            f(!rr.err);
          });
        });
      }
      if (stored) {
        // returning
        let pstored: any = JSONSafeParse(stored, false);
        if (pstored.date == ds) {
          // visited some posts today
          if (pstored.posts.indexOf(this.post.id) == -1) {
            // but not this one
            saveToServer(r => {
              if (r) {
                pstored.posts.push(this.post.id);
                this.store.set(this.akey, JSON.stringify(pstored));
              }
            });
          }
          else {
            // visited this post today
            // nothing should be done
          }
        }
        else {
          // did not yet visit a post today
          saveToServer(r => {
            if (r) {
              pstored.date = ds;
              pstored.posts = [this.post.id];
              this.store.set(this.akey, JSON.stringify(pstored));
            }
          });
        }
      }
      else {
        // new
        saveToServer(r => {
          if (r) {
            let pstored: any = { date: ds, posts: [this.post.id] };
            this.store.set(this.akey, JSON.stringify(pstored));
          }
        });
      }
    }
  }

  savePref() {
    let pref: number[] = [];
    this.sections?.forEach(x => {
      if (x.pref) {
        pref.push(x.id);
      }
    });
    this.store.set(this.skey, JSON.stringify(pref));
    this.loadPref();
  }

  loadPref() {
    this.ngZone.run(() => {
      setTimeout(() => {
        let psec = this.store.get(this.skey);
        if (psec) {
          let apsec: number[] = JSONSafeParse(psec, true);
          if (apsec.length > 0) {
            this.copiedSections = this.sections?.filter(x => apsec.indexOf(x.id) != -1);
            this.sections = this.sections?.map(x => ({ ...x, pref: (apsec.indexOf(x.id) != -1) }));
            this.justUsedSections();
          }
        }
      });
    });
  }

  namex = "";
  contact = "";

  makeComment() {
    this.locale.transGroup([
      "post.name",
      "post.name_ins",
      "post.contact",
      "post.contact_ins",
      "post.comment",
      "post.comment_ins",
    ], tr => {
      let comment = ""
      const getName = (f: Function) => {
        this.prompt.input({
          inputType: 'text',
          title: tr[0],
          instr: tr[1],
          cancelButton: false,
          closeButton: true,
          initVal: this.namex,
          pattern: LocalRegex.commentName,
          maxlength: 100,
          required: false,
          callback: (nm: string) => {
            if (nm ? nm.trim().length > 0 : false) {
              this.namex = nm;
            }
            f();
          }
        });
      }

      const getContact = (f: Function) => {
        this.prompt.input({
          inputType: 'text',
          title: tr[2],
          instr: tr[3],
          cancelButton: false,
          initVal: this.contact,
          closeButton: true,
          pattern: LocalRegex.email,
          maxlength: 100,
          required: true,
          callback: (em: string) => {
            em = em.trim();
            if (em) {
              this.contact = em;
            }
            f();
          }
        });
      }

      const getComment = (f: Function) => {
        this.prompt.input({
          inputType: 'textarea',
          rows: 3,
          title: tr[4],
          cancelButton: false,
          closeButton: true,
          instr: tr[5],
          maxlength: 255,
          required: true,
          callback: (cm: string) => {
            cm = cm.trim();
            if (cm) {
              comment = cm;
              f();
            }
          }
        });
      }

      // flow
      getComment(() => {
        getName(() => {
          getContact(() => {
            // continue from here
            this.prel.show();
            this.cont.makeComment(this.namex, this.contact, comment, this.post.id, r => {
              this.prel.hide();
              this.note.show(r.err ? "error" : "success", r.message);
            });
          })
        });
      });
    });
  }

  loadedIndex: number = 0;
  comments: any[] = [];
  isLoading: boolean = true;
  endOfComments: boolean = false;

  loadComments(nte: boolean = false) {
    this.ngZone.run(() => {
      const height = (document ? document.documentElement.scrollTop : -1) || (window ? window.scrollY : -1);
      this.isLoading = true;
      this.cont.loadComments(this.loadedIndex, this.post.id, r => {
        this.isLoading = false;
        if (r.err) {
          this.note.show("error", r.message);
        }
        else {
          this.comments = this.comments.concat(r.message);
          if (!nte) {
          }
          this.loadedIndex++;
          if (document && height >= 0 && r.message.length > 0) {
            setTimeout(() => {
              document.documentElement.scrollTop = height;
            }, 1);
          }
          if (r.message.length == 0) {
            this.endOfComments = true;
            if (nte) {
              setTimeout(() => {
                this.locale.trans("no_more_c", rx => {
                  this.note.show("success", rx.message);
                });
              });
            }
          }
          else if (r.message.length > 0 && nte) {
          }
        }
      });
    });
  }

  alterNewLine(c: string): string {
    if (c) {
      c = c.replace(/\n/g, "<br>");
    }
    return c;
  }

  skey: string = "prefsec"

  filterContent(sid: number) {
    return this.content.filter(x => x.sid == sid);
  }

}
