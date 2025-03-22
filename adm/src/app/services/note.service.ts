import { Injectable } from '@angular/core';
import { NotifierService } from 'gramli-angular-notifier';
import { PromptService } from '../shared/prompt/prompt.service';
import { BoolParamFx } from '../env';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private notifierService: NotifierService, private prompt: PromptService) { }

  show(type: "success" | "warning" | "info" | "error", message: string){
    this.notifierService.notify(type, message);
  }

  confirm(message: string, fn: BoolParamFx){
    this.prompt.confirm(message, res => {
      fn(res);
    });
  }

}
