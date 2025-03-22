import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveModuleService {

  private am = new BehaviorSubject<string>("");
  activeModule = this.am.asObservable();
  setActiveModule(x: string) {
    this.am.next(x);
  }
  constructor() { }
}
