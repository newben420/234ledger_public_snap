import { Image } from '@shared/db/image';
import { Component } from '@angular/core';
import { LocaleService } from './../../../services/locale.service';
import { TableConfig } from '@shared/model/table_config';
import { NoteService } from '../../../services/note.service';
import { PreloaderService } from '../../../services/preloader.service';
import { PromptService } from '../../../shared/prompt/prompt.service';
import { LocalRegex } from '@shared/model/regex';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrl: './images.component.css'
})
export class ImagesComponent {
  constructor(
    private locale: LocaleService,
    private note: NoteService,
    private prel: PreloaderService,
    private prompt: PromptService,
    private image: ImageService,
  ) { }

  tableConfig: TableConfig = {
    data: [
    ],
    itemsPerPage: 10,
    editableColumns: ['title'],
    editFunction: (index: number, column: string, currentValue: string) => {
      let row = this.tableConfig.data[index];
      if (column == 'title') {
        this.editTitle(currentValue, row.id);
      }
    },
    emptyMessage: 'table.no_img',
    filters: [

    ],
    addNew: () => {
      this.addNew();
    },
    actions: [
      {
        icon: 'bi bi-trash-fill',
        callback: (id: number) => {
          this.deleteImage(id);
        },
        title: 'table.delete',
        column: 'id',
        btnClass: 'btn btn-danger btn-sm'
      },
      {
        icon: 'bi bi-eye',
        callback: (link: string) => {
          this.view(link);
        },
        title: 'table.view',
        column: 'link',
        btnClass: 'btn btn-success btn-sm'
      },
      {
        icon: 'bi bi-copy',
        callback: (link: string) => {
          this.copyLink(link);
        },
        title: 'table.link_copy',
        column: 'link',
        btnClass: 'btn btn-success btn-sm'
      }
    ],
    labels: [
      {
        column: 'id',
        name: 'table.id',
      },
      {
        column: 'title',
        name: 'table.title',
      },
    ]
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      this.locale.trans("prompts.copy", tr => {
        this.note.show("success", tr.message);
      });
    }).catch(err => {});
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
            this.image.editTitle(title.trim(), id, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.getImages();
              }
            });
          }
        }
      });
    });
  }

  addNew() {
    let fl!: File;
    let tit!: string;
    this.locale.transGroup([
      'admin.title',
      'admin.title_ins',
      'post.file',
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
            tit = title;
            fx();
          }
        });
      }

      const getImage = (fx: Function) => {
        this.prompt.file({
          AcceptFileCategory: 'image',
          AcceptFileFormat: ['image/png', 'image/jpeg'],
          inputType: 'file',
          maxFileSize: parseInt(import.meta.env["NG_APP_MAX_UPLOAD_SIZE_BYTES"]),
          title: tr[2],
          cancelButton: false,
          closeButton: true,
          required: true,
          callback: (file: File) => {
            fl = file;
            fx();
          }
        });
      }

      // flow
      getImage(() => {
        getTitle(() => {
          this.prel.show();
          this.image.uploadFile(fl, tit, res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.getImages();
            }
          });
        });
      });

    });
  }

  ngOnInit() {
    this.getImages();
  }

  getImages(pre: boolean = false) {
    if (pre) {
      this.prel.show();
    }
    this.image.getImages(r => {
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

  deleteImage(id: number) {
    this.locale.transGroup([
      'prompts.sure_del_cat'
    ], tr => {
      this.prompt.confirm(tr[0], yes => {
        if(yes){
          this.prel.show();
            this.image.deleteImage(id, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.getImages();
              }
            });
        }
      });
    });
  }

  viewerSRC!: string;
  viewerShow: boolean = false;

  toggleViewer(){
    this.viewerShow = !this.viewerShow;
  }

  view(link: string) {
    this.viewerSRC = link;
    this.viewerShow = true;
  }
}
