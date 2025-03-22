import { CanActivateFn, Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { inject } from '@angular/core';

export const categoryGuard: CanActivateFn = async (route, state) => {
  const cat: CategoryService = inject(CategoryService);
  const router: Router = inject(Router);
  let catID: number = 0;
  let catTit: string = "";
  let catSlug: string = "";
  const isValid = () => {
    return new Promise<boolean>((resolve, reject) => {
      cat.get(r => {
        if(r.err){
          resolve(false);
        }
        else{
          let filt = (r.message as any[]).filter(x => x.title_slug == route.url[0].path);
          if(filt.length > 0){
            catID = filt[0].id;
            catTit = filt[0].title;
            catSlug = filt[0].title_slug;
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
    cat.openedCategory = catID;
    cat.openedCategoryTitle = catTit;
    cat.openedCategorySlug = catSlug;
  }
  else{
    router.navigateByUrl("/");
  }
  return valid;
};
