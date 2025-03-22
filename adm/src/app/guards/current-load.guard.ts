import { CanActivateFn, Router } from '@angular/router';
import { CurrentService } from '../services/current.service';
import { inject } from '@angular/core';
import { Res } from '@shared/model/res';
import { NoteService } from '../services/note.service';

export const currentLoadGuard: CanActivateFn = async (route, state) => {
  const current: CurrentService = inject(CurrentService);
  const router: Router = inject(Router);
  const note: NoteService = inject(NoteService);
  current.resetLoaded();
  let r: Res = await current.loadCurrent();
  if(current.getLoadedStatus()){
    return true;
  }
  else{
    note.show("error", r.message);
    router.navigateByUrl("/stats");
    return false;
  }
  // continue here
};
