import { Component } from '@angular/core';
import { LocaleService } from '../../services/locale.service';
import { NoteService } from '../../services/note.service';
import { PreloaderService } from '../../services/preloader.service';
import { PromptService } from '../../shared/prompt/prompt.service';
import { EmailService } from '../../services/email.service';
import { TableConfig } from '@shared/model/table_config';
import { SiteUrlService } from '../../services/site-url.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent {
  constructor(
    private note: NoteService,
    private locale: LocaleService,
    private prompt: PromptService,
    private prel: PreloaderService,
    private email: EmailService,
    private surl: SiteUrlService,
  ) { }

  tableConfig: TableConfig = {
    data: [
    ],
    itemsPerPage: 10,
    emptyMessage: 'table.no_email',
    actions: [
      {
        icon: 'bi bi-download',
        callback: (f: string) => {
          this.download(f);
        },
        title: 'email.download',
        column: 'freq',
        btnClass: 'btn btn-success btn-sm'
      },
      {
        icon: 'bi bi-trash',
        callback: (f: string) => {
          this.delete(f);
        },
        title: 'email.delete',
        column: 'freq',
        btnClass: 'btn btn-danger btn-sm'
      },
    ],
    labels: [
      {
        column: 'freq',
        name: 'email.freq',
      },
      {
        column: 'subs',
        name: 'email.subs',
      }
    ]
  }

  download(freq: string){
    this.surl.getBase(r => {
      if(r){
        let url = `${r}/api/admin/email/download/${freq}`;
        const link = document.createElement("a");
        link.href = url;
        link.download = `${freq}.json`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  delete(freq: string){
    this.locale.transGroup([
      'prompts.sure'
    ], tr => {
      this.prompt.confirm(tr[0], yes => {
        if (yes) {
          this.prel.show();
          this.email.deleteEmail(freq, res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.getEmails();
            }
          });
        }
      });
    });
  }

  ngOnInit() {
    this.getEmails();
  }

  getEmails() {
    this.prel.show();
    this.email.loadComponent(r => {
      this.prel.hide();
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        let data: any[] = [];
        Object.keys(r.message).forEach(key => {
          if(r.message[key] != 0){
            data.push({
              freq: key,
              subs: r.message[key],
            });
          }
        });
        this.tableConfig = { ...this.tableConfig, data };
      }
    });
  }
}
