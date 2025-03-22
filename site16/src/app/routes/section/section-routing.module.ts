import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { LocalRegex } from '@shared/model/regex';
import { SectionComponent } from './section.component';
import { sectionGuard } from 'src/app/guards/section.guard';

const localRoute = (segments: UrlSegment[]): UrlMatchResult | null => {
  if(segments.length === 1 && LocalRegex.slug.test(segments[0].path)){
    return { consumed: segments};
  }
  else{
    return null;
  }
}

const routes: Routes = [
  {matcher: localRoute, component: SectionComponent, canActivate: [sectionGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionRoutingModule { }
