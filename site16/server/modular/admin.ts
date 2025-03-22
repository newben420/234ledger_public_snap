import { Admin } from '@shared/db/admin';
import { LocalRegex } from '@shared/model/regex';
import { GSRes } from "@shared/model/res";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB } from "server/utility/db";
import { getDateTime, HashPassword, ServerResParamFx } from "server/utility/general";
import { Log } from "server/utility/Log";
import { UUIDHelper } from 'server/utility/uuid';
import { JSONSafeParse } from '@shared/json_safe_parse';
import { config } from 'dotenv';
config();

export const getAccounts = (fx: ServerResParamFx) => {
  let sql = `SELECT id, username, last_logged_in, last_modified, read_only, modules FROM admin ORDER BY last_modified DESC;`;
  DB.con().query<RowDataPacket[]>(sql, (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      fx(GSRes.succ((result as any[]).map(x => {
        return {
          username: x.username,
          read_only: x.read_only == 1 ? "True" : "False",
          last_logged_in: x.last_logged_in ? getDateTime(parseInt(x.last_logged_in) || 0) : "",
          last_modified: x.last_modified ? getDateTime(parseInt(x.last_modified) || 0) : "",
          modules: JSONSafeParse(x.modules, true),
          // TODO: convert epoch to date times, and let them be empty strings if not available
        } as any;
      })));
    }
  });
}

