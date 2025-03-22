import { Component } from '@angular/core';
import { TabItem } from '@shared/model/tabs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  title: string = "module.post";
  tabs: TabItem[] = [
    {
      path: "/post/all",
      title: "post.all",
    },
    {
      path: "/post/images",
      title: "post.images",
    }
  ]
}
