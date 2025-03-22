import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroller',
  templateUrl: './scroller.component.html',
  styleUrls: ['./scroller.component.css']
})
export class ScrollerComponent {
  width: string = "0%"
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const visibleHeight =  window.innerHeight;
    const totalHeight = document.body.scrollHeight;
    this.width = `${(scrollPosition) / (totalHeight - visibleHeight) * 100}%`
  }
}
