import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './posts.component';
import { PostsTabComponent } from './posts-tab/posts-tab.component';
import { ImagesComponent } from './images/images.component';
import { PostsTableComponent } from './posts-tab/posts-table/posts-table.component';
import { PostEditComponent } from './posts-tab/post-edit/post-edit.component';
import { postEditGuard } from '../../guards/post-edit.guard';

const brand: string = import.meta.env["NG_APP_BRAND"];

const routes: Routes = [
  {
    path: "", pathMatch: "prefix", component: PostsComponent, children: [
      {
        path: "", pathMatch: "prefix", component: PostsTabComponent, title: `Manage Posts | ${brand}`, children: [
          { path: "all", pathMatch: "full", component: PostsTableComponent },
          // { path: "edit", component: PostEditComponent, canActivate: [] },
          { path: "edit", component: PostEditComponent, canActivate: [postEditGuard] },
          { path: "", pathMatch: "full", redirectTo: "/post/all" }
        ]
      },
      { path: "images", component: ImagesComponent, title: `Manage Image Files | ${brand}` },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
