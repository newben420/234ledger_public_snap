import { Component, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShareComponent {
  trustedHtml!: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
  ){
    const script = `<script defer src="https://static.addtoany.com/menu/page.js"></script>`;
    this.trustedHtml = sanitizer.bypassSecurityTrustHtml(script);
  }
}
