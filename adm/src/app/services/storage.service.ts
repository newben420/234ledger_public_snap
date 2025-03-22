import { LocalRegex } from '@shared/model/regex';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  isStorage(): boolean {
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
