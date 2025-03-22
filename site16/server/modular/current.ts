import { getDateString } from "@shared/model/date_string";
import { LocalRegex } from "@shared/model/regex";
import { GSRes, ServerRes } from "@shared/model/res";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB } from "server/utility/db";
import { addNoFollow, ArrayParamFx, BoolParamFx, NInteger, ServerResParamFx } from "server/utility/general";
import { Log } from "server/utility/Log";
import { config } from 'dotenv';
config();

export const loadCurrent = (fx: ServerResParamFx) => {
  const ensurePostIsCreated = (f: ServerResParamFx) => {
    let sql = `SELECT * FROM post WHERE is_hap = 1;`;
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        if (result.length == 0) {
          sql = `INSERT INTO post (title, is_hap, last_modified) VALUES('Current', 1, ?);`;
          DB.con().query<ResultSetHeader>(sql, [Date.now()], (err, result) => {
            if (err) {
              Log.dev(err);
              f(GSRes.err("server"));
            }
            else {
              f(GSRes.succ(result.insertId));
            }
          });
        }
        else {
          f(GSRes.succ(result[0]["id"]));
        }
      }
    });
  }

  const getContents = (postID: number, f: ServerResParamFx) => {
    let dt = new Date();
    let date = dt.getDate();
    let mnt = dt.getMonth();
    let year = dt.getFullYear();
    let tdate = new Date(Date.UTC(year, mnt, date));
    let todayTSStartsWith = tdate.getTime();
    let yesterTSStartsWIth = todayTSStartsWith - 86400000;
    let db4YesterTSStartsWIth = yesterTSStartsWIth - 86400000;
    let sql = `
    SELECT * FROM content WHERE last_modified >= ${todayTSStartsWith} AND post_id = ${postID};
    DELETE FROM content WHERE last_modified < ${yesterTSStartsWIth} AND post_id = ${postID};
    DELETE FROM comment WHERE last_modified < ${todayTSStartsWith} AND post_id = ${postID};
    `;
    DB.con().query<ResultSetHeader[] | RowDataPacket[][]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        f(GSRes.succ(result[0] as RowDataPacket[]));
      }
    });
  }

  // flow
  ensurePostIsCreated(r1 => {
    if (!r1.succ) {
      fx(r1);
    }
    else {
      const postID: number = r1.message;
      getContents(postID, r2 => {
        if (!r2.succ) {
          fx(r2);
        }
        else {
          const r: ServerRes = GSRes.succ({
            postID,
            content: r2.message
          });
          fx(r);
        }
      });
    }
  });
}

export const loadCurrentForSite = (fx: ArrayParamFx) => {
  const ensurePostIsCreated = (f: ServerResParamFx) => {
    let sql = `SELECT id FROM post WHERE is_hap = 1;`;
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        if (result.length == 0) {
          f(GSRes.succ(0));
        }
        else {
          f(GSRes.succ(result[0]["id"]));
        }
      }
    });
  }

  const getContents = (postID: number, f: ServerResParamFx) => {
    let dt = new Date();
    let date = dt.getDate();
    let mnt = dt.getMonth();
    let year = dt.getFullYear();
    let tdate = new Date(Date.UTC(year, mnt, date));
    let todayTSStartsWith = tdate.getTime();
    let yesterTSStartsWIth = todayTSStartsWith - 86400000;
    let db4YesterTSStartsWIth = yesterTSStartsWIth - 86400000;
    let sql = `
    SELECT * FROM content WHERE last_modified >= ${todayTSStartsWith} AND post_id = ${postID} AND visibility = 1;
    `;
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        f(GSRes.succ(result));
      }
    });
  }

  // flow
  ensurePostIsCreated(r1 => {
    if (!r1.succ) {
      fx([]);
    }
    else if(r1.message == 0){
      fx([])
    }
    else {
      const postID: number = r1.message;
      getContents(postID, r2 => {
        if (!r2.succ) {
          fx([]);
        }
        else {
          fx(r2.message as any[]);
        }
      });
    }
  });
}

