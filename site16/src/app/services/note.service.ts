import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { PromptService } from '../shared/prompt/prompt.service';
import { BoolParamFx } from '../env';
import { LocaleService } from './locale.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private notifierService: NotifierService, private prompt: PromptService, private locale: LocaleService,) { }

  show(type: "success" | "warning" | "info" | "error", message: string){
    this.notifierService.notify(type, message);
  }

  showTR(type: "success" | "warning" | "info" | "error", message: string){
    this.locale.trans(message, r => {
      this.notifierService.notify(type, r.message);
    });
  }

  confirm(message: string, fn: BoolParamFx){
    this.prompt.confirm(message, res => {
      fn(res);
    });
  }

}
