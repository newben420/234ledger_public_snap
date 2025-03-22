import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PreloaderService } from '../../services/preloader.service';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})
export class PreloaderComponent {
  show: boolean = true;
  sub: Subscription;
  constructor(private prel: PreloaderService){
    this.sub = prel.switch.subscribe((up: boolean) => {
      this.show = up;
    });
  }

  ngOnDestroy(){
    try {
      this.sub.unsubscribe();
    } catch (error) {

    }
  }
}
