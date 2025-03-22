import { CanActivateFn, Router } from '@angular/router';
import { SectionService } from '../services/section.service';
import { inject } from '@angular/core';

export const sectionGuard: CanActivateFn = async (route, state) => {
  const sec: SectionService = inject(SectionService);
  const router: Router = inject(Router);
  let secID: number = 0;
  let secTit: string = "";
  let secSlug: string = "";
  const isValid = () => {
    return new Promise<boolean>((resolve, reject) => {
      sec.get(r => {
        if(r.err){
          resolve(false);
        }
        else{
          let filt = (r.message as any[]).filter(x => x.title_slug == route.url[0].path);
          if(filt.length > 0){
            secID = filt[0].id;
            secTit = filt[0].title;
            secSlug = filt[0].title_slug;
            resolve(true);
          }
          else{
            resolve(false);
          }
        }
      });
    });
  }
  let valid: boolean = await isValid();
  if(valid){
    sec.openedSection= secID;
    sec.openedSectionTitle = secTit;
    sec.openedSectionSlug = secSlug;
  }
  else{
    router.navigateByUrl("/");
  }
  return valid;
};
