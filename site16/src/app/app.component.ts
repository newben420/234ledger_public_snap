import { afterNextRender, afterRender, Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { StorageService } from './services/storage.service';
import { NoteService } from './services/note.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { LocaleService } from './services/locale.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { PreloaderService } from './services/preloader.service';
import { Subscription } from 'rxjs';
import { getDateString } from '@shared/model/date_string';
import { BoolParamFx } from './env';
import { LocationService } from './services/location.service';
import { ContentService } from './services/content.service';
import { JSONSafeParse } from '@shared/json_safe_parse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isBrowser!: boolean;
  isServer!: boolean;
  constructor(
    private store: StorageService,
    private note: NoteService,
    private renderer: Renderer2,
    private theme: ThemeService,
    private locale: LocaleService,
    private prel: PreloaderService,
    private _router: Router,
    private loc: LocationService,
    private cont: ContentService,
    @Inject(PLATFORM_ID) private platformID: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformID);
    this.isServer = isPlatformServer(platformID);
    theme.load(renderer);
    locale.init();
    afterNextRender(() => {
      this.runAnalytics();
    });
  }

  private ts = Date.now();
  private akey: string = "visa";
  runAnalytics() {
    if (this.store.isStorage()) {
      const ds = getDateString(this.ts);
      let stored = this.store.get(this.akey);
      const saveToServer = (f: BoolParamFx) => {
        this.loc.getLoc(r => {
          this.cont.saveVisits(r, rr => {
            f(!rr.err);
          });
        });
      }
      if (stored) {
        // returning visitor
        let pstored: any = JSONSafeParse(stored, false);
        if (pstored.date == ds) {
          // visited this site today
          // nothing should be done
        }
        else {
          // did not visit this site today
          saveToServer(r => {
            if (r) {
              pstored.date = ds;
              this.store.set(this.akey, JSON.stringify(pstored));
            }
          });
        }
      }
      else {
        // new visitor
        saveToServer(r => {
          if (r) {
            let pstored: any = { date: ds };
            this.store.set(this.akey, JSON.stringify(pstored));
          }
        });
      }
    }
  }

  subs!: Subscription;

  ngOnInit() {
    if (this.isBrowser) {
      this.prel.hide();
      this.subs = this._router.events.subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          this.prel.show();
        }
        else if (event instanceof NavigationEnd) {
          this.prel.hide();
        }
        else if (event instanceof NavigationCancel) {
          this.prel.hide();
        }
        else if (event instanceof NavigationError) {
          this.prel.hide();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  btn() {
    if (this.isBrowser) {
      // this.note.confirm("wazzap", yes => {
      //   console.log(yes);
      // });
      // this.note.show("error", "hi");
    }
  }
}
