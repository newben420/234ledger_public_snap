import { Component, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { abbreviateNumber } from '@shared/model/abbr_number';
import { Author, branding, currentImage, currentSlug, placeholderImage, postDefaultImage } from 'src/app/env';
import { CategoryService } from 'src/app/services/category.service';
import { ContentService } from 'src/app/services/content.service';
import { LocaleService } from 'src/app/services/locale.service';
import { NoteService } from 'src/app/services/note.service';
import { PreloaderService } from 'src/app/services/preloader.service';
import { SectionService } from 'src/app/services/section.service';
import { SEODate } from '@shared/model/seo_date';
import { SiteURL } from 'src/app/app.module';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  categories: any[] = [];
  sections: any[] = [];
  posts: any[] = [];
  abbr = abbreviateNumber
  CI = currentImage;
  PDI = postDefaultImage;
  PI = placeholderImage;
  CS = currentSlug;
  loadedIndex: number = 0;
  SEOD = SEODate;

  constructor(
    private cat: CategoryService,
    private sec: SectionService,
    private cont: ContentService,
    private locale: LocaleService,
    private prel: PreloaderService,
    private note: NoteService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {
    cat.get(r => {
      if (!r.err) {
        this.categories = r.message;
      }
      sec.get(r => {
        if (!r.err) {
          this.sections = r.message;
        }
      });
    });
    cont.loadHomeInitial(r => {
      this.setSEO();
      this.isLoading = false;
      if (!r.err) {
        this.loadedIndex = 1;
        const doCurrent = (f: Function) => {
          if (r.message.current) {

            this.posts.push({
              title: import.meta.env["NG_APP_CURRENT_TITLE"],
              timestamp: import.meta.env["NG_APP_CURRENT_TIMESTAMP"],
              image_title: import.meta.env["NG_APP_CURRENT_TITLE"],
              image: this.CI,
              pinned: true,
              slug: this.CS,
            });
            f();
          }
          else {
            f();
          }
        }
        doCurrent(() => {
          this.posts = this.posts.concat(r.message.posts);
        });
      }
    });
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
  "@type": "WebSite",
  "url": "${SiteURL()}",
  "name": "${this.br.name}",
  "description": "${this.br.name} - ${this.br.title}",
  "image": "${SiteURL()}${this.br.image}",
  "keywords": "${this.br.keywords}",
  "publisher": {
    "@type": "Organization",
    "name": "${this.br.name}",
    "logo": {
      "@type": "ImageObject",
      "url": "${SiteURL()}/assets/img/logo.svg"
    }
  }
}
`;
      body.appendChild(schema);
    }
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

  br = branding;
  author = Author
  setSEO() {
    this.title.setTitle(`${this.br.title} | ${this.br.name}`);
    this.setCanonicalURL(SiteURL());
    this.meta.removeTag("name=robots");
    this.meta.addTags([
      { name: 'description', content: this.br.desc },
      { name: 'keywords', content: this.br.keywords },
      { property: 'article:section', content: "blog" },
      { property: 'og:description', content: this.br.desc },
      { property: 'og:title', content: `${this.br.title} | ${this.br.name}` },
      { property: 'og:url', content: `${SiteURL()}` },
      { property: 'og:type', content: `website` },
      { property: 'og:locale', content: this.br.seoLocale },
      { property: 'og:image', content: `${SiteURL()}${this.br.image}` },
      { property: 'og:site_name', content: this.br.name },
      { name: 'twitter:card', content: "summary" },
      { name: 'twitter:creator', content: this.author.name },
      { name: 'twitter:title', content: `${this.br.title} | ${this.br.name}` },
      { name: 'twitter:description', content: this.br.desc },
      { name: 'twitter:image', content: `${SiteURL()}${this.br.image}` },
      { name: 'twitter:site', content: this.br.xat },
      { name: 'theme-color', content: this.br.theme },
      { name: 'mobile-web-app-capable', content: "yes" },
      { name: 'application-name', content: (this.br.name as string).toLowerCase() },
      { name: 'msapplication-TileColor', content: this.br.theme },
      { name: 'msapplication-TileImage', content: this.br.favicon },
    ]);
    this.setSchema();
  }

  isLoading: boolean = true;
  endOfPost: boolean = false;

  loadMore() {
    const height = (document ? document.documentElement.scrollTop : -1) || (window ? window.scrollY : -1);
    this.isLoading = true;
    this.cont.loadHomeMore(this.loadedIndex, r => {
      this.isLoading = false;
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        this.posts = this.posts.concat(r.message);
        this.loadedIndex++;
        if (document && height >= 0 && r.message.length > 0) {
          setTimeout(() => {
            document.documentElement.scrollTop = height;
          }, 1);
        }
        if (r.message.length == 0) {
          this.endOfPost = true;
          this.locale.trans("no_more", rx => {
            this.note.show("success", rx.message);
          });
        }
      }
    });
  }

}
