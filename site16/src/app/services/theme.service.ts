import { ThemeColors } from '@shared/model/colors';
import { Inject, inject, Injectable, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ServerService } from './server.service';
import { Res } from '@shared/model/res';
import { Meta } from '@angular/platform-browser';

type storeVal = "dark" | "light";


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private styleElement: HTMLStyleElement | null = null;

  private key: string = "theme_keeper";
  transMS: number = 200;
  private transition: string = `transition: color ${this.transMS}ms linear; `;
  private transitionBG: string = `transition: background ${this.transMS}ms linear; `;
  colors: string[] = ThemeColors.monochrome;
  isDark = new BehaviorSubject<boolean>(false);
  isDarkEvent = this.isDark.asObservable();

  load(renderer: Renderer2) {
    if (isPlatformBrowser(this.platformID)) {
      let stored = this.store.get(this.key);
      if (stored) {
        let st = stored as storeVal;
        this.setDark(st == "dark", false, renderer)
      }
      else {
        // theme was never set
        let newDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDark(newDark, true, renderer);

      }
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformID: object, private server: ServerService, private meta: Meta) {

  }

  private store: StorageService = inject(StorageService);

  setDark(v: boolean, save: boolean, renderer: Renderer2) {
    if (isPlatformBrowser(this.platformID)) {
      let init = () => {
        if (this.styleElement) {
          renderer.removeChild(document.head, this.styleElement);
          this.styleElement = null;
        }
        this.styleElement = renderer.createElement("style");

        (this.isDark.value ? this.colors.map(x => x).reverse() : this.colors).forEach((color, index) => {
          const className1 = `.thx-${index} {color: ${color} !important; ${this.transition}}`;
          const className2 = `.thx-bg-${index} {background: ${color} !important; ${this.transitionBG}}`;
          renderer.appendChild(this.styleElement, renderer.createText(`${className1} ${className2}`));
        });

        renderer.appendChild(document.head, this.styleElement);
        this.meta.addTag({ name: 'theme-color', content: v ? this.colors.map(x => x).reverse()[1] : this.colors[1] });
      }
      this.isDark.next(v);
      init();
      if (save) {
        this.store.set(this.key, v ? "dark" : "light");
        let theme = v ? "dark" : "light";
        this.server.post("/theme", { theme }, (r: Res) => {});
      }
    }
  }
}
