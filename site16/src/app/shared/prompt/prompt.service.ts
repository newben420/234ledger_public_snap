import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PromptObject, PromptObjectFile, PromptObjectInput, PromptObjectSelect } from './prompObject';
import { Res } from "@shared/model/res";
import { LocaleService } from '../../services/locale.service';
import { BoolParamFx } from '../../env';
@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private initPrompt = new BehaviorSubject({ operation: 'init', opts: new PromptObject(), id: '' });
  prompts = this.initPrompt.asObservable();
  constructor(private locale: LocaleService) { }
  private opts!: PromptObject;
  private genID() {
    let idx = 'pr-' + Date.now().toString() + '-' + (Math.floor(Math.random() * 100)).toString() + (Math.floor(Math.random() * 100)).toString() + (Math.floor(Math.random() * 100)).toString();
    this.opts.id = idx;
  }
  private prompt(optObj: PromptObject): any {
    this.opts = optObj;
    this.genID();
    this.addPrompt();
  }
  private addPrompt() {
    this.initPrompt.next({ operation: 'add', opts: this.opts, id: (this.opts.id ? this.opts.id : '') });
  }
  // public callable functions
  confirm(title: string, cb: BoolParamFx, confirmButtons = ['buttons.no', 'buttons.yes']) {
    let inputx: PromptObject = {
      inputType: 'confirm',
      title: title,
      closeButton: false,
      confirmButtons: confirmButtons,
      callback: (res: boolean) => {
        cb(res);
      }
    }
    this.prompt(inputx);
  }
  alert(type: 'info' | 'error' | 'success' | 'warning', title: string) {
    let interfaceType: 'primary' | 'danger' | 'success' | 'warning' = "primary";
    if (type == "info") {
      interfaceType = "primary"
    }
    else if (type == "error") {
      interfaceType = "danger"
    }
    else {
      interfaceType = type;
    }
    let inputx: PromptObject = {
      inputType: interfaceType,
      title: title,
    }
    this.prompt(inputx);
  }
  input(localOpts: PromptObjectInput) {
    if (!localOpts.rows) {
      localOpts.rows = 3;
    }
    if (!localOpts.required) {
      localOpts.required = false;
    }
    if (!localOpts.errorMessage) {
      localOpts.errorMessage = 'ins.def';
    }
    if (!localOpts.pattern) {
      localOpts.pattern = /^.*$/;
    }
    this.locale.trans(localOpts.errorMessage, (tr3: Res) => {
      localOpts.errorMessage = tr3.message;
      this.prompt(localOpts);
    });
  }
  select(localOpts: PromptObjectSelect) {
    if (!localOpts.required) {
      localOpts.required = false;
    }
    if (!localOpts.errorMessage) {
      localOpts.errorMessage = 'ins.def';
    }
    if (!localOpts.pattern) {
      localOpts.pattern = /^.*$/;
    }
    this.locale.trans(localOpts.errorMessage, (tr3: Res) => {
      localOpts.errorMessage = tr3.message;
      this.prompt(localOpts);
    });
  }
  check(title: string, message: string, cb: Function) {
    let localOpts: PromptObject = {
      inputType: 'checkbox',
      title: title,
      pattern: /^true|false$/i,
      checboxDesc: message,
      closeButton: true,
      callback: (res: string) => {
        let r = res?.toString().toLowerCase().trim() == "true";
        cb(r);
      }
    };
    this.prompt(localOpts);
  }
  file(localOpts: PromptObjectFile) {
    this.locale.trans('ins.upload', (tr3: Res) => {
      localOpts.instr = tr3.message;
      if (!localOpts.required) {
        localOpts.required = false;
      }
      if (!localOpts.errorMessage) {
        localOpts.errorMessage = 'ins.def';
      }
      if (!localOpts.pattern) {
        localOpts.pattern = /^.*$/;
      }
      localOpts.cancelButton = false;
      localOpts.closeButton = true;
      this.locale.trans(localOpts.errorMessage, (tr3: Res) => {
        localOpts.errorMessage = tr3.message;
        this.prompt(localOpts);
      });
    }, {figure: ((localOpts.AcceptFileCategory.charAt(0).match(/[aeiou]/i) == null) ? 'a' : 'an'), category: (localOpts.AcceptFileCategory), size: (Math.floor(localOpts.maxFileSize / 1000))});
  }
}
