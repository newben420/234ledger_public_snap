import { Component } from '@angular/core';
import { TabItem } from '@shared/model/tabs';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css'
})
export class AdministrationComponent {
  title: string = "module.admin";
  tabs: TabItem[] = [
    {
      path: "/admin/accounts",
      title: "admin.accounts",
    },
    {
      path: "/admin/categories",
      title: "admin.categories",
    },
    {
      path: "/admin/sections",
      title: "admin.sections",
    }
  ]
}