export const loadCurrentForSite2 = (fx: ServerResParamFx) => {
  const ensurePostIsCreated = (f: ServerResParamFx) => {
    let sql = `SELECT id,
    FROM_UNIXTIME(CAST((CAST(last_modified AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as last_modifiedx,
    FROM_UNIXTIME(UNIX_TIMESTAMP(CURRENT_DATE), '%a, %b %e %Y %l:%i %p') as timestamp
    FROM post WHERE is_hap = 1;`;
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        if (result.length == 0) {
          f(GSRes.err("wrong_request"));
        }
        else {
          f(GSRes.succ(result[0]));
        }
      }
    });
  }

  const getContents = (postID: number, f: ServerResParamFx) => {
    let dt = new Date();
    let date = dt.getDate();
    let mnt = dt.getMonth();
    let year = dt.getFullYear();
    let tdate = new Date(Date.UTC(year, mnt, date));
    let todayTSStartsWith = tdate.getTime();
    let yesterTSStartsWIth = todayTSStartsWith - 86400000;
    let db4YesterTSStartsWIth = yesterTSStartsWIth - 86400000;
    let sql = `
    SELECT section_id AS sid, body FROM content WHERE last_modified >= ${todayTSStartsWith} AND post_id = ${postID} AND visibility = 1;
    `;
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        f(GSRes.succ(result));
      }
    });
  }

  // flow
  ensurePostIsCreated(r1 => {
    if (!r1.succ) {
      fx(r1);
    }
    else {
      const post: any = r1.message;
      getContents(post.id, r2 => {
        if (!r2.succ) {
          fx(r2);
        }
        else {
          fx(GSRes.succ({post, content: r2.message}));
        }
      });
    }
  });
}

