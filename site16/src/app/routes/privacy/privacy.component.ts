import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SiteURL } from 'src/app/app.module';
import { branding, Author } from 'src/app/env';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.setSEO();
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
  tit = "Privacy Policy";
  des = import.meta.env["NG_APP_PRIVACY_DESC"];

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
  "@type": "PrivacyPolicy",
  "name": "${this.tit} - ${this.br.name}",
  "url": "${SiteURL()}/privacy-policy",
  "publisher": {
    "@type": "Organization",
    "name": "${this.br.name}"
  }
}
`;
      body.appendChild(schema);
    }
  }

  setSEO() {
    this.title.setTitle(`${this.tit} | ${this.br.name}`);
    this.setCanonicalURL(`${SiteURL()}/privacy-policy`);
    this.meta.removeTag("name=robots");
    this.meta.addTags([
      { name: 'description', content: this.des },
      { name: 'keywords', content: this.br.keywords },
      { property: 'article:published_time', content: "" },
      { property: 'article:section', content: "blog" },
      { property: 'og:description', content: this.des },
      { property: 'og:title', content: `${this.tit} | ${this.br.name}` },
      { property: 'og:url', content: `${SiteURL()}/privacy-policy` },
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
