import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NoteService } from 'src/app/services/note.service';
import { SearchService } from 'src/app/services/search.service';
import { SearchResult } from './search-result';
import { PreloaderService } from 'src/app/services/preloader.service';
import { CategoryService } from 'src/app/services/category.service';
import { SectionService } from 'src/app/services/section.service';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @ViewChild('inp',{ read: ElementRef }) inpx!: ElementRef;

  subs: Record<string, Subscription> = {};
  show: boolean = false;
  key!: string;

  constructor(
    private sea: SearchService,
    private ngZone: NgZone,
    private note: NoteService,
    private prel: PreloaderService,
    private cat: CategoryService,
    private sec: SectionService,
    private cont: ContentService,
  ){
    this.subs["sea"] = sea.shwEvent.subscribe(x => {
      ngZone.run(() => {
        this.show = x;
        if(x && this.inpx){
          this.inpx.nativeElement.focus();
        }
      });
    });
  }

  hide(){
    this.sea.hide();
  }

  results: SearchResult[] = [];

  clear(){
    if(this.key){
      this.key = "";
    }
    else{
      this.hide();
    }
  }

  dirty: boolean = false;

  search(){
    if(this.key){
      if(this.key.trim().length >= 3){
        this.dirty = true;
        let keys = this.key.replace(/[^a-zA-Z0-9\-\s]/g,"").match(/\b[a-zA-Z0-9\-]+\b/g);
        let wordedkeys = this.key.replace(/[^a-zA-Z0-9\s]/g,"").match(/\b[a-zA-Z0-9\-]+\b/g);
        if(keys && wordedkeys){
          this.prel.show();
          this.cont.search(keys.join("+"), r => {
            let res: SearchResult[] = [];
            this.prel.hide();
            let sregex = new RegExp(wordedkeys!.join("|"), 'i');
            if(!r.err){
              res = res.concat(r.message);
            }
            if(this.cat.categories){
              this.cat.categories.filter(x => sregex.test(x.title)).forEach(x => {
                res.push({
                  slug: x.title_slug,
                  title: x.title,
                  type: 'category',
                });
              });
            }
            if(this.sec.sections){
              this.sec.sections.filter(x => sregex.test(x.title)).forEach(x => {
                res.push({
                  slug: x.title_slug,
                  title: x.title,
                  type: 'section',
                });
              });
            }
            this.results = res;
          });
        }
        else{
          this.prel.show();
          setTimeout(() => {
            this.prel.hide();
            this.results = [];
          }, 100);

        }
      }
      else{
        this.note.showTR("error", "search.min");
      }
    }
  }

  ngOnDestroy() {
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }
}
