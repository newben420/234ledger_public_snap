import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

class Icon {
  cl!: string;
  fs!: string;
}

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        // height: '300px',
        maxHeight: '100000px',
      })),
      state('close', style({
        // height: '0px',
        maxHeight: '0px',
      })),
      transition('open <=> close', [
        animate('150ms'),
      ]),
    ]),
  ]
})
export class AccordionComponent {
  @Input('title') title : string = "Tab";
  @Input('state') state: boolean = false;
  // @Input('bg') bg: string = 'bg-white';
  @Input('ico') ico: Icon = new Icon();

  toggle(){
    this.state = !this.state;
  }
}
