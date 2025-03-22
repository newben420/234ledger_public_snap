import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { ImagesComponent } from './images/images.component';
import { PostsTabComponent } from './posts-tab/posts-tab.component';
import { SharedModule } from "../../shared/shared.module";
import { PostsTableComponent } from './posts-tab/posts-table/posts-table.component';
import { PostEditComponent } from './posts-tab/post-edit/post-edit.component';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    PostsComponent,
    ImagesComponent,
    PostsTabComponent,
    PostsTableComponent,
    PostEditComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PostsRoutingModule,
    QuillModule,
  ]
})
export class PostsModule { }
