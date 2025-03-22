import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { LocalRegex } from '@shared/model/regex';
import { PostComponent } from './post.component';
import { postGuard } from 'src/app/guards/post.guard';

const localRoute = (segments: UrlSegment[]): UrlMatchResult | null => {
  if(segments.length === 1 && LocalRegex.slugSection.test(segments[0].path)){
    return { consumed: segments};
  }
  else{
    return null;
  }
}

const routes: Routes = [
  {matcher: localRoute, component: PostComponent, canActivate: [postGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
