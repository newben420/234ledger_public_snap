import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-btt',
  templateUrl: './btt.component.html',
  styleUrls: ['./btt.component.css']
})
export class BttComponent {
  show: boolean = false;
  btt() {
    if (document) {
      document.documentElement.scrollTop = 0;
    }
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.show = scrollPosition > 350;
  }
}
