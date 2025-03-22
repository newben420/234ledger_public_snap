import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { SectionService } from 'src/app/services/section.service';
import {abbreviateNumber} from '@shared/model/abbr_number'
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  categories!: any[];
  sections!: any[];
  url!: string;
  subs: Record<string, Subscription> = {};
  accord: Record<string, boolean> = {
    cat: false,
    sec: false
  }

  abbr = abbreviateNumber

  menu: boolean = false;

  toggleMenu(){
    this.menu = !this.menu;
  }

  toggleAccord(i: string){
    this.accord[i] = !this.accord[i];
  }

  constructor(
    private cat: CategoryService,
    private sec: SectionService,
    private router: Router,
    private sea: SearchService,
  ){
    this.subs["route"] = router.events.subscribe((event: Event) => {
     if (event instanceof NavigationEnd) {
        this.url = router.url;
      }
    });
    cat.get(r => {
      if(!r.err){
        this.categories = r.message;
      }
      sec.get(r => {
        if(!r.err){
          this.sections = r.message;
        }
      });
    });
  }

  search(){
    this.sea.show();
  }

  ngOnDestroy(){
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }
}
