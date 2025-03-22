import { Component } from '@angular/core';
import { TableConfig } from '@shared/model/table_config';
import { ApproveService } from '../../../services/approve.service';
import { LocaleService } from '../../../services/locale.service';
import { NoteService } from '../../../services/note.service';
import { PreloaderService } from '../../../services/preloader.service';

@Component({
  selector: 'app-approve-comment',
  templateUrl: './approve-comment.component.html',
  styleUrl: './approve-comment.component.css'
})
export class ApproveCommentComponent {

  constructor(
    private approve: ApproveService,
    private locale: LocaleService,
    private note: NoteService,
    private prel: PreloaderService,
  ) { }

  tableConfig: TableConfig = {
    data: [
    ],
    itemsPerPage: 10,
    emptyMessage: 'table.no_comment',
    actions: [
      {
        icon: 'bi bi-patch-check-fill',
        callback: (id: number) => {
          this.approveComment(id);
        },
        title: 'table.approve',
        column: 'id',
        btnClass: 'btn btn-success btn-sm'
      },
      {
        icon: 'bi bi-trash',
        callback: (id: number) => {
          this.deleteComment(id);
        },
        title: 'table.delete',
        column: 'id',
        btnClass: 'btn btn-danger btn-sm'
      },
    ],
    labels: [
      {
        column: 'comment',
        name: 'post.comment',
      }
    ]
  }

  ngOnInit() {
    this.getComments();
  }

  getComments(pre: boolean = false) {
    if (pre) {
      this.prel.show();
    }
    this.approve.getComments(r => {
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

  approveComment(id: number){
    this.prel.show();
    this.approve.approveComment(id, r => {
      this.prel.hide();
      this.note.show(r.err ? "error" : "success", r.message);
      if(!r.err){
        this.tableConfig = { ...this.tableConfig, data: this.tableConfig.data.filter(x => x.id != id) };
      }
    });
  }

  deleteComment(id: number){
    this.prel.show();
    this.approve.deleteComment(id, r => {
      this.prel.hide();
      this.note.show(r.err ? "error" : "success", r.message);
      if(!r.err){
        this.tableConfig = { ...this.tableConfig, data: this.tableConfig.data.filter(x => x.id != id) };
      }
    });
  }
}
