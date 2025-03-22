import { Component, Input } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { TabItem } from '@shared/model/tabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

  constructor(private router: Router) { }

  @Input('tabs') tabs: TabItem[] = [];
  @Input('title') title: string = "";

  navTo(p: string, i: number) {
    if (this.tabs[i].badge) {
      this.tabs[i].badge = null;
    }
    this.router.navigateByUrl(p);
  }

  route: string = "";

  sub!: Subscription;
  ngOnInit() {
    this.route = this.router.url;
    this.setActive();
    this.sub = this.router.events.subscribe((ev: Event) => {
      if (ev instanceof NavigationEnd) {
        this.route = ev.urlAfterRedirects ? ev.urlAfterRedirects : ev.url;
        this.setActive();
      }
    });
  }

  setActive() {
    this.tabs.forEach((tab: TabItem, i: number) => {
      if (tab.path == this.route) {
        this.tabs[i].active = true;
        if (tab.badge) {
          setTimeout(() => {
            this.tabs[i].badge = null;
          }, 1000);
        }
      }
      else {
        this.tabs[i].active = false;
      }
    });
  }

  ngOnDestroy() {
    try {
      this.sub.unsubscribe();
    } catch (error) {

    }
  }

}
