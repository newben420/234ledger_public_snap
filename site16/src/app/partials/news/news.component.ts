import { emailFreqs } from '@shared/model/email_frequency';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocaleService } from 'src/app/services/locale.service';
import { NoteService } from 'src/app/services/note.service';
import { PreloaderService } from 'src/app/services/preloader.service';
import { ThemeService } from 'src/app/services/theme.service';
import { PromptService } from 'src/app/shared/prompt/prompt.service';
import { LocalRegex } from '@shared/model/regex';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  subs: Record<string, Subscription> = {};
  isDark!: boolean;
  freq = emailFreqs as any[];
  constructor(
    private theme: ThemeService,
    private prompt: PromptService,
    private note: NoteService,
    private prel: PreloaderService,
    private news: NewsService,
    private locale: LocaleService
  ) {
    this.subs["theme"] = theme.isDarkEvent.subscribe(x => {
      this.isDark = x;
    });
  }

  ngOnDestroy() {
    Object.keys(this.subs).forEach(key => {
      this.subs[key].unsubscribe();
    });
  }

  submit() {
    this.locale.transGroup([
      "news.choose",
      "news.choose_ins",
      "news.choose_click",
      "news.email",
      "news.email_ins",
    ], tr => {
      this.prompt.select({
        inputType: 'select',
        title: tr[0],
        options: [
          {
            name: tr[2],
            value: ''
          }
        ].concat(this.freq.map(x => {
          return {
            name: x.title,
            value: x.id,
          }
        })),
        required: true,
        instr: tr[1],

        cancelButton: false,
        closeButton: true,
        callback: (id: number) => {
          this.prompt.input({
            inputType: 'text',
            title: tr[3],
            instr: tr[4],
            cancelButton: false,
            closeButton: true,
            maxlength: 100,
            required: true,
            pattern: LocalRegex.email,
            callback: (email: string) => {
              this.prel.show();
              this.news.submitEmail(id, email, r => {
                this.prel.hide();
                this.note.show(r.err ? "error" : "success", r.message);
              });
            }
          });
        }
      });
    });
  }
}
