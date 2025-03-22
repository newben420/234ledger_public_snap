import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { socialLInks } from 'src/app/static-data/socials';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  socials = socialLInks;
  brand: string = import.meta.env["NG_APP_SITE_BRAND"];
  year = new Date().getFullYear();
  subs: Record<string, Subscription> = {};
  isDark!: boolean;
  constructor(
    private theme: ThemeService,
  ){
    this.subs["theme"] = theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
  }

  ngOnDestroy(){
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }
}
