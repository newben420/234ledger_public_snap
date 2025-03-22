import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HappeningRoutingModule } from './happening-routing.module';
import { HappeningComponent } from './happening.component';
import { SharedModule } from '../../shared/shared.module';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    HappeningComponent
  ],
  imports: [
    CommonModule,
    HappeningRoutingModule,
    SharedModule,
    QuillModule,
  ]
})
export class HappeningModule { }
