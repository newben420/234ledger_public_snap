import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Res } from '@shared/model/res';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MyI18n } from '@shared/model/i18n';
import { StorageService } from './storage.service';
import { ResParamFx, StringArrayParamFx } from '../env';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  cl = new BehaviorSubject(import.meta.env["NG_APP_DEFAULT_LOCALE"]);
  currentLang = this.cl.asObservable();

  shw = new BehaviorSubject(false);
  show = this.shw.asObservable();

  constructor(private translate: TranslateService, private store: StorageService) {
  }

  setLocale(key: string) {
    // user manually setting locale from interface
    if (MyI18n.isDefined(key)) {
      // supplied locale is defined
      this.store.set('locale', key);
      this.translate.use(key);
      this.cl.next(key);
      this.shw.next(false);
    }
    else {
      // do nothing, user tryna start some bs by supplying a value that was not shown.... phucomol
    }
  }

  trans(key: string, fn: ResParamFx, val: any = {}) {
    let sub: Subscription = this.translate.get(key, val).subscribe((res: string) => {
      if (res == key) {
        fn({ err: true, message: res } as Res);
      }
      else {
        fn({ err: false, message: res } as Res);
      }
      try {
        sub.unsubscribe();
      } catch (error) {

      }
    });
  }

  transGroup(keys: string[], fn: StringArrayParamFx){
    let res: string[] = []
    let keysCp: string[] = keys.filter(x => true);
    const runX = (cb: Function) => {
      if(keysCp.length == 0){
        cb();
      }
      else{
        let key: string = keysCp.shift()!;
        this.trans(key, r => {
          res.push(r.message);
          runX(cb);
        });
      }
    }
    runX(() => {
      fn(res);
    });
  }

  setAutoLocale() {
    let brLang = this.translate.getBrowserLang();
    if (brLang && /^[a-z]{2}$/i.test(brLang)) {
      // browser has a default language set
      // check if browser language is supported in app
      let la = brLang.toLowerCase();
      if (MyI18n.isDefined(la)) {
        // browser language is supported in app
        this.store.set('locale', la);
        this.translate.use(la);
        this.cl.next(la);
        this.shw.next(false);
      }
      else {
        // browser lang not supported in app, result to default language
        this.store.set('locale', import.meta.env["NG_APP_DEFAULT_LOCALE"]);
        this.translate.use(import.meta.env["NG_APP_DEFAULT_LOCALE"]);
        this.cl.next(import.meta.env["NG_APP_DEFAULT_LOCALE"]);
        this.shw.next(false);
      }
    }
    else {
      // no default browser language, result to app default
      this.store.set('locale', import.meta.env["NG_APP_DEFAULT_LOCALE"]);
      this.translate.use(import.meta.env["NG_APP_DEFAULT_LOCALE"]);
      this.cl.next(import.meta.env["NG_APP_DEFAULT_LOCALE"]);
      this.shw.next(false);
    }
  }

  init() {
    this.translate.setDefaultLang(import.meta.env["NG_APP_DEFAULT_LOCALE"]);
    this.translate.addLangs(MyI18n.localeCodesToArray());

    let setLang = this.store.get('locale');
    if (setLang) {
      // language has been set;
      // check if it exists in defined locale, else delete locale storage and try to use default or get browser lang
      if (MyI18n.isDefined(setLang)) {
        // language is available
        this.translate.use(setLang);
        this.cl.next(setLang);
        this.shw.next(false);
      }
      else {
        this.store.delete('locale');
        this.setAutoLocale();
      }
    }
    else {
      // language is not set, set auto locale
      this.setAutoLocale();
    }
  }
}
