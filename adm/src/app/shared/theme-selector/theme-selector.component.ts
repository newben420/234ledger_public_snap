import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { ThemeColors } from '@shared/model/colors';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrl: './theme-selector.component.css'
})
export class ThemeSelectorComponent {
  isDark: boolean = false;
  themeSub!: Subscription;
  constructor(private theme: ThemeService, private renderer: Renderer2){
  }
  colors: string[] =  ThemeColors.monochrome;
  width: number = 50;
  height: number = 25;
  speed: number = 300;
  darkLabel: string = ``
  lightLabel: string = ``
  ngOnInit(){
    this.speed = this.theme.transMS;
    this.themeSub = this.theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
  }
  setTheme(x: boolean){
    this.theme.setDark(x, true,this.renderer);
  }
  ngOnDestroy(){
    this.themeSub.unsubscribe();
  }
}
