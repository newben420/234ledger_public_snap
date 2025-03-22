import { PostsModule } from './posts/posts.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { modulesGuard } from '../guards/modules.guard';

const brand: string = import.meta.env["NG_APP_BRAND"];

const routes: Routes = [
  // { path: 'dashboard', component: DashboardComponent },
  {
    path: '', pathMatch: "prefix", component: HomeComponent, children: [
      { path: '', pathMatch: "full", component: DashboardComponent },
      { path: 'admin', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule), title: `Administration | ${brand}`, canActivate: [modulesGuard] },
      { path: 'approve', loadChildren: () => import('./approval/approval.module').then(m => m.ApprovalModule), title: `Approval | Admin | ${brand}`, canActivate: [modulesGuard] },
      { path: 'query', loadChildren: () => import('./custom-sql/custom-sql.module').then(m => m.CustomSqlModule), title: `Custom SQL | Admin | ${brand}`, canActivate: [modulesGuard] },
      { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule), title: `Email Subscription | Admin | ${brand}`, canActivate: [modulesGuard] },
      { path: 'current', loadChildren: () => import('./happening/happening.module').then(m => m.HappeningModule), title: `Happening Today | Admin | ${brand}`, canActivate: [modulesGuard] },
      { path: 'post', loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule), title: `Manage Posts | Admin | ${brand}`, canActivate: [modulesGuard] },
      { path: 'stats', loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule), title: `Statistics | Admin | ${brand}`, canActivate: [modulesGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
