import { CanActivateChildFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

export const adminSessionGuard: CanActivateChildFn = async (childRoute, state) => {
  const ams: AdminService = inject(AdminService);
  const router: Router = inject(Router);
  let myPromise = () =>{
    return new Promise((resolve, reject)=>{
      ams.isAuth((bool_key: boolean)=>{
        resolve(bool_key);
      }, false);
    });
  }
  let re: boolean = false;
  re = await myPromise() as boolean;
  if(!re){
    router.navigateByUrl('/login');
  }
  return re;
};
