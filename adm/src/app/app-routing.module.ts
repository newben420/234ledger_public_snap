import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { adminLoginGuard } from './guards/admin-login.guard';
import { adminSessionGuard } from './guards/admin-session.guard';

const brand: string = import.meta.env["NG_APP_BRAND"];

const routes: Routes = [
  { path: "login", component: LoginComponent, title: `Login | ${brand}`, canActivate: [adminLoginGuard] },
  { path: '', pathMatch: "prefix", loadChildren: () => import('./home/home.module').then(m => m.HomeModule), title: `Admin | ${brand}`, canActivateChild: [adminSessionGuard] },
  { path: '**', redirectTo: '/' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
