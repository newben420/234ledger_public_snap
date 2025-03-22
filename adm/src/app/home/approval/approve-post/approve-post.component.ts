import { Component } from '@angular/core';
import { TableConfig } from '@shared/model/table_config';
import { ApproveService } from '../../../services/approve.service';
import { LocaleService } from '../../../services/locale.service';
import { NoteService } from '../../../services/note.service';
import { PreloaderService } from '../../../services/preloader.service';

@Component({
  selector: 'app-approve-post',
  templateUrl: './approve-post.component.html',
  styleUrl: './approve-post.component.css'
})
export class ApprovePostComponent {

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
    emptyMessage: 'table.no_post',
    actions: [
      {
        icon: 'bi bi-patch-check-fill',
        callback: (id: number) => {
          this.approvePost(id);
        },
        title: 'table.approve',
        column: 'id',
        btnClass: 'btn btn-success btn-sm'
      },
      {
        icon: 'bi bi-eye-fill',
        callback: (id: number) => {
          this.getContents(id);
        },
        title: 'table.view',
        column: 'id',
        btnClass: 'btn btn-success btn-sm'
      },
    ],
    labels: [
      {
        column: 'last_modifiedx',
        name: 'table.last_modified',
      },
      {
        column: 'title',
        name: 'table.title',
      },
      {
        column: 'category',
        name: 'table.category',
      },
    ]
  }

  approvePost(id: number) {
    this.prel.show();
    this.approve.approvePost(id, r => {
      this.prel.hide();
      this.note.show(r.err ? "error" : "success", r.message);
      if(!r.err){
        this.tableConfig = { ...this.tableConfig, data: this.tableConfig.data.filter(x => x.id != id) };
      }
    });
  }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(pre: boolean = false) {
    if (pre) {
      this.prel.show();
    }
    this.approve.getPosts(r => {
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

  viewerSRC!: string;
  viewerShow: boolean = false;

  toggleViewer() {
    this.viewerShow = !this.viewerShow;
  }

  view(link: string) {
    this.viewerSRC = link;
    this.viewerShow = true;
  }

  showContents: boolean = false;

  openedPostDescription: string = "";
  openedPostImageLink: string = "";

  contentsTableConfig: TableConfig = {
    data: [],
    // editableColumns: [],
    labels: [
      {
        column: 'section',
        name: 'table.section',
      },
      {
        column: 'body',
        name: 'post.body',
        isHtml: true,
      }
    ],
    itemsPerPage: 10,
    emptyMessage: 'post.no_content',
  };

  getContents(id: number) {
    this.prel.show();
    this.approve.getPostContents(id, r => {
      console.log(r);
      this.prel.hide();
      if (r.err) {
        this.note.show("error", r.message);
      }
      else{
        this.contentsTableConfig = { ...this.contentsTableConfig, data: r.message.content };
        this.openedPostDescription = r.message.post.description;
        this.openedPostImageLink = r.message.post.image;
        this.showContents = true;
      }
    });
  }

  exitContents() {
    this.contentsTableConfig = { ...this.contentsTableConfig, data: [] };
    this.openedPostDescription = "";
        this.openedPostImageLink = "";
    this.showContents = false;
  }
}
