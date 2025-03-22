import { BrandConfig } from '@shared/model/brand';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
})
export class BrandComponent {
  @Input('config') config: BrandConfig = new BrandConfig();
  sub!: Subscription;
  isDark!: boolean;
  alt: string = import.meta.env["NG_APP_SITE_BRAND"];

  constructor(private theme: ThemeService){
    this.sub = theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
