import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { LocalRegex } from '@shared/model/regex';
import { CategoryComponent } from './category.component';
import { categoryGuard } from 'src/app/guards/category.guard';

const localRoute = (segments: UrlSegment[]): UrlMatchResult | null => {
  if(segments.length === 1 && LocalRegex.slug.test(segments[0].path)){
    return { consumed: segments};
  }
  else{
    return null;
  }
}

const routes: Routes = [
  {matcher: localRoute, component: CategoryComponent, canActivate: [categoryGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
