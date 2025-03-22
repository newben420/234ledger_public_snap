import { Section } from '@shared/db/section';
import { Component } from '@angular/core';
import { Slugify } from '@shared/slugify';
import { LocaleService } from './../../../services/locale.service';
import { TableConfig } from '@shared/model/table_config';
import { NoteService } from '../../../services/note.service';
import { PreloaderService } from '../../../services/preloader.service';
import { PromptService } from '../../../shared/prompt/prompt.service';
import { LocalRegex } from '@shared/model/regex';
import { SiteUrlService } from '../../../services/site-url.service';
import { SectionService } from '../../../services/section.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
  constructor(
    private locale: LocaleService,
    private note: NoteService,
    private prel: PreloaderService,
    private prompt: PromptService,
    private sec: SectionService,
    private surl: SiteUrlService,
  ) { }

  tableConfig: TableConfig = {
    data: [
    ],
    itemsPerPage: 10,
    editableColumns: ['title', 'title_slug'],
    editFunction: (index: number, column: string, currentValue: string) => {
      let row = this.tableConfig.data[index];
      if (column == 'title') {
        this.editTitle(currentValue, row.id);
      }
      else if (column == 'title_slug') {
        this.editSlug(currentValue, row.title, row.id);
      }
    },
    emptyMessage: 'table.no_sec',
    filters: [

    ],
    addNew: () => {
      this.addNew();
    },
    actions: [
      {
        icon: 'bi bi-trash-fill',
        callback: (id: number) => {
          this.deleteSection(id);
        },
        title: 'table.delete',
        column: 'id',
        btnClass: 'btn btn-danger btn-sm'
      },
      {
        icon: 'bi bi-link-45deg',
        callback: (slug: string) => {
          this.visit(slug);
        },
        title: 'table.visit',
        column: 'title_slug',
        btnClass: 'btn btn-success btn-sm'
      }
    ],
    labels: [
      {
        column: 'title',
        name: 'table.title',
      },
      {
        column: 'title_slug',
        name: 'table.slug',
      }
    ]
  }

  ngOnInit() {
    this.getSections();
  }

  getSections(pre: boolean = false) {
    if (pre) {
      this.prel.show();
    }
    this.sec.getSections(r => {
      if (pre) {
        this.prel.hide();
      }
      if (r.err) {
        this.note.show("error", r.message);
      }
      else {
        this.tableConfig = { ...this.tableConfig, data: r.message };
      }
    });
  };

  visit(slug: string){
    this.surl.getBase(r => {
      if(r){
        window.open(`${r}/section/${slug}`, '_blank');
      }
    });
  }

  deleteSection(id: number){
    this.locale.transGroup([
      'prompts.sure_del_cat'
    ], tr => {
      this.prompt.confirm(tr[0], yes => {
        if(yes){
          this.prel.show();
            this.sec.deleteSection(id, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.getSections();
              }
            });
        }
      });
    });
  }

  editTitle(current: string, id: number) {
    this.locale.transGroup([
      'admin.edit_title',
      'admin.title_ins',
      'prompts.no_change',
    ], tr => {
      this.prompt.input({
        title: tr[0],
        instr: tr[1],
        inputType: 'text',
        cancelButton: false,
        closeButton: true,
        maxlength: 100,
        minlength: 1,
        initVal: current,
        required: true,
        pattern: LocalRegex.title,
        callback: (title: string) => {
          if (title.trim() == current) {
            this.note.show("success", tr[2]);
          }
          else {
            this.prel.show();
            this.sec.editTitleSection(title.trim(), id, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.getSections();
              }
            });
          }
        }
      });
    });
  }

  editSlug(current: string, title: string, id: number) {
    this.locale.transGroup([
      'admin.edit_slug',
      'admin.slug_ins',
      'prompts.no_change',
    ], tr => {
      this.prompt.input({
        title: tr[0],
        instr: tr[1],
        inputType: 'text',
        cancelButton: false,
        closeButton: true,
        maxlength: 100,
        minlength: 1,
        initVal: Slugify(title),
        required: true,
        pattern: LocalRegex.slug,
        callback: (slug: string) => {
          if (slug.trim() == current) {
            this.note.show("success", tr[2]);
          }
          else {
            this.prel.show();
            this.sec.editSlugSection(slug.trim(), id, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.getSections();
              }
            });
          }
        }
      });
    });
  }

  addNew() {
    let sec: Section = new Section();
    this.locale.transGroup([
      'admin.title',
      'admin.title_ins',
      'admin.slug',
      'admin.slug_ins',
    ], tr => {
      const getTitle = (fx: Function) => {
        this.prompt.input({
          title: tr[0],
          instr: tr[1],
          inputType: 'text',
          cancelButton: false,
          closeButton: true,
          maxlength: 100,
          minlength: 1,
          required: true,
          pattern: LocalRegex.title,
          callback: (title: string) => {
            sec.title = title;
            sec.title_slug = Slugify(title);
            fx();
          }
        });
      }

      const getSlug = (fx: Function) => {
        this.prompt.input({
          title: tr[2],
          instr: tr[3],
          inputType: 'text',
          cancelButton: false,
          closeButton: true,
          maxlength: 100,
          minlength: 1,
          required: true,
          initVal: sec.title_slug,
          pattern: LocalRegex.slug,
          callback: (title_slug: string) => {
            sec.title_slug = Slugify(title_slug);
            fx();
          }
        });
      }

      // flow
      getTitle(() => {
        getSlug(() => {
          this.prel.show();
          this.sec.addSection(sec.title!.trim(), sec.title_slug!.trim(), res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.getSections();
            }
          });
        });
      });

    });
  }
}
