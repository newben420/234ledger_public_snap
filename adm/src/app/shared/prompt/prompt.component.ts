import { Component, ElementRef, ViewChild, Renderer2, ViewContainerRef, ComponentRef } from '@angular/core';
import { Res } from "@shared/model/res";
import { PromptObject } from './prompObject';
import { Subscription } from 'rxjs';
import { PromptService } from './prompt.service';
import { PromptFactoryComponent } from './prompt-factory/prompt-factory.component';
import { LocaleService } from '../../services/locale.service';
@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.css'],
})
export class PromptComponent {
  @ViewChild('promptCont', { read: ViewContainerRef }) myCont!: ViewContainerRef;
  ref!: ComponentRef<PromptFactoryComponent>;
  prompts: any = {};
  subs!: Subscription;
  promptComponentClass = PromptFactoryComponent;
  constructor(private locale: LocaleService, private promptService: PromptService, private renderer: Renderer2/*, private componentFactoryResolver: ComponentFactoryResolver*/) {
    this.subs = promptService.prompts.subscribe((prmpts: any) => {
      if (prmpts.operation == "add") {
        let component = this.myCont.createComponent(PromptFactoryComponent);
        component.instance.opts = prmpts.opts;
        this.prompts[prmpts.opts.id] = component;
        let opts = prmpts.opts as PromptObject;
        component.instance.promptResponse.subscribe((r: Res) => {
          if (r.err) {
            // handle error from component
            // notify error message
            if (r.message) {
              if (r.message == "101") {
                r.message = "prompts.oc";
                this.locale.trans(r.message, (tr3: Res) => {
                  promptService.alert('info', tr3.message);
                  this.removePrompt(component, prmpts.opts.id);
                });
              }
              else {
                let trVal = {};
                if (/^\d+\-\d+$/.test(r.message)) {
                  let lim = r.message.split("-");
                  r.message = `ins.minmax`;
                  trVal = {min: lim[0], max: lim[1]}
                }
                if (r.message == "M202") {
                  r.message = opts.errorMessage ? opts.errorMessage : "ins.pat";
                }
                if (r.message == "M203") {
                  r.message = opts.errorMessage ? opts.errorMessage : "ins.loob";
                }
                if (r.message == "M204") {
                  r.message = "ins.req";
                }
                this.locale.trans(r.message, (tr3: Res) => {
                  promptService.alert('error', tr3.message);
                },trVal);
              }
            }
            else {
              if(opts.errorMessage){
                promptService.alert('error', opts.errorMessage);
              }
              else{
                this.locale.trans('prompts.def_error', (tr3: Res) => {
                  promptService.alert('error', tr3.message);
                });
              }
            }
          }
          else {
            // handle responses
            // handle confirm
            if (opts.inputType == "confirm") {
              this.removePrompt(component, prmpts.opts.id);
              if (opts.callback) {
                opts.callback(r.message);
              }
            }
            // handle alert
            else if (['primary', 'danger', 'success', 'warning'].indexOf(opts.inputType) != -1) {
              this.removePrompt(component, prmpts.opts.id);
            }
            // handle normal inputs, textarea and select and checkbox
            else if (['text', 'number', 'password', 'textarea', 'select', 'checkbox', 'file'].indexOf(opts.inputType) != -1) {
              if ((r.message ? r.message : {}).close) {
                // close button clicked
                this.removePrompt(component, prmpts.opts.id);
              }
              else {
                // close button was not clicked
                this.removePrompt(component, prmpts.opts.id);
                if (opts.callback) {
                  opts.callback(r.message ? r.message : null);
                }
              }
            }
          }
        })
      }
    });
  }
  removePrompt(ref: ComponentRef<PromptFactoryComponent>, id: string) {
    // delete component from prompt
    const index = this.myCont.indexOf(ref.hostView)
    if (index != -1) this.myCont.remove(index)
    delete this.prompts[id];
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
