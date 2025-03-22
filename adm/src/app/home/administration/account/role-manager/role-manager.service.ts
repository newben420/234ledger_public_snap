import { AdminModule } from '@shared/db/admin_module';
import { Injectable } from '@angular/core';
import { RoleManagerConfig } from './role-manager-config';
import { BehaviorSubject } from 'rxjs';
import { AccountsService } from '../../../../services/accounts.service';
import { AdminModuleArrayParamFx, ResParamFx } from '../../../../env';
import { PreloaderService } from '../../../../services/preloader.service';
import { NoteService } from '../../../../services/note.service';

@Injectable({
  providedIn: 'root'
})
export class RoleManagerService {

  private allModules: AdminModule[] | null = null;
  private cfg = new BehaviorSubject<RoleManagerConfig>(new RoleManagerConfig());
  config = this.cfg.asObservable();
  private shw = new BehaviorSubject<boolean>(false);
  show = this.shw.asObservable();

  manageRole(config: RoleManagerConfig) {
    const proceed = () => {
      this.cfg.next(config);
      this.shw.next(true);
    }
    if (this.allModules != null) {
      proceed();
    }
    else{
      this.prel.show();
      this.accounts.getAllModules(r => {
        this.prel.hide();
        if(r.err){
          this.note.show("error", r.message);
        }
        else{
          this.allModules = r.message as AdminModule[];
          proceed();
        }
      });
    }
  }

  cancel(){
    this.shw.next(false);
    this.cfg.next(new RoleManagerConfig());
  }

  getAllModules(f: AdminModuleArrayParamFx) {
    f(this.allModules || []);
  }

  exit(modules: number[]) {
    this.shw.next(false);
    this.cfg.value.callback(modules);
    this.cfg.next(new RoleManagerConfig());
  }

  constructor(private accounts: AccountsService, private prel: PreloaderService, private note: NoteService) { }
}
