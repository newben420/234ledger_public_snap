import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { PreloaderService } from './services/preloader.service';
import { Subscription } from 'rxjs';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { LocaleService } from './services/locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private theme: ThemeService, private renderer: Renderer2, private locale: LocaleService, private prel: PreloaderService, private _router: Router){
    theme.load(renderer);
    locale.init();
  }

  subs!: Subscription;

  ngOnInit(){
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

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
