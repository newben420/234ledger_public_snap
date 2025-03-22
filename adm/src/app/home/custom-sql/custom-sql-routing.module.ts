import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomSqlComponent } from './custom-sql.component';

const routes: Routes = [
  {path: "", pathMatch: "full", component: CustomSqlComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomSqlRoutingModule { }
