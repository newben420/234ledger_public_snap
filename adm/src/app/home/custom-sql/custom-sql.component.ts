import { Component } from '@angular/core';
import { QueryService } from '../../services/query.service';
import { PreloaderService } from '../../services/preloader.service';
import { NoteService } from '../../services/note.service';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-custom-sql',
  templateUrl: './custom-sql.component.html',
  styleUrl: './custom-sql.component.css'
})
export class CustomSqlComponent {
  query!: string;
  result!: string;

  constructor(
    private que: QueryService,
    private prel: PreloaderService,
    private note: NoteService,
    private locale: LocaleService,
  ){}

  perform(){
    if(this.query){
      this.prel.show();
      this.que.perform(this.query, r => {
        this.prel.hide();
        if(r.err){
          this.note.show("error", r.message);
        }
        else{
          this.result = r.message;
        }
      });
    }
  }

  clear(){
    this.result = "";
  }

  clearQuery(){
    this.query = "";
  }

  copy(){
    navigator.clipboard.writeText(this.result).then(() => {
      this.locale.trans("prompts.copy", tr => {
        this.note.show("success", tr.message);
      });
    }).catch(err => {});
  }
}
