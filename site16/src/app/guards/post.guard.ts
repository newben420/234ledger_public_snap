import { CanActivateFn, Router } from '@angular/router';
import { ContentService } from '../services/content.service';
import { inject } from '@angular/core';
import { SectionService } from '../services/section.service';

export const postGuard: CanActivateFn = async (route, state) => {
  const cont: ContentService = inject(ContentService);
  const sec: SectionService = inject(SectionService);
  const router: Router = inject(Router);
  const isValid = () => {
    return new Promise<boolean>((resolve, reject) => {
      cont.loadPost(route.url[0].path, r => {
        sec.get(rr => {
          resolve(r && !rr.err);
        });
      }, true);
    });
  }
  let valid: boolean = await isValid();
  if(!valid){
    router.navigateByUrl("/");
  }
  return valid;
};
