import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HappeningComponent } from './happening.component';
import { currentLoadGuard } from '../../guards/current-load.guard';

const routes: Routes = [
  { path: "", pathMatch: 'full', component: HappeningComponent, canActivate: [currentLoadGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HappeningRoutingModule { }
