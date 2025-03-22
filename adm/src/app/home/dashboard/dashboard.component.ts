import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { ActiveModuleService } from '../../services/active-module.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user!: string;
  sub!: Subscription;
  readonly: boolean = false;
  constructor(private admin: AdminService, private actM: ActiveModuleService){
    this.sub = admin.admin.subscribe(x => {
      this.user = x.username.toUpperCase();
      this.readonly = x.read_only == 1;
    });
  }

  ngOnInit(){
    setTimeout(() => {
      this.actM.setActiveModule("");
    }, 10);
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
