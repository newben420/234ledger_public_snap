import { LocalRegex } from '@shared/model/regex';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformID: object) { }

  isStorage(): boolean {
    if(isPlatformBrowser(this.platformID)){
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem('feature_test', 'yes');
          if (localStorage.getItem('feature_test') == 'yes') {
            localStorage.removeItem('feature_test');
            return true;
          }
          else {
            return false;
          }
        } catch (error) {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else{
      return false;
    }
  }

  get(key: string): string | false {
    if (LocalRegex.storageKey.test(key)) {
      if (this.isStorage()) {
        let item = localStorage.getItem(key);
        if (item) {
          return item;
        }
      }
    }
    return false;
  }

  set(key: string, value: string): boolean {
    if (LocalRegex.storageKey.test(key)) {
      if (this.isStorage()) {
        localStorage.setItem(key, value);
        if (localStorage.getItem(key) == value) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  delete(key: string): void {
    if (LocalRegex.storageKey.test(key)) {
      localStorage.removeItem(key);
    }
  }
}
