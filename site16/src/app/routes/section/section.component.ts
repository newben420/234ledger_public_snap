import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { abbreviateNumber } from '@shared/model/abbr_number';
import { SEODate } from '@shared/model/seo_date';
import { SiteURL } from 'src/app/app.module';
import { makeCategoryDesc } from 'src/app/desc';
import { Author, branding, placeholderImage, postDefaultImage } from 'src/app/env';
import { ContentService } from 'src/app/services/content.service';
import { LocaleService } from 'src/app/services/locale.service';
import { NoteService } from 'src/app/services/note.service';
import { PreloaderService } from 'src/app/services/preloader.service';
import { SectionService } from 'src/app/services/section.service';
import { BreadItem } from 'src/app/shared/breadcrumb/breadcrumb-model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  breadItems: BreadItem[] = [
    {
      title: 'header.home',
      url: '/'
    },
    {
      title: 'header.sections'
    },
    {
      title: this.sec.openedSectionTitle,
    }
  ];
  title = this.sec.openedSectionTitle;
  id = this.sec.openedSection;
  isLoading: boolean = true;
  endOfPost: boolean = false;
  posts: any[] = [];
  abbr = abbreviateNumber
  PDI = postDefaultImage;
  PI = placeholderImage;
  loadedIndex: number = 0;

  constructor(
    private sec: SectionService,
    private cont: ContentService,
    private locale: LocaleService,
    private prel: PreloaderService,
    private note: NoteService,
    private titl: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.setSEO()
    this.loadMore(false);
  }

  br = branding;
  author = Author
  tit = this.title;
  des = makeCategoryDesc(this.title);

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
  "@type": "CollectionPage",
  "name": "${this.tit} - ${this.br.name}",
  "url": "${SiteURL()}/section/${this.sec.openedSectionSlug}"
}
`;
      body.appendChild(schema);
    }
  }

  setSEO() {
    this.titl.setTitle(`${this.tit} | ${this.br.name}`);
    this.setCanonicalURL(`${SiteURL()}/section/${this.sec.openedSectionSlug}`);
    this.meta.removeTag("name=robots");
    this.meta.addTags([
      { name: 'description', content: this.des },
      { name: 'keywords', content: this.br.keywords },
      { property: 'article:published_time', content: "" },
      { property: 'article:section', content: "blog" },
      { property: 'og:description', content: this.des },
      { property: 'og:title', content: `${this.tit} | ${this.br.name}` },
      { property: 'og:url', content: `${SiteURL()}/section/${this.sec.openedSectionSlug}` },
      { property: 'og:type', content: `website` },
      { property: 'og:locale', content: this.br.seoLocale },
      { property: 'og:image', content: `${SiteURL()}${this.br.image}` },
      { property: 'og:site_name', content: this.br.name },
      { name: 'twitter:card', content: "summary" },
      { name: 'twitter:creator', content: this.author.name },
      { name: 'twitter:title', content: `${this.tit} | ${this.br.name}` },
      { name: 'twitter:description', content: this.des },
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

  SEOD = SEODate;

  loadMore(nt: boolean = true) {
    let height = -1;
    if (nt) {
      height = (document ? document.documentElement.scrollTop : -1) || (window ? window.scrollY : -1);
    }
    this.isLoading = true;
    this.cont.loadPostsBySection(this.loadedIndex, this.sec.openedSection, r => {
      this.isLoading = false;
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        this.posts = this.posts.concat(r.message);
        this.loadedIndex++;
        if(nt){
          if (document && height >= 0 && r.message.length > 0) {
            setTimeout(() => {
              document.documentElement.scrollTop = height;
            }, 1);
          }
        }
        if (r.message.length == 0) {
          this.endOfPost = true;
          if (nt) {
            this.locale.trans("no_more", rx => {
              this.note.show("success", rx.message);
            });
          }
        }
      }
    });
  }
}
