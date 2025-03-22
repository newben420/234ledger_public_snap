import { Admin } from '@shared/db/admin';
import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { NoteService } from './note.service';
import { Login } from '@shared/model/login';
import { Res } from '@shared/model/res';
import { BehaviorSubject } from 'rxjs';
import { ResParamFx } from '../env';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private server: ServerService, private note: NoteService) { }

  authenticate(admin: Login, fn: Function) {
    if (admin.username && admin.password) {
      this.server.post("admin/sign-in", admin, (r: Res) => {
        fn(r);
      });
    }
  }

  private isAuthenticated: boolean = false;
  adm = new BehaviorSubject(new Admin);
  admin = this.adm.asObservable();

  isAuth(fn: Function, notex: boolean = true, fetch: boolean = true): any {
    if (this.isAuthenticated && fetch) {
      fn(true);
    }
    else {
      this.server.post('admin/verify', {}, (r: Res) => {
        if (this.isAuthenticated && fetch) {
          fn(true);
        }
        else {
          if (r.err) {
            if (notex) {
              this.note.show('error', r.message);
            }
            this.isAuthenticated = false;
            fn(false);
          }
          else {
            this.adm.next(r.message as Admin);
            this.isAuthenticated = true;
            fn(true);
          }
        }
      });
    }
  }

  isAuthGet(): boolean {
    return this.isAuthenticated;
  }

  isAuthSet(): void {
    this.isAuthenticated = false;
  }

  logout(fn: ResParamFx): any {
    this.server.post('admin/logout', {}, (r: Res) => {
      if (!r.err) {
        this.isAuthSet();
      }
      fn(r);
    });
  }

  logoutOthers(fn: ResParamFx): any {
    this.server.post('admin/logout-others', {}, (r: Res) => {
      fn(r);
    });
  }

  changePassword(pw: string, cpw: string, fn: ResParamFx): any {
    this.server.post('admin/change-password', { pw, cpw }, (r: Res) => {
      fn(r);
    })
  }
}
