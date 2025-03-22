import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalComponent } from './approval.component';
import { SharedModule } from '../../shared/shared.module';
import { ApprovePostComponent } from './approve-post/approve-post.component';
import { ApproveCommentComponent } from './approve-comment/approve-comment.component';


@NgModule({
  declarations: [
    ApprovalComponent,
    ApprovePostComponent,
    ApproveCommentComponent
  ],
  imports: [
    CommonModule,
    ApprovalRoutingModule,
    SharedModule,
  ]
})
export class ApprovalModule { }
