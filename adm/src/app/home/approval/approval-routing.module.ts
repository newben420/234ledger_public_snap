import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalComponent } from './approval.component';
import { ApprovePostComponent } from './approve-post/approve-post.component';
import { ApproveCommentComponent } from './approve-comment/approve-comment.component';

const brand: string = import.meta.env["NG_APP_BRAND"];

const routes: Routes = [
  {
    path: "", pathMatch: "prefix", component: ApprovalComponent, children: [
      {
        path: "posts", component: ApprovePostComponent, title: `Approve Posts | ${brand}`,
      },
      { path: "comments", component: ApproveCommentComponent, title: `Approve Comments | ${brand}` },
      { path: "", pathMatch: "full", redirectTo: "/approve/posts" }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }
