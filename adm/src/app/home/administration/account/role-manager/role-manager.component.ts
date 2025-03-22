import { Component } from '@angular/core';
import { RoleManagerConfig } from './role-manager-config';
import { RoleManagerService } from './role-manager.service';
import { Subscription } from 'rxjs';
import { AdminModule } from '@shared/db/admin_module';

@Component({
  selector: 'app-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrl: './role-manager.component.css'
})
export class RoleManagerComponent {
  show: boolean = false;
  config: RoleManagerConfig = new RoleManagerConfig();
  allModules: AdminModule[] = [];

  subs: Record<string, Subscription> = {}

  isPicked(id: number): boolean{
    return this.config.userModules.indexOf(id) != -1;
  }

  toggleRole(id: number){
    if(this.isPicked(id)){
      this.config.userModules.splice(this.config.userModules.indexOf(id),1);
    }
    else{
      this.config.userModules.push(id);
    }
  }

  constructor(private role: RoleManagerService){
    this.subs["config"] = role.config.subscribe(x => {
      this.config = x;
    });
    this.subs["show"] = role.show.subscribe(x => {
      if(x){
        role.getAllModules(mds => {
          this.allModules = mds;
          this.show = x;
        });
      }
      else{
        this.show = x;
      }
    });
  }

  ngOnDestroy(){

  }

  cancel(){
    this.role.cancel();
  }

  save(){
    this.role.exit(this.config.userModules);
  }
}
