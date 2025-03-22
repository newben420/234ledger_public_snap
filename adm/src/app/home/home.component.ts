import { TabItem } from '@shared/model/tabs';
import { Component } from '@angular/core';
import { Admin } from '@shared/db/admin';
import { Subscription } from 'rxjs';
import { AdminService } from '../services/admin.service';
import { gdtProcess, getDateTime } from '../env';
import { ActiveModuleService } from '../services/active-module.service';
import { LocaleService } from '../services/locale.service';
import { NoteService } from '../services/note.service';
import { PreloaderService } from '../services/preloader.service';
import { NavigationEnd, Router, Event } from '@angular/router';
import { LocalRegex } from '@shared/model/regex';
import { PromptService } from '../shared/prompt/prompt.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  subs: Record<string, Subscription> = {};

  menuOpen: boolean = false;
  adm!: Admin;
  gdt = gdtProcess;
  activeModule!: string;
  url!: string;

  constructor(
    private admin: AdminService,
    private prompt: PromptService,
    private router: Router,
    private actM: ActiveModuleService,
    private prel: PreloaderService,
    private locale: LocaleService,
    private note: NoteService
  ) {
    this.subs["adm"] = admin.admin.subscribe(x => {
      this.adm = x;
    });
    this.subs["am"] = actM.activeModule.subscribe(x => {
      this.activeModule = x;
    });
    this.subs["route"] = router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = router.url;
      }
    });
  }

  ngOnDestroy() {
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }

  toogleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  modProc(x: any): any[] {
    try {
      return x as any[];
    } catch (error) {
      return [] as any[];
    }
  }

  maxWidthBreakPoint = import.meta.env["NG_APP_DASH_MAXWBR"]

  brand = import.meta.env["NG_APP_BRAND"];

  logout() {
    this.locale.transGroup(["prompts.logout"], r => {
      this.note.confirm(r[0], yes => {
        if (yes) {
          this.prel.show();
          this.admin.logout(res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.router.navigateByUrl("/login");
            }
          });
        }
      });
    });
  }


  logoutOthers() {
    this.locale.transGroup(["prompts.logout_others"], r => {
      this.note.confirm(r[0], yes => {
        if (yes) {
          this.prel.show();
          this.admin.logoutOthers(res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
          });
        }
      });
    });
  }

  changePassword() {
    this.locale.transGroup([
      "admin.new_pass",
      "admin.new_pass_ins",
      "admin.confirm_pass",
      "admin.confirm_pass_ins",
      "admin.current_pass",
    ], tr => {

      // ask for password
      this.prompt.input({
        inputType: 'password',
        title: tr[0],
        cancelButton: false,
        closeButton: true,
        instr: tr[1],
        minlength: 8,
        maxlength: 100,
        pattern: LocalRegex.password,
        required: true,
        callback: (pw: string) => {
          const escapedString = pw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`^${escapedString}$`);
          // confirm password
          this.prompt.input({
            inputType: 'password',
            title: tr[2],
            cancelButton: false,
            closeButton: true,
            instr: tr[3],
            minlength: 8,
            maxlength: 100,
            pattern: regex,
            required: true,
            callback: (copw: string) => {
              this.prompt.input({
                inputType: 'password',
                title: tr[4],
                cancelButton: false,
                closeButton: true,
                minlength: 8,
                maxlength: 100,
                pattern: LocalRegex.password,
                required: true,
                callback: (cupw: string) => {
                  // confirm password
                  this.prel.show();
                  this.admin.changePassword(pw, cupw, res => {
                    this.prel.hide();
                    this.note.show(res.err ? "error" : "success", res.message);
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  tabs: TabItem[] = [
    { title: 'dashboard.tabs.home', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
    { title: 'dashboard.tabs.sql', path: '' },
  ];
}
