import { Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { Res, ServerRes } from '@shared/model/res';
import { ResParamFx, ServerResParamFx } from '../env';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private server: ServerService, private admin: AdminService) { }

  getAccounts(f: ResParamFx) {
    this.server.post("admin/admin/get-accounts", {}, (r: Res) => {
      f(r);
    });
  }

  getAllModules(f: ResParamFx) {
    this.server.post("admin/admin/get-all-modules", {}, (r: Res) => {
      f(r);
    });
  }

  newAccount(username: string, password: string, f: ResParamFx) {
    this.server.post("admin/admin/new-account", { username, password }, (r: Res) => {
      f(r);
    });
  }

  updateReadOnly(v: 1 | 0, f: ResParamFx, i: string) {
    this.server.post("admin/admin/update-read-only", { v, i }, (r: Res) => {
      f(r);
    });
  }

  deleteAccount(username: string, f: ResParamFx) {
    this.server.post("admin/admin/delete-account", { username }, (r: Res) => {
      f(r);
    });
  }

  updateAccountRoles(username: string, roles: number[], f: ResParamFx) {
    this.server.post("admin/admin/update-roles", { username, roles }, (r: Res) => {
      if (!r.err && username == this.admin.adm.value.username) {
        this.admin.isAuth((x: boolean) => {
        }, false, false);
      }
      f(r);
    });
  }
}
