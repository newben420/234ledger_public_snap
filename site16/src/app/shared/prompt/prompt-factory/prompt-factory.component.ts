import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { PromptObject } from '../prompObject';
import { Res } from '@shared/model/res';
import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { PromptService } from '../prompt.service';
import { LocaleService } from '../../../services/locale.service';
import { LocalRegex } from '@shared/model/regex';
@Component({
  selector: 'app-prompt-factory',
  templateUrl: './prompt-factory.component.html',
  styleUrls: ['./prompt-factory.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        background: 'rgba(0,0,0,0.5)',
      })),
      state('closed', style({
        background: 'rgba(0,0,0,0)',
      })),
      transition('* => closed', [
        animate('0.1s'),
        query('@*', animateChild(), { optional: true })
      ]),
      transition('* => open', [
        animate('0.1s'),
        query('@*', animateChild(), { optional: true })
      ]),
    ]),
    trigger('dropRise', [
      state('dropped', style({
        top: '100px',
      })),
      state('risen', style({
        top: '-50%',
      })),
      transition('* => dropped', [
        animate('100ms ease-out')
      ]),
      transition('* => risen', [
        animate('0.1s')
      ]),
    ]),
  ]
})
export class PromptFactoryComponent {
  @Input('options') opts: PromptObject = new PromptObject();
  @Output() promptResponse = new EventEmitter<Res>();
  @ViewChild('inputField', { read: ElementRef }) el!: ElementRef;
  maxInt = Number.MAX_SAFE_INTEGER;
  minInt = Number.MIN_SAFE_INTEGER;
  value!: any;
  pattern=LocalRegex;
  isOpened: boolean = false;
  file_accept!: string;
  toggle() {
    this.isOpened = !this.isOpened;
  }
  constructor(private prompt: PromptService, private locale: LocaleService) { }
  respond(val: any) {
    this.promptResponse.emit({ err: false, message: val });
  }
  closeButton() {
    this.promptResponse.emit({ err: false, message: { close: true } });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isOpened = true;
    if (this.opts.inputType == "select") {
      this.value = "";
    }
    if (this.opts.inputType == "file") {
      this.file_accept = this.opts.AcceptFileFormat ? this.opts.AcceptFileFormat?.join(", ") : '';
    }
    if(this.opts.initVal || this.opts.initVal == '0'){
      this.value = this.opts.initVal;
    }
  }
  uploadhandler(i: number, optsx: any = false) {
    this.locale.trans('upload.nofile', (tr: Res) => {
      let nofile = tr.message;
      switch (i) {
        case 1:
          optsx.preventDefault();
          if (optsx.dataTransfer.files[0]) {
            this.value = null;
            this.value = optsx.dataTransfer.files[0];
            this.uploadhandler(2);
          }
          else {
            this.locale.trans('upload.pref', (tr2: Res) => {
              this.prompt.alert('error', nofile + " "+tr2.message);
            });
          }
          break;
        case 2:
          if (this.value instanceof File) {
            let err = [];
            // check file size
            if (this.opts.maxFileSize) {
              if (this.opts.maxFileSize < this.value.size) {
                this.locale.trans('upload.exceed', (tr3: Res) => {
                  this.prompt.alert('error', tr3.message);
                }, {size: (Math.floor(this.opts.maxFileSize / 1000))});
                err.push(`upload.exceed`);
              }
            }
            // check file type
            if (this.opts.AcceptFileFormat) {
              if (this.opts.AcceptFileFormat.indexOf(this.value.type) == -1) {
                this.locale.trans('upload.type', (tr3: Res) => {
                  this.prompt.alert('error', tr3.message);
                }, {format: (this.opts.AcceptFileFormat.join(", "))});
                err.push(`upload.type`);
              }
            }
            if (err.length > 0) {
              // this.prompt.alert('error', err.join('\n'));
            }
            else {
              // file is valid
              this.promptResponse.emit({ err: false, message: this.value });
            }
          }
          else {
            this.prompt.alert('error', nofile);
          }
          break;
        case 3:
          if (optsx.length > 0) {
            this.value = null;
            this.value = optsx[0];
            this.uploadhandler(2);
          }
          else {
            this.prompt.alert('error', nofile + ".");
          }
          break;
        case 4:
          optsx.preventDefault();
          break;
        default:
      }
    });

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isOpened = false;
  }
  cancel = false;
  setCancel(v: boolean) {
    this.cancel = v;
  }
  submit(v: boolean) {
    let err = false;
    let errcode: any = this.opts.errorMessage ? this.opts.errorMessage : false;
    let maxl = (this.opts.maxlength) ? this.opts.maxlength : this.maxInt;
    let minl = (this.opts.minlength) ? this.opts.minlength : this.minInt;
    let max = (this.opts.max) ? this.opts.max : this.maxInt;
    let min = (this.opts.min) ? this.opts.min : this.minInt;
    let val = this.value ? this.value : (this.opts.inputType == 'number') ? 0 : (this.opts.inputType == 'checkbox') ? false : '';
    if (this.opts.inputType == 'number') {
      val = val.toString();
    }
    // validate stuff
    // pattern test
    if (!this.opts.pattern?.test(val)) {
      err = true;
      errcode = "M202";
    }
    // length test
    if (val.length > maxl || val.length < minl) {
      err = true
      errcode = "M203";
    }
    // max-min test for numbers
    if (this.opts.inputType == 'number' && (val > max || val < min)) {
      err = true;
      errcode = `${min}-${max}`;
    }
    // check for required
    if (this.opts.required && (this.value ? this.value : '').length == 0) {
      err = true
      errcode = "M204";
    }
    if (!v || this.cancel) {
      err = true;
      if (this.cancel) {
        errcode = "101";
      }
      else {
        errcode = errcode ? errcode : false;
      }
      this.promptResponse.emit({ err: true, message: errcode });
    }
    else {
      // check for errors
      if (err) {
        // emit with errors
        this.promptResponse.emit({ err: true, message: errcode });
      }
      else {
        // emit without errors
        if (this.opts.inputType == 'checkbox') {
          this.promptResponse.emit({ err: false, message: val });
        }
        else {
          this.promptResponse.emit({ err: false, message: this.value });
        }
      }
    }
  }
}
