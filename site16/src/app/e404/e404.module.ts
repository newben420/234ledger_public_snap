import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { E404RoutingModule } from './e404-routing.module';
import { E404Component } from './e404.component';


@NgModule({
  declarations: [
    E404Component
  ],
  imports: [
    CommonModule,
    E404RoutingModule
  ]
})
export class E404Module { }
