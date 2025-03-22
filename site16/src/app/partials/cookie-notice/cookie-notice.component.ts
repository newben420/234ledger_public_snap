import { afterNextRender, Component, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html',
  styleUrls: ['./cookie-notice.component.css']
})
export class CookieNoticeComponent {
  subs: Record<string, Subscription> = {};
  isDark!: boolean;
  skey: string = "cn";
  remove: boolean = false;
  show: boolean = false;
  constructor(
    private theme: ThemeService,
    private store: StorageService,
    private ngZone: NgZone,
  ) {
    this.subs["theme"] = theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
    afterNextRender(() => {
      this.initNotice();
    });
  }
  initNotice() {
    setTimeout(() => {
      if (this.store.isStorage()) {
        let cn = this.store.get(this.skey);
        this.ngZone.run(() => {
          if (!cn) {
            this.show = true;
          }
          else {
            this.remove = true;
          }
        });
      }
    });
  }

  accept(){
    this.store.set(this.skey, "y");
    this.ngZone.run(() => {
        this.show = false;
        setTimeout(() => {
          this.remove = true;
        }, 1000);
    });
  }

  ngOnDestroy() {
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }
}
