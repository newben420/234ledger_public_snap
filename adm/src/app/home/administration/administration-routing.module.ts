import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { AccountComponent } from './account/account.component';
import { CategoryComponent } from './category/category.component';
import { SectionComponent } from './section/section.component';

const brand: string = import.meta.env["NG_APP_BRAND"];

const routes: Routes = [
  {
    path: "", pathMatch: "prefix", component: AdministrationComponent, children: [
      { path: "accounts", component: AccountComponent, title: `Manage Accounts | ${brand}` },
      { path: "categories", component: CategoryComponent, title: `Manage Categories | ${brand}` },
      { path: "sections", component: SectionComponent, title: `Manage Sections | ${brand}` },
      { path: "", pathMatch: "full", redirectTo: "/admin/accounts" },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
