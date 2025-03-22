import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomSqlRoutingModule } from './custom-sql-routing.module';
import { CustomSqlComponent } from './custom-sql.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CustomSqlComponent
  ],
  imports: [
    CommonModule,
    CustomSqlRoutingModule,
    SharedModule,
  ]
})
export class CustomSqlModule { }
