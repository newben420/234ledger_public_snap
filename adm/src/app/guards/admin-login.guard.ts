import { CanActivateFn } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminLoginGuard: CanActivateFn = async (route, state) => {
  const ams: AdminService = inject(AdminService);
  const router: Router = inject(Router);
  let myPromise = () => {
    return new Promise<boolean>((resolve, reject) => {
      ams.isAuth((bool_key: boolean) => {
        resolve(bool_key);
      }, false);
    });
  }
  let re: boolean = false;
  if (ams.isAuthGet()) {
    router.navigateByUrl("/");
    return false;
  }
  re = await myPromise();
  if (!re) {
    return true;
  }
  else {
    router.navigateByUrl("/");
    return false;
  }
};
