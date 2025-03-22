import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private shw = new BehaviorSubject<boolean>(false);
  shwEvent =  this.shw.asObservable();
  show(){
    this.shw.next(true);
  }
  hide(){
    this.shw.next(false);
  }
  constructor() { }
}
