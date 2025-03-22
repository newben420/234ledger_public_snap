import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { AboutComponent } from './routes/about/about.component';
import { TermsComponent } from './routes/terms/terms.component';
import { PrivacyComponent } from './routes/privacy/privacy.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: 'category', pathMatch: "prefix", loadChildren: () => import('./routes/category/category.module').then(m => m.CategoryModule) },
  { path: 'section', pathMatch: "prefix", loadChildren: () => import('./routes/section/section.module').then(m => m.SectionModule) },
  { path: 'post', pathMatch: "prefix", loadChildren: () => import('./routes/post/post.module').then(m => m.PostModule) },
  { path: 'terms-of-use', component: TermsComponent, },
  { path: 'privacy-policy', component: PrivacyComponent, },
  { path: '**', pathMatch: "prefix", loadChildren: () => import('./e404/e404.module').then(m => m.E404Module) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