export const saveCurrentContent = (body: any, fx: ServerResParamFx) => {
  // request validation
  let valid: boolean = NInteger(body.id) && body.content;
  if (valid) {
    const contentBodyMaxLength: number = parseInt(process.env["QUILL_MAXLENGTH"]);

    const checkIfIDisCorrect = (f: ServerResParamFx) => {
      let sql = `SELECT id FROM post WHERE id = ? AND is_hap = 1;`;
      DB.con().query<RowDataPacket[]>(sql, [body.id], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length == 0) {
            f(GSRes.err("wrong_request"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    };

    const validateContent = (f: BoolParamFx) => {
      let totalValid: boolean = true;
      if (body.content ? Array.isArray(body.content) : false) {
        (body.content as any[]).forEach(x => {
          // section id is required
          let sectionIDValid: boolean = x.section_id ? NInteger(x.section_id) : false;
          let bodyValid: boolean = x.body ? x.body.length <= contentBodyMaxLength : false;
          let idValid: boolean = x.id ? NInteger(x.id) : true;
          let postIDValid: boolean = x.id ? (NInteger(x.post_id)) : true;
          let visibilityValid: boolean = x.id ? ([0, 1].indexOf(x.visibility) != -1) : true;
          let lastModifiedValid: boolean = x.id ? (x.last_modified && NInteger(x.last_modified)) : true;

          let valid: boolean = sectionIDValid && bodyValid && idValid && postIDValid && visibilityValid && lastModifiedValid;
          if (!valid) {
            totalValid = false;
          }
        });
        f(totalValid);
      }
      else {
        f(false);
      }
    }

    const saveContent = (f: ServerResParamFx) => {
      let dt = new Date();
      let date = dt.getDate();
      let mnt = dt.getMonth();
      let year = dt.getFullYear();
      let tdate = new Date(Date.UTC(year, mnt, date));
      let todayTSStartsWith = tdate.getTime();
      let content: any[] = (body.content as any[]);
      let sqls: string[] = [];
      let ins: any[] = [];
      let allBeingUsedIds: number[] = []// this field will be used to gather ids and delete contents that have been deleted from the front end
      content.forEach(x => {
        if (x.id) {
          // an edit situation
          let sql = `UPDATE content SET body = ?, visibility = ? WHERE id = ?;`;
          sqls.push(sql);
          ins.push(addNoFollow(x.body));
          ins.push(x.visibility == 1 ? 1 : 0);
          ins.push(x.id);
          allBeingUsedIds.push(x.id);
        }
        else {
          // a new content situation
          let sql = `INSERT INTO content (post_id, section_id, body, visibility, last_modified) VALUES (?, ?, ?, ?, ?);`;
          sqls.push(sql);
          ins.push(body.id);
          ins.push(x.section_id);
          ins.push(addNoFollow(x.body));
          ins.push(x.visibility == 1 ? 1 : 0);
          ins.push(Date.now().toString());
        }
      });
      const continueAfterSave = (result: any) => {
        if (Array.isArray(result)) {
          (result as any[]).forEach(x => {
            if (x.insertId) {
              allBeingUsedIds.push(x.insertId);
            }
          });
        }
        else {
          allBeingUsedIds.push((result as ResultSetHeader).insertId);
        }
        let sql = `DELETE FROM content WHERE post_id = ${body.id} AND last_modified >= ${todayTSStartsWith} ${allBeingUsedIds.length > 0 ? `AND id NOT IN (${allBeingUsedIds.join(", ")})` : ''};`;
        DB.con().query<ResultSetHeader>(sql, (err, rx) => {
          if (err) {
            Log.dev(err);
            f(GSRes.err("server"));
          }
          else {
            let sq = `UPDATE post SET last_modified = ? WHERE id = ? AND is_hap = 1;`;
            DB.con().query(sq, [Date.now(), body.id], (err, result) => {
              if (err) {
                Log.dev(err);
              }
              f(GSRes.succ('translate:default'));
            });
          }
        });
      }
      if (sqls.length > 0) {
        DB.con().query<ResultSetHeader[]>(sqls.join(" "), ins, (err, result) => {
          if (err) {
            Log.dev(err);
            f(GSRes.err("server"));
          }
          else {
            continueAfterSave(result);
          }
        });
      }
      else {
        continueAfterSave([]);
      }
    }

    // flow
    checkIfIDisCorrect(r1 => {
      if (!r1.succ) {
        fx(r1);
      }
      else {
        validateContent(v2 => {
          if (!v2) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            // all fields coming here are valid
            saveContent(r2 => {
              fx(r2);
            });

          }
        });
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const getYesterdaysIDs = (body: any, fx: ServerResParamFx) => {
  if (NInteger(body.id)) {
    let dt = new Date();
    let date = dt.getDate();
    let mnt = dt.getMonth();
    let year = dt.getFullYear();
    let tdate = new Date(Date.UTC(year, mnt, date));
    let todayTSStartsWith = tdate.getTime();
    let yesterTSStartsWIth = todayTSStartsWith - 86400000;
    let sql = `SELECT id FROM content WHERE post_id = ? AND last_modified >= ${yesterTSStartsWIth} AND last_modified < ${todayTSStartsWith};`;
    DB.con().query<RowDataPacket[]>(sql, [body.id], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        fx(GSRes.succ(result.map(x => x["id"]) as number[]));
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const validatePostSlug = (slug: string, fx: ServerResParamFx) => {
  if (slug && LocalRegex.slug.test(slug)) {
    let sql = `SELECT id FROM post WHERE title_slug = ?; SELECT id, title FROM category ORDER BY title ASC;`;
    DB.con().query<RowDataPacket[][]>(sql, [slug], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result[0].length > 0) {
          fx(GSRes.err("slug_taken"));
        }
        else {
          fx(GSRes.succ(result[1]));
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}


export const convertYesterdays = (bd: any, fx: ServerResParamFx) => {
  // request validation
  let valid: boolean = bd.title &&
    bd.slug &&
    bd.category &&
    bd.ids &&
    LocalRegex.title.test(bd.title) &&
    LocalRegex.slug.test(bd.slug) &&
    NInteger(bd.category) &&
    Array.isArray(bd.ids) ? (bd.ids.length > 0) : false;
  if (valid) {
    const checkIfSlugIsTaken = (f: ServerResParamFx) => {
      let sql = `SELECT id FROM post WHERE title_slug = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [bd.slug], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length != 0) {
            f(GSRes.err("slug_taken"));
          }
          else {
            f(GSRes.succ());
          }
        }
      });
    };

    const savePost = (f: ServerResParamFx) => {
      let sql = `INSERT INTO post (category, date_created, last_modified, title, title_slug, is_hap, visibility, ready, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      let ins = [];
      ins.push(bd.category);
      ins.push(getDateString());
      ins.push(Date.now().toString());
      ins.push(bd.title);
      ins.push(bd.slug);
      ins.push(0);
      ins.push(0);
      ins.push(1);
      ins.push("");
      ins.push(null);
      DB.con().query<ResultSetHeader>(sql, ins, (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.insertId) {
            f(GSRes.succ(result.insertId));
          }
          else {
            f(GSRes.err("server"));
          }
        }
      });
    }

    const saveContent = (post_id: number, f: ServerResParamFx) => {
      let sql = `UPDATE content SET post_id = ${post_id} WHERE id IN (${bd.ids.join(", ")})`;
      DB.con().query<ResultSetHeader>(sql, (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.affectedRows == 0) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            f(GSRes.succ('translate:default'));
          }
        }
      });
    }

    // flow
    checkIfSlugIsTaken(r1 => {
      if (!r1.succ) {
        fx(r1);
      }
      else {
        savePost(r2 => {
          if (!r2.succ) {
            fx(r2);
          }
          else {
            saveContent(r2.message, r3 => {
              fx(r3);
            });
          }
        });
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}
