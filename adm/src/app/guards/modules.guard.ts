import { CanActivateFn } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleService } from '../services/locale.service';
import { NoteService } from '../services/note.service';
import { Res } from '@shared/model/res';
import { ActiveModuleService } from '../services/active-module.service';


export const modulesGuard: CanActivateFn = (route, state) => {
  const ams: AdminService = inject(AdminService);
  const router: Router = inject(Router);
  const locale: LocaleService = inject(LocaleService);
  const note: NoteService = inject(NoteService);
  const actMod: ActiveModuleService = inject(ActiveModuleService);
  let authorized: number = 0;
  ams.adm.value.modules?.forEach(element => {
    if(element.slug == route.url[0].path){
      authorized++;
    }
  });
  if(authorized < 1){
    locale.trans("server_responses.errors.access_denied", (r: Res) => {
      note.show("error", r.message);
      router.navigateByUrl("/");
      return false;
    });
    return false;
  }
  else{
    actMod.setActiveModule(route.url[0].path);
    return true;
  }
};
