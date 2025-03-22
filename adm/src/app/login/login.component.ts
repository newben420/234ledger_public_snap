import { Login } from '@shared/model/login';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocalRegex } from '@shared/model/regex';
import { PreloaderService } from '../services/preloader.service';
import { PromptService } from '../shared/prompt/prompt.service';
import { NoteService } from '../services/note.service';
import { Helper } from '../helper';
import { LocaleService } from '../services/locale.service';
import { Res } from '@shared/model/res';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('form', { read: ElementRef }) myForm!: ElementRef;
  model: Login = new Login();
  pattern = LocalRegex;

  constructor(private prel: PreloaderService, private router: Router, private prompt: PromptService, private admin: AdminService, private note: NoteService, private locale: LocaleService) { }

  onSubmit(valid: boolean) {
    if (valid) {
      // this.model = new Login();
      // this.myForm.nativeElement.reset();
      // // this.prel.show()
      // this.promptx();
      if (Helper.cookiesEnabled()) {
        this.prel.show();
        this.admin.authenticate(this.model, (r: Res) => {
          this.prel.hide();
          if (r.err) {
            this.note.show('error', r.message);
          }
          else {
            this.router.navigateByUrl("/");
          }
        });
      }
      else {
        this.locale.trans("prompts.cookies_enable", (r: Res) => {
          this.prompt.alert('error', r.message);
        });
      }
    }
  }

  promptx() {
    //
  }

  ngOnInit() {
    this.promptx();
  }
}
