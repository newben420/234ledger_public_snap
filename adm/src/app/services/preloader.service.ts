import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {

  vis = new BehaviorSubject(true);
  switch = this.vis.asObservable();

  constructor() { }
  show(){
    this.vis.next(true);
  }
  hide(){
    this.vis.next(false);
  }
}
