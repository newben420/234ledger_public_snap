import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionRoutingModule } from './section-routing.module';
import { SectionComponent } from './section.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SectionComponent
  ],
  imports: [
    CommonModule,
    SectionRoutingModule,
    SharedModule,
  ]
})
export class SectionModule { }