export const newAccount = (un: string, pw: string, fx: ServerResParamFx) => {
  if (un && pw && LocalRegex.username.test(un) && LocalRegex.password.test(pw)) {
    let sql = `SELECT * FROM admin WHERE username = ?`;
    DB.con().query<RowDataPacket[]>(sql, [un], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result.length > 0) {
          fx(GSRes.err("un_taken"));
        }
        else {
          HashPassword(pw, hash => {
            let sql = `INSERT INTO admin (username, password, last_logged_in, last_modified, modules, read_only, jwt) VALUES (?, ?, ?, ?, ?, ?, ?);`;
            let jwt = UUIDHelper.generate();
            let ins = [];
            ins.push(un);
            ins.push(hash);
            ins.push("");
            ins.push(Date.now().toString());
            ins.push("[]");
            ins.push(0);
            ins.push(jwt);
            DB.con().query(sql, ins, (err, result) => {
              if (err) {
                Log.dev(err);
                fx(GSRes.err("server"));
              }
              else {
                fx(GSRes.succ("translate:new_account"));
              }
            });
          });
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const updateReadOnly = (username: string, v: 0 | 1, i: string, fx: ServerResParamFx) => {
  if (username && i && LocalRegex.username.test(i) && [0, 1].indexOf(v) != -1) {
    if (username == i) {
      fx(GSRes.err("no_read_only"));
    }
    else {
      let sql = `UPDATE admin SET read_only = ?, last_modified = ? WHERE username = ?;`;
      DB.con().query(sql, [v, Date.now(), i], (err, result) => {
        if (err) {
          Log.dev(err);
          fx(GSRes.err("server"));
        }
        else {
          fx(GSRes.succ("translate:default"));
        }
      });
    }
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const deleteAccount = (username: string, i: string, fx: ServerResParamFx) => {
  if (username && i && LocalRegex.username.test(i)) {
    if (username == i) {
      fx(GSRes.err("no_delete_account"));
    }
    else {
      let sql = `DELETE FROM admin WHERE username = ?;`;
      DB.con().query(sql, [i], (err, result) => {
        if (err) {
          Log.dev(err);
          fx(GSRes.err("server"));
        }
        else {
          fx(GSRes.succ("translate:default"));
        }
      });
    }
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const getAllModules = (fx: ServerResParamFx) => {
  let sql = `SELECT * FROM admin_module ORDER BY slug ASC;`;
  DB.con().query<RowDataPacket[]>(sql, (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      fx(GSRes.succ(result));
    }
  });
}

export const updateRoles = (username: string, roles: number[], fx: ServerResParamFx) => {
  if (username && roles && LocalRegex.username.test(username)) {
    let sql = `UPDATE admin SET modules = ?, last_modified = ? WHERE username = ?;`;
    DB.con().query(sql, [JSON.stringify(roles), Date.now(), username], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        fx(GSRes.succ("translate:default"));
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const getCategories = (fx: ServerResParamFx) => {
  let sql = `SELECT category.id as id, category.title AS title, category.title_slug AS title_slug, (SELECT COUNT(id) FROM post WHERE post.category = category.id) AS post_count FROM category ORDER by title ASC;`;
  DB.con().query<RowDataPacket[]>(sql, (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      fx(GSRes.succ(result));
    }
  });
}

export const getCategories2 = (fx: ServerResParamFx) => {
  let sql = `SELECT category.id as id, category.title AS title, category.title_slug AS title_slug, (SELECT COUNT(id) FROM post WHERE post.category = category.id AND post.visibility = 1) AS post_count FROM category ORDER by title ASC;`;
  DB.con().query<RowDataPacket[]>(sql, (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      fx(GSRes.succ(result));
    }
  });
}

export const getSections = (fx: ServerResParamFx) => {
  let sql = `SELECT id, title, title_slug FROM section ORDER BY title ASC;`;
  DB.con().query<RowDataPacket[]>(sql, (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      fx(GSRes.succ(result));
    }
  });
}

export const editTitle = (title: string, id: number, fx: ServerResParamFx) => {
  if (title && LocalRegex.title.test(title)) {
    const validate = (f: ServerResParamFx) => {
      let sql = `SELECT title FROM category WHERE title = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [title], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length > 0) {
            f(GSRes.err("title_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    }

    const save = (f: ServerResParamFx) => {
      let sql = `UPDATE category SET title = ?, last_modified = ? WHERE id = ?;`;
      DB.con().query<ResultSetHeader>(sql, [title, Date.now().toString(), id], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.affectedRows == 0) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            f(GSRes.succ("translate:default"));
          }
        }
      });
    }

    validate(r1 => {
      if (r1.succ) {
        save(r2 => {
          fx(r2);
        });
      }
      else {
        fx(r1);
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const editSlug = (slug: string, id: number, fx: ServerResParamFx) => {
  if (slug && LocalRegex.slug.test(slug)) {
    const validate = (f: ServerResParamFx) => {
      let sql = `SELECT title FROM category WHERE title_slug = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [slug], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length > 0) {
            f(GSRes.err("slug_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    }

    const save = (f: ServerResParamFx) => {
      let sql = `UPDATE category SET title_slug = ?, last_modified = ? WHERE id = ?;`;
      DB.con().query<ResultSetHeader>(sql, [slug, Date.now().toString(), id], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.affectedRows == 0) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            f(GSRes.succ("translate:default"));
          }
        }
      });
    }

    validate(r1 => {
      if (r1.succ) {
        save(r2 => {
          fx(r2);
        });
      }
      else {
        fx(r1);
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const deleteCategory = (id: number, fx: ServerResParamFx) => {
  let sql = `DELETE FROM category WHERE id = ?;`;
  DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      if(result.affectedRows == 0){
        fx(GSRes.err("wrong_request"));
      }
      else{
        fx(GSRes.succ("translate:default"));
      }
    }
  });
}

export const addCategory = (title: string, slug: string, fx: ServerResParamFx) => {
  if (title && slug && LocalRegex.title.test(title) && LocalRegex.slug.test(slug)) {
    const validate = (f: ServerResParamFx) => {
      let sql = `SELECT title FROM category WHERE title = ?; SELECT title FROM category WHERE title_slug = ?;`;
      DB.con().query<RowDataPacket[][]>(sql, [title, slug], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result[0].length > 0) {
            f(GSRes.err("title_taken"));
          }
          else if (result[1].length > 0) {
            f(GSRes.err("slug_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    }

    const save = (f: ServerResParamFx) => {
      let sql = `INSERT INTO category (title, title_slug, last_modified) VALUES (?, ?, ?);`;
      DB.con().query<ResultSetHeader>(sql, [title, slug, Date.now().toString()], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          f(GSRes.succ("translate:default"));
        }
      });
    }

    validate(r1 => {
      if (r1.succ) {
        save(r2 => {
          fx(r2);
        });
      }
      else {
        fx(r1);
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}


export const editTitleSection = (title: string, id: number, fx: ServerResParamFx) => {
  if (title && LocalRegex.title.test(title)) {
    const validate = (f: ServerResParamFx) => {
      let sql = `SELECT title FROM section WHERE title = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [title], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length > 0) {
            f(GSRes.err("title_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    }

    const save = (f: ServerResParamFx) => {
      let sql = `UPDATE section SET title = ?, last_modified = ? WHERE id = ?;`;
      DB.con().query<ResultSetHeader>(sql, [title, Date.now().toString(), id], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.affectedRows == 0) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            f(GSRes.succ("translate:default"));
          }
        }
      });
    }

    validate(r1 => {
      if (r1.succ) {
        save(r2 => {
          fx(r2);
        });
      }
      else {
        fx(r1);
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const editSlugSection = (slug: string, id: number, fx: ServerResParamFx) => {
  if (slug && LocalRegex.slug.test(slug)) {
    const validate = (f: ServerResParamFx) => {
      let sql = `SELECT title FROM section WHERE title_slug = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [slug], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length > 0) {
            f(GSRes.err("slug_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    }

    const save = (f: ServerResParamFx) => {
      let sql = `UPDATE section SET title_slug = ?, last_modified = ? WHERE id = ?;`;
      DB.con().query<ResultSetHeader>(sql, [slug, Date.now().toString(), id], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.affectedRows == 0) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            f(GSRes.succ("translate:default"));
          }
        }
      });
    }

    validate(r1 => {
      if (r1.succ) {
        save(r2 => {
          fx(r2);
        });
      }
      else {
        fx(r1);
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const deleteSection = (id: number, fx: ServerResParamFx) => {
  let sql = `DELETE FROM section WHERE id = ?;`;
  DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      if(result.affectedRows == 0){
        fx(GSRes.err("wrong_request"));
      }
      else{
        fx(GSRes.succ("translate:default"));
      }
    }
  });
}

export const addSection = (title: string, slug: string, fx: ServerResParamFx) => {
  if (title && slug && LocalRegex.title.test(title) && LocalRegex.slug.test(slug)) {
    const validate = (f: ServerResParamFx) => {
      let sql = `SELECT title FROM section WHERE title = ?; SELECT title FROM section WHERE title_slug = ?;`;
      DB.con().query<RowDataPacket[][]>(sql, [title, slug], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result[0].length > 0) {
            f(GSRes.err("title_taken"));
          }
          else if (result[1].length > 0) {
            f(GSRes.err("slug_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    }

    const save = (f: ServerResParamFx) => {
      let sql = `INSERT INTO section (title, title_slug, last_modified) VALUES (?, ?, ?);`;
      DB.con().query<ResultSetHeader>(sql, [title, slug, Date.now().toString()], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          f(GSRes.succ("translate:default"));
        }
      });
    }

    validate(r1 => {
      if (r1.succ) {
        save(r2 => {
          fx(r2);
        });
      }
      else {
        fx(r1);
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}
