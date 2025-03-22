import { Component } from '@angular/core';
import { TabItem } from '@shared/model/tabs';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.css'
})
export class ApprovalComponent {
  title: string = "module.approve";
  tabs: TabItem[] = [
    {
      path: "/approve/posts",
      title: "approve.posts",
    },
    {
      path: "/approve/comments",
      title: "approve.comments",
    }
  ]
}
