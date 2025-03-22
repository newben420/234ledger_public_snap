import { getDateString } from '@shared/model/date_string';
import { Component } from '@angular/core';
import { LocaleService } from './../../../../services/locale.service';
import { TableConfig } from '@shared/model/table_config';
import { NoteService } from '../../../../services/note.service';
import { PreloaderService } from '../../../../services/preloader.service';
import { PromptService } from '../../../../shared/prompt/prompt.service';
import { PostEditService } from '../../../../services/post-edit.service';
import { PostService } from '../../../../services/post.service';
import { SiteUrlService } from '../../../../services/site-url.service';

@Component({
  selector: 'app-posts-table',
  templateUrl: './posts-table.component.html',
  styleUrl: './posts-table.component.css'
})
export class PostsTableComponent {

  constructor(
    private locale: LocaleService,
    private note: NoteService,
    private prel: PreloaderService,
    private prompt: PromptService,
    private postEdit: PostEditService,
    private posts: PostService,
    private surl: SiteUrlService,
  ) { }

  tableConfig: TableConfig = {
    data: [
    ],
    editableColumns: ['visibility'],
    editFunction: (index: number, column: string, currentValue: string) => {
      let row = this.tableConfig.data[index];
      if (column == 'visibility') {
        this.hidePost(row.id, currentValue as "Yes" | "No");
      }
    },
    itemsPerPage: 10,
    emptyMessage: 'table.no_post',
    filters: [
      {
        column: 'date_created',
        relationship: 'eq',
        title: getDateString(),
        value: getDateString(),
      },
      {
        column: 'date_created',
        relationship: 'eq',
        title: getDateString(Date.now() - (86400000 * 1)),
        value: getDateString(Date.now() - (86400000 * 1)),
      },
      {
        column: 'date_created',
        relationship: 'eq',
        title: getDateString(Date.now() - (86400000 * 2)),
        value: getDateString(Date.now() - (86400000 * 2)),
      },
      {
        column: 'date_created',
        relationship: 'eq',
        title: getDateString(Date.now() - (86400000 * 3)),
        value: getDateString(Date.now() - (86400000 * 3)),
      },
      {
        column: 'date_created',
        relationship: 'eq',
        title: getDateString(Date.now() - (86400000 * 4)),
        value: getDateString(Date.now() - (86400000 * 4)),
      }
    ],
    addNew: () => {
      this.addNew();
    },
    actions: [
      {
        icon: 'bi bi-trash-fill',
        callback: (id: number) => {
          this.deletePost(id);
        },
        title: 'table.delete',
        column: 'id',
        btnClass: 'btn btn-danger btn-sm'
      },
      {
        icon: 'bi bi-link-45deg',
        callback: (slug: string) => {
          this.visitPost(slug);
        },
        title: 'table.visit',
        column: 'title_slug',
        btnClass: 'btn btn-success btn-sm'
      },
      {
        icon: 'bi bi-pen-fill',
        callback: (id: number) => {
          this.editPost(id);
        },
        title: 'table.edit',
        column: 'id',
        btnClass: 'btn btn-success btn-sm'
      },
      {
        icon: 'bi bi-chat-fill',
        callback: (id: number) => {
          this.manageComments(id);
        },
        title: 'post.manage_comments',
        column: 'id',
        btnClass: 'btn btn-success btn-sm'
      },

    ],
    labels: [
      {
        column: 'date_created',
        name: 'table.date_created',
      },
      {
        column: 'last_modifiedx',
        name: 'table.last_modified',
      },
      {
        column: 'title',
        name: 'table.title',
      },
      {
        column: 'visibility',
        name: 'table.published',
      },
      {
        column: 'comments',
        name: 'table.comments',
      },
    ]
  }

  showComments: boolean = false;

  commentsTableConfig: TableConfig = {
    data: [],
    // editableColumns: [],
    labels: [
      {
        column: 'last_modifiedx',
        name: 'table.last_modified',
      },
      {
        column: 'comment',
        name: 'post.comment',
      }
    ],
    itemsPerPage: 10,
    emptyMessage: 'post.no_comments',
    actions: [
      {
        icon: 'bi bi-trash-fill',
        callback: (id: number) => {
          this.deleteComment(id);
        },
        title: 'table.delete',
        column: 'id',
        btnClass: 'btn btn-danger btn-sm'
      },
    ]
  };

  openedCommentsPostID: number = 0;

  manageComments(id: number){
    let post: any = this.tableConfig.data.filter(x => x.id == id)[0];
    if(post.comments == 0){
      this.locale.trans("post.no_comments", r => {
        this.note.show("error", r.message);
      });
    }
    else{
      this.prel.show();
      this.posts.getComments(id, r => {
        this.prel.hide();
        if(r.err){
          this.note.show("error", r.message);
        }
        else{
          this.commentsTableConfig = { ...this.commentsTableConfig, data: r.message };
          this.openedCommentsPostID = id;
          this.showComments = true;
        }
      });
    }
  }

  deleteComment = (id: number) => {
    this.locale.transGroup([
      'prompts.sure'
    ], tr => {
      this.prompt.confirm(tr[0], yes => {
        if (yes) {
          this.prel.show();
          this.posts.deleteComment(id, res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.commentsTableConfig = { ...this.commentsTableConfig, data: this.commentsTableConfig.data.filter(x => x.id != id) };
              this.getPosts();
            }
          });
        }
      });
    });
  }

  deleteAllComments = () => {
    if(this.openedCommentsPostID){
      this.locale.transGroup([
        'prompts.sure'
      ], tr => {
        this.prompt.confirm(tr[0], yes => {
          if (yes) {
            this.prel.show();
            this.posts.deleteComments(this.openedCommentsPostID, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.commentsTableConfig = { ...this.commentsTableConfig, data: [] };
                this.getPosts();
              }
            });
          }
        });
      });
    }
  }

  exitComments(){
    this.commentsTableConfig = { ...this.commentsTableConfig, data: [] };
    this.openedCommentsPostID = 0;
    this.showComments = false;
  }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(pre: boolean = false) {
    if (pre) {
      this.prel.show();
    }
    this.posts.getPosts(r => {
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

  addNew() {
    this.postEdit.newPost();
  }

  deletePost(id: number) {
    this.locale.transGroup([
      'prompts.sure'
    ], tr => {
      this.prompt.confirm(tr[0], yes => {
        if (yes) {
          this.prel.show();
          this.posts.deletePost(id, res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.getPosts();
            }
          });
        }
      });
    });
  }

  hidePost(id: number, currentVal: "Yes" | "No") {
    this.locale.transGroup([
      'prompts.sure_hide',
      'prompts.no_publish'
    ], tr => {
      if(currentVal == "Yes"){
        this.prompt.confirm(tr[0], yes => {
          if (yes) {
            this.prel.show();
            this.posts.unpublishPost(id, res => {
              this.prel.hide();
              this.note.show(res.err ? "error" : "success", res.message);
              if (!res.err) {
                this.getPosts();
              }
            });
          }
        });
      }
      else{
        this.note.show("error", tr[1]);
      }
    });
  }

  visitPost(slug: string) {
    this.surl.getBase(r => {
      if (r) {
        window.open(`${r}/post/${slug}`, '_blank');
      }
    });
  }
  editPost(id: number) {
    this.postEdit.editPost(id);
  }
}
