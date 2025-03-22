import { Component } from '@angular/core';
import { TableConfig } from '@shared/model/table_config';
import { NoteService } from '../../../services/note.service';
import { AccountsService } from '../../../services/accounts.service';
import { PreloaderService } from '../../../services/preloader.service';
import { PromptService } from '../../../shared/prompt/prompt.service';
import { LocaleService } from '../../../services/locale.service';
import { LocalRegex } from '@shared/model/regex';
import { RoleManagerService } from './role-manager/role-manager.service';
import { numArraysEqual } from '../../../env';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  constructor(private role: RoleManagerService, private note: NoteService, private locale: LocaleService, private accounts: AccountsService, private prel: PreloaderService, private prompt: PromptService) { }

  ngOnInit() {
    this.getAccounts();
  }

  updateReadOnly(newVal: 0 | 1, username: string) {
    this.locale.transGroup(['prompts.sure'], r => {
      this.prompt.confirm(r[0], yes => {
        if (yes) {
          this.prel.show();
          this.accounts.updateReadOnly(newVal, r => {
            this.prel.hide();
            this.note.show(r.err ? "error" : "success", r.message);
            if (!r.err) {
              this.getAccounts();
            }
          }, username);
        }
      });
    });
  }

  getAccounts(pre: boolean = false) {
    if (pre) {
      this.prel.show();
    }
    this.accounts.getAccounts(r => {
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

  // id, username, last_logged_in, last_modified, read_only
  tableConfig: TableConfig = {
    data: [],
    itemsPerPage: 10,
    editableColumns: ['read_only'],
    editFunction: (index: number, column: string, currentValue: string) => {
      if (column == 'read_only') {
        if (currentValue == 'True') {
          this.updateReadOnly(0, this.tableConfig.data[index].username);
        } else if (currentValue == 'False') {
          this.updateReadOnly(1, this.tableConfig.data[index].username);
        }
      }
    },
    emptyMessage: 'table.no_admin',
    filters: [
      {
        column: 'last_logged_in',
        relationship: 'eq',
        title: 'table.never_logged_in',
        value: "",
      }
    ],
    addNew: () => {
      this.addNew();
    },
    actions: [
      {
        icon: 'bi bi-trash-fill',
        callback: (username: string) => {
          this.deleteAccount(username);
        },
        title: 'table.delete',
        column: 'username',
        btnClass: 'btn btn-danger btn-sm'
      },
      {
        icon: 'bi bi-person-fill-gear',
        callback: (username: string) => {
          this.manageRoles(username);
        },
        title: 'table.manage_roles',
        column: 'username',
        btnClass: 'btn btn-success btn-sm'
      }
    ],
    labels: [
      {
        column: 'username',
        name: 'table.username',
      },
      {
        column: 'read_only',
        name: 'table.read_only',
      },
      {
        column: 'last_logged_in',
        name: 'table.last_logged_in',
      },
      {
        column: 'last_modified',
        name: 'table.last_modified',
      }
    ]
  }

  addNew() {
    this.locale.transGroup([
      "admin.new_username",
      "admin.new_username_ins",
      "admin.new_pass",
      "admin.new_pass_ins",
      "server_responses.errors.un_taken",
      "admin.confirm_pass",
      "admin.confirm_pass_ins",
    ], tr => {
      this.prompt.input({
        inputType: 'text',
        title: tr[0],
        cancelButton: false,
        closeButton: true,
        instr: tr[1],
        minlength: 4,
        maxlength: 30,
        pattern: LocalRegex.username,
        required: true,
        callback: (un: string) => {
          let allUsernames: string[] = this.tableConfig.data.map(x => x.username);
          if (allUsernames.indexOf(un) != -1) {
            this.addNew();
            this.note.show("error", tr[4]);
          }
          else {
            // ask for password
            this.prompt.input({
              inputType: 'password',
              title: tr[2],
              cancelButton: false,
              closeButton: true,
              instr: tr[3],
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
                  title: tr[5],
                  cancelButton: false,
                  closeButton: true,
                  instr: tr[6],
                  minlength: 8,
                  maxlength: 100,
                  pattern: regex,
                  required: true,
                  callback: (cpw: string) => {
                    this.prel.show();
                    this.accounts.newAccount(un, pw, r => {
                      this.prel.hide();
                      this.note.show(r.err ? "error" : "success", r.message);
                      if (!r.err) {
                        this.getAccounts();
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    });
  }

  deleteAccount(username: string) {
    this.locale.transGroup(["prompts.sure"], r => {
      this.note.confirm(r[0], yes => {
        if (yes) {
          this.prel.show();
          this.accounts.deleteAccount(username, res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.getAccounts();
            }
          });
        }
      });
    });
  }

  manageRoles(username: string) {
    let modules: number[] = this.tableConfig.data.filter(x =>
      x.username == username
    )[0].modules;
    this.role.manageRole({
      username: username,
      userModules: modules.map(x => x),
      callback: r => {
        if (numArraysEqual(r, modules)) {
          this.locale.trans("prompts.no_change", r => {
            this.note.show("success", r.message);
          });
        }
        else {
          this.prel.show();
          this.accounts.updateAccountRoles(username, r, res => {
            this.prel.hide();
            this.note.show(res.err ? "error" : "success", res.message);
            if (!res.err) {
              this.getAccounts();
            }
          });
        }
      },
    });
  }
}
