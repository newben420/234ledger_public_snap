import { Component, Inject, Optional } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { SiteURL } from '../app.module';
import { branding, Author } from '../env';
import { DOCUMENT } from '@angular/common';
import { RESPONSE } from 'server/express.token';

@Component({
  selector: 'app-e404',
  templateUrl: './e404.component.html',
  styleUrls: ['./e404.component.css']
})
export class E404Component {
  subs: Record<string, Subscription> = {};
  isDark!: boolean;

  constructor(
    private theme: ThemeService,
    private title: Title,
    private meta: Meta,
    // @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {
    this.setSEO();
    if(this.response){
      (this.response as any).status(404);
    }
    this.subs["theme"] = theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
  }

  br = branding;
  author = Author
  tit = "404: NOT FOUND";
  des = "Oops... The link you followed leads nowhere.";

  setSEO() {
    this.title.setTitle(`${this.tit} | ${this.br.name}`);
    this.meta.addTag({name: 'robots', content: 'noindex,nofollow'});
    this.meta.addTags([
      { name: 'description', content: this.des },
      { name: 'keywords', content: this.br.keywords },
      { property: 'article:published_time', content: "" },
      { property: 'article:section', content: "blog" },
      { property: 'og:description', content: this.des },
      { property: 'og:title', content: `${this.tit} | ${this.br.name}` },
      { property: 'og:url', content: `${SiteURL()}/terms-of-use` },
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
  }

  ngOnDestroy() {
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }
}
