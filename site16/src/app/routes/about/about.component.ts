import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SiteURL } from 'src/app/app.module';
import { branding, Author } from 'src/app/env';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.setSEO();
  }

  br = branding;
  author = Author
  tit = import.meta.env["NG_APP_ABOUT_TITLE"];
  des = import.meta.env["NG_APP_ABOUT_DESC"];

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
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Organization",
    "name": "${this.br.name}",
    "url": "${SiteURL()}",
    "logo": {
      "@type": "ImageObject",
      "url": "${SiteURL()}/assets/img/logo.svg"
    },
    "description": "${this.des}"
  }
}
`;
      body.appendChild(schema);
    }
  }

  setSEO() {
    this.title.setTitle(`${this.tit} | ${this.br.name}`);
    this.setCanonicalURL(`${SiteURL()}/about`);
    this.meta.removeTag("name=robots");
    this.meta.addTags([
      { name: 'description', content: this.des },
      { name: 'keywords', content: this.br.keywords },
      { property: 'article:published_time', content: "" },
      { property: 'article:section', content: "blog" },
      { property: 'og:description', content: this.des },
      { property: 'og:title', content: `${this.tit} | ${this.br.name}` },
      { property: 'og:url', content: `${SiteURL()}/about` },
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
}
