import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashMenuService {

  isa = new BehaviorSubject(false);
  isActive = this.isa.asObservable();

  constructor() { }
}
