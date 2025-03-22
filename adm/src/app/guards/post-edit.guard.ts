import { CanActivateFn } from '@angular/router';
import { PostEditService } from '../services/post-edit.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const postEditGuard: CanActivateFn = (route, state) => {
  const postEdit: PostEditService = inject(PostEditService);
  const router: Router = inject(Router);
  if(postEdit.getPreloaded()){
    return true;
  }
  else{
    router.navigateByUrl("/post");
    return false;
  }
};
