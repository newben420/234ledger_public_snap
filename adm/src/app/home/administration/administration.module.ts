import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AccountComponent } from './account/account.component';
import { CategoryComponent } from './category/category.component';
import { SectionComponent } from './section/section.component';
import { AdministrationComponent } from './administration.component';
import { SharedModule } from "../../shared/shared.module";
import { RoleManagerComponent } from './account/role-manager/role-manager.component';


@NgModule({
  declarations: [
    AccountComponent,
    CategoryComponent,
    SectionComponent,
    AdministrationComponent,
    RoleManagerComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule,
]
})
export class AdministrationModule { }
