import { getDateString } from '@shared/model/date_string';
import { Content } from '@shared/db/content';
import { addNoFollow, ArrayParamFx, BoolParamFx, NInteger, ResParamFx, ServerResParamFx } from "server/utility/general";
import * as path from "path";
import { existsSync, unlink } from "fs";
import { Log, prod } from "server/utility/Log";
import { DB, mode } from "server/utility/db";
import { config } from "dotenv";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { GSRes } from "@shared/model/res";
import { rootPath } from "server";
import { LocalRegex } from "@shared/model/regex";
import { loadCurrent, loadCurrentForSite, loadCurrentForSite2 } from './current';

// import { initializeApp } from "firebase-admin/app";

// const firebaseUse: boolean = process.env["FIREBASE_USE"] == "yes";
const firebaseUse: boolean = false;

// if(firebaseUse){
//   initializeApp();
// }

config();

export const deleteUploadedFile = (filename: string) => {
  let pth = path.join(rootPath, `uploads/${filename}`);
  if (existsSync(pth)) {
    unlink(pth, (err) => {
      if (err) {
        Log.dev(err);
      }
    });
  }
}

export const getImages = (fx: ServerResParamFx) => {
  let sql = `SELECT id, title, link FROM image ORDER BY last_modified DESC;`;
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

export const processFileUpload = (pth: string, title: string, fx: ServerResParamFx) => {
  let fileSavedURL: string = "";
  const afterFileSaved = () => {
    let sql = `INSERT INTO image (link, last_modified, title) VALUES (?, ?, ?)`;
    DB.con().query<ResultSetHeader>(sql, [fileSavedURL, Date.now().toString(), title], (err, result) => {
      if (err) {
        Log.dev(err);
        deleteUploadedFile(path.basename(pth));
        fx(GSRes.err("server"));
      }
      else {
        fx(GSRes.succ("translate:default"));
      }
    });
  }
  if (firebaseUse) {
    // automatically bypassed
  }
  else {
    fileSavedURL = `${process.env[`NG_APP_SITE_URL_${mode}`]}/uploads/${path.basename(pth)}`;
    afterFileSaved();
    // processImage(newHeight, pth, r => {
    //   if(r.succ){
    //     fileSavedURL = `${process.env[`NG_APP_SITE_URL_${mode}`]}/uploads/${path.basename(r.message)}`;
    //     afterFileSaved();
    //   }
    //   else{
    //     deleteUploadedFile(path.basename(pth));
    //     fx(r);
    //   }
    // });
  }
}

export const editImageTitle = (title: string, id: number, fx: ServerResParamFx) => {
  if (title && LocalRegex.title.test(title)) {
    const save = (f: ServerResParamFx) => {
      let sql = `UPDATE image SET title = ?, last_modified = ? WHERE id = ?;`;
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


    save(r2 => {
      fx(r2);
    });

  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}


export const deleteImage = (id: number, fx: ServerResParamFx) => {
  let sql = `SELECT link FROM image WHERE id = ?`;
  DB.con().query<RowDataPacket[]>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      if (result.length == 0) {
        fx(GSRes.err("wrong_request"));
      }
      else {
        deleteUploadedFile(path.basename(result[0]["link"]));
        sql = `DELETE FROM image WHERE id = ?;`;
        DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
          if (err) {
            Log.dev(err);
            fx(GSRes.err("server"));
          }
          else {
            if (result.affectedRows == 0) {
              fx(GSRes.err("wrong_request"));
            }
            else {
              fx(GSRes.succ("translate:default"));
            }
          }
        });
      }
    }
  });
}

export const getPostById = (id: number, fx: ServerResParamFx) => {
  if (id) {
    let sql = `SELECT * FROM post WHERE id = ? AND is_hap = 0;`;
    DB.con().query<RowDataPacket[]>(sql, [id], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result.length != 1) {
          fx(GSRes.err("wrong_request"));
        }
        else {
          sql = `SELECT * FROM content WHERE post_id = ?`;
          DB.con().query<RowDataPacket[]>(sql, [result[0]["id"]], (err, result2) => {
            if (err) {
              Log.dev(err);
              fx(GSRes.err("server"));
            }
            else {
              fx(GSRes.succ({
                post: result[0],
                content: result2
              }));
            }
          });
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const getPosts = (fx: ServerResParamFx) => {
  let sql = `SELECT post.id AS id, post.title AS title, post.title_slug AS title_slug, post.date_created as date_created, FROM_UNIXTIME(CAST((CAST(post.last_modified AS INT) / 1000) AS INT), '%Y-%m-%e %l:%i %p') as last_modifiedx, CASE WHEN post.visibility = 1 THEN 'Yes' ELSE 'No' END AS visibility, (SELECT COUNT(id) FROM comment WHERE comment.post_id = post.id AND comment.visibility = 1) AS comments FROM post WHERE NOT is_hap = 1 ORDER BY date_created DESC, last_modified DESC;`;
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

export const getComments = (id: number, fx: ServerResParamFx) => {
  let sql = `SELECT id, CONCAT(commenter, ' <<', contact, '>> ', comment) AS comment, FROM_UNIXTIME(CAST((CAST(last_modified AS INT) / 1000) AS INT), '%Y-%m-%e %l:%i %p') as last_modifiedx FROM comment WHERE post_id = ? AND visibility = 1 ORDER BY last_modified DESC;`;
  DB.con().query<RowDataPacket[]>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      fx(GSRes.succ(result));
    }
  });
}

export const savePost = (body: any, fx: ServerResParamFx) => {
  // request validation
  let valid: boolean = body.post ? (body.post.title && body.post.title_slug && body.post.category && LocalRegex.title.test(body.post.title) && LocalRegex.slug.test(body.post.title_slug) && NInteger(body.post.category)) : false;
  if (valid) {
    const contentBodyMaxLength: number = parseInt(process.env["QUILL_MAXLENGTH"]);

    const validateOptionalMetaFields = (f: BoolParamFx) => {
      let idValid: boolean = body.post.id ? NInteger(body.post.id) : true;
      let dateCreatedValid: boolean = body.post.id ? (body.post.date_created && LocalRegex.dateCreated.test(body.post.date_created)) : true;
      let lastModifiedValid: boolean = body.post.id ? (body.post.last_modified && NInteger(body.post.last_modified)) : true;
      let isHapValid: boolean = body.post.is_hap != 1;
      let visibilityValid: boolean = body.post.id ? (NInteger(body.post.visibility)) : true;
      let readyValid: boolean = body.post.id ? (NInteger(body.post.ready)) : true;
      let descriptionValid: boolean = body.post.description ? body.post.description.toString().length <= 255 : true;
      let imageValid: boolean = body.post.image ? NInteger(body.post.image) : true;
      // console.log(`${idValid} ${dateCreatedValid} ${lastModifiedValid} ${isHapValid} ${visibilityValid} ${readyValid} ${descriptionValid} ${imageValid}`)
      f(idValid && dateCreatedValid && lastModifiedValid && isHapValid && visibilityValid && readyValid && descriptionValid && imageValid);
    }

    const checkIfSlugIsTaken = (f: ServerResParamFx) => {
      if (body.post.title_slug == process.env["NG_APP_CURRENT_SLUG"]) {
        f(GSRes.err("slug_taken"));
      }
      else {
        let sql = `SELECT id FROM post WHERE title_slug = ? ${body.post.id ? 'AND NOT id = ?' : ''};`;
        let ins = [body.post.title_slug];
        if (body.post.id) {
          ins.push(body.post.id);
        }
        DB.con().query<RowDataPacket[]>(sql, ins, (err, result) => {
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
      }
    };

    const validateContent = (f: BoolParamFx) => {
      let isDraft: boolean = body.draft;
      let totalValid: boolean = true;
      if (body.content ? Array.isArray(body.content) : false) {
        (body.content as any[]).forEach(x => {
          // section id is required
          let sectionIDValid: boolean = x.section_id ? NInteger(x.section_id) : false;
          let bodyValid: boolean = x.body ? x.body.length <= contentBodyMaxLength : isDraft;
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

    const savePost = (f: ServerResParamFx) => {
      let post: any = body.post;
      if (post.id) {
        // edit situation
        let sql = `UPDATE post SET category = ? , last_modified = ? , title = ? , title_slug = ? , visibility = ? , ready = ? , description = ? , image = ? WHERE id = ?;`;
        let ins = [];
        ins.push(post.category);
        ins.push(Date.now().toString());
        ins.push(post.title);
        ins.push(post.title_slug);
        if (body.draft) {
          ins.push(0);
        }
        else if (process.env["BYPASS_APPROVE_ON_POST_EDIT"] == "yes") {
          ins.push(1);
        }
        else {
          ins.push((process.env["AUTO_APPROVE_POST"] == "yes") ? 1 : 0);
        }
        ins.push(body.draft ? 0 : 1);
        ins.push(post.description || "");
        ins.push(post.image || null);
        ins.push(post.id);
        DB.con().query<ResultSetHeader>(sql, ins, (err, result) => {
          if (err) {
            Log.dev(err);
            f(GSRes.err("server"));
          }
          else {
            if (result.affectedRows == 1) {
              f(GSRes.succ(post.id));
            }
            else {
              f(GSRes.err("server"));
            }
          }
        });
      }
      else {
        // new post situation
        let sql = `INSERT INTO post (category, date_created, last_modified, title, title_slug, is_hap, visibility, ready, description, image, creation_ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
        let ins = [];
        ins.push(post.category);
        ins.push(getDateString());
        ins.push(Date.now().toString());
        ins.push(post.title);
        ins.push(post.title_slug);
        ins.push(0);
        if (body.draft) {
          ins.push(0);
        }
        else {
          ins.push((process.env["AUTO_APPROVE_POST"] == "yes") ? 1 : 0);
        }
        ins.push(body.draft ? 0 : 1);
        ins.push(post.description || "");
        ins.push(post.image || null);
        ins.push(Date.now());
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
    }

    const saveContent = (post_id: number, f: ServerResParamFx) => {
      let content: any[] = (body.content as any[]);
      let isDraft: boolean = body.draft;
      let sqls: string[] = [];
      let ins: any[] = [];
      let allBeingUsedIds: number[] = []// this field will be used to gather ids and delete contents that have been deleted from the front end
      if (content.length == 0) {
        f(GSRes.succ('translate:default'));
      }
      else {
        content.forEach(x => {
          if (x.id) {
            // an edit situation
            let sql = `UPDATE content SET body = ?, visibility = ?, last_modified = ? WHERE id = ?;`;
            sqls.push(sql);
            ins.push(addNoFollow(x.body));
            ins.push(x.visibility == 1 ? 1 : 0);
            ins.push(Date.now().toString());
            ins.push(x.id);
            allBeingUsedIds.push(x.id);
          }
          else {
            // a new content situation
            let sql = `INSERT INTO content (post_id, section_id, body, visibility, last_modified) VALUES (?, ?, ?, ?, ?);`;
            sqls.push(sql);
            ins.push(post_id);
            ins.push(x.section_id);
            ins.push(addNoFollow(x.body));
            ins.push(x.visibility == 1 ? 1 : 0);
            ins.push(Date.now().toString());
          }
        });
        DB.con().query<ResultSetHeader[]>(sqls.join(" "), ins, (err, result) => {
          if (err) {
            Log.dev(err);
            f(GSRes.err("server"));
          }
          else {
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
            let sql = `DELETE FROM content WHERE post_id = ${post_id} AND id NOT IN (${allBeingUsedIds.join(", ")});`;
            DB.con().query(sql, (err, result) => {
              if (err) {
                Log.dev(err);
                f(GSRes.err("server"));
              }
              else {
                f(GSRes.succ('translate:default'));
              }
            });
          }
        });
      }
    }

    // flow
    checkIfSlugIsTaken(r1 => {
      if (!r1.succ) {
        fx(r1);
      }
      else {
        validateOptionalMetaFields(v1 => {
          if (!v1) {
            fx(GSRes.err("wrong_request"));
          }
          else {
            validateContent(v2 => {
              if (!v2) {
                fx(GSRes.err("wrong_request"));
              }
              else {
                // all fields coming here are valid
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
        });
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}


export const unpublishPost = (id: number, fx: ServerResParamFx) => {
  if (id) {
    const save = (f: ServerResParamFx) => {
      let sql = `UPDATE post SET visibility = 0, last_modified = ? WHERE id = ? AND visibility = 1;`;
      DB.con().query<ResultSetHeader>(sql, [Date.now().toString(), id], (err, result) => {
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
    save(r2 => {
      fx(r2);
    });

  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}


export const deletePost = (id: number, fx: ServerResParamFx) => {
  let sql = `SELECT id FROM post WHERE id = ?`;
  DB.con().query<RowDataPacket[]>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      if (result.length == 0) {
        fx(GSRes.err("wrong_request"));
      }
      else {
        let id: number = result[0]["id"];
        sql = `DELETE FROM content WHERE post_id = ?; DELETE FROM post_analytics WHERE post_id = ?; DELETE FROM post WHERE id = ?;`;
        DB.con().query<ResultSetHeader[]>(sql, [id, id, id], (err, result) => {
          if (err) {
            Log.dev(err);
            fx(GSRes.err("server"));
          }
          else {
            if (result[2].affectedRows == 0) {
              fx(GSRes.err("wrong_request"));
            }
            else {
              fx(GSRes.succ("translate:default"));
            }
          }
        });
      }
    }
  });
}

export const deleteComment = (id: number, fx: ServerResParamFx) => {
  let sql = `DELETE FROM comment WHERE id = ?;`
  DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      if (result.affectedRows == 0) {
        fx(GSRes.err("wrong_request"));
      }
      else {
        fx(GSRes.succ("translate:default"));
      }
    }
  });
}

export const deleteComments = (id: number, fx: ServerResParamFx) => {
  let sql = `DELETE FROM comment WHERE post_id = ?;`
  DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      if (result.affectedRows == 0) {
        fx(GSRes.err("wrong_request"));
      }
      else {
        fx(GSRes.succ("translate:default"));
      }
    }
  });
}

export const homeInit = (fx: ServerResParamFx) => {
  let sendback: Record<string, any> = {};
  const getToday = (f: Function) => {
    loadCurrentForSite(r => {
      sendback["current"] = r.length > 0;
      if (r.length > 0) {
        sendback["timestamp"] = Date.now();
      }
      f();
    });
  }

  const getRecentPosts = (f: ServerResParamFx) => {
    const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
    let sql = `SELECT
    post.title_slug as slug,
    post.title as title,
    FROM_UNIXTIME(CAST((CAST(creation_ts AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp,
    (SELECT image.link FROM image WHERE image.id = post.image) AS image,
    (SELECT image.title FROM image WHERE image.id = post.image) AS image_title
    FROM post WHERE is_hap = 0 AND visibility = 1 ORDER BY creation_ts DESC LIMIT ${limit}`;
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        f(GSRes.err("server"));
      }
      else {
        f(GSRes.succ(result as any[]));
      }
    });
  }

  // flow
  getToday(() => {
    getRecentPosts(r => {
      if (!r.succ) {
        fx(r);
      }
      else {
        sendback["posts"] = r.message;
        fx(GSRes.succ(sendback));
      }
    });
  });
}

export const homeMore = (index: any, fx: ServerResParamFx) => {
  if (NInteger(index) ? (parseInt(index) >= 0) : false) {
    const getRecentPosts = (f: ServerResParamFx) => {
      const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
      let sql = `SELECT
    post.title_slug as slug,
    post.title as title,
    FROM_UNIXTIME(CAST((CAST(creation_ts AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp,
    (SELECT image.link FROM image WHERE image.id = post.image) AS image,
    (SELECT image.title FROM image WHERE image.id = post.image) AS image_title
    FROM post WHERE is_hap = 0 AND visibility = 1 ORDER BY creation_ts DESC LIMIT ${limit} OFFSET ${parseInt(index) * limit}`;
      DB.con().query<RowDataPacket[]>(sql, (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          f(GSRes.succ(result as any[]));
        }
      });
    }

    // flow
    getRecentPosts(r => {
      fx(r);
    });
  }
  else {
    fx(GSRes.succ([]));
  }
}

export const loadByCategory = (category: any, index: any, fx: ServerResParamFx) => {
  if ((NInteger(index) ? (parseInt(index) >= 0) : false) && (NInteger(category) ? (parseInt(category) >= 1) : false)) {
    const getRecentPosts = (f: ServerResParamFx) => {
      const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
      let sql = `SELECT
    post.title_slug as slug,
    post.title as title,
    FROM_UNIXTIME(CAST((CAST(creation_ts AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp,
    (SELECT image.link FROM image WHERE image.id = post.image) AS image,
    (SELECT image.title FROM image WHERE image.id = post.image) AS image_title
    FROM post WHERE is_hap = 0 AND visibility = 1 AND category = ? ORDER BY creation_ts DESC LIMIT ${limit} OFFSET ${parseInt(index) * limit}`;
      DB.con().query<RowDataPacket[]>(sql, [category], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          f(GSRes.succ(result as any[]));
        }
      });
    }

    // flow
    getRecentPosts(r => {
      fx(r);
    });
  }
  else {
    fx(GSRes.succ([]));
  }
}

export const loadBySection = (section: any, index: any, fx: ServerResParamFx) => {
  if ((NInteger(index) ? (parseInt(index) >= 0) : false) && (NInteger(section) ? (parseInt(section) >= 1) : false)) {
    const getRecentPosts = (f: ServerResParamFx) => {
      const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
      let sql = `
      SELECT
      p.title as title,
      p.title_slug as slug,
      FROM_UNIXTIME(CAST((CAST(p.creation_ts AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp,
      (SELECT i.link FROM image i WHERE i.id = p.image) AS image,
      (SELECT i.title FROM image i WHERE i.id = p.image) AS image_title
      FROM post p INNER JOIN content c ON p.id = c.post_id
      WHERE c.section_id = ? AND p.is_hap = 0 AND p.visibility = 1
      GROUP BY p.id
      ORDER BY p.creation_ts  DESC LIMIT ${limit} OFFSET ${parseInt(index) * limit};
      `;
      DB.con().query<RowDataPacket[]>(sql, [section], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          f(GSRes.succ(result as any[]));
        }
      });
    }

    // flow
    getRecentPosts(r => {
      fx(r);
    });
  }
  else {
    fx(GSRes.succ([]));
  }
}

export const loadPost = (slug: string, fx: ServerResParamFx) => {
  let section: number = 0;
  const processCurrent = () => {
    loadCurrentForSite2(r => {
      if(r.succ){
        let post = {
          id: r.message.post.id,
          timestamp: r.message.post.timestamp,
          last_modified: r.message.post.last_modifiedx,
          title: process.env["NG_APP_CURRENT_TITLE"],
          descr: process.env["NG_APP_CURRENT_DESC"],
          vis: 1,
          slug: process.env["NG_APP_CURRENT_SLUG"],
          image: process.env["NG_APP_CURRENT_IMG"],
          image_title: process.env["NG_APP_CURRENT_TITLE"],
        }
        fx(GSRes.succ({post, content: r.message.content, rel: []}));
      }
      else{
        fx(r);
      }
    });
  }

  const processNonCurrent = () => {
    const getPost = (f: ServerResParamFx) => {
      let sql = `SELECT
      p.id AS id,
      p.category as cat,
      FROM_UNIXTIME(CAST((CAST(p.creation_ts AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp,
      FROM_UNIXTIME(CAST((CAST(p.last_modified AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as last_modified,
      p.title as title,
      p.title_slug as slug,
      p.description as descr,
      (SELECT category.title FROM category WHERE p.category = category.id) AS cat_title,
      (SELECT category.title_slug FROM category WHERE p.category = category.id) AS cat_slug,
      p.visibility as vis,
      (SELECT image.link FROM image WHERE image.id = p.image) AS image,
      (SELECT image.title FROM image WHERE image.id = p.image) AS image_title
      FROM post p
      WHERE p.is_hap = 0 AND p.title_slug = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [slug], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length != 1) {
            f(GSRes.err("wrong_request"));
          }
          else {
            let post = result[0] as any;
            if (post.vis != 1) {
              f(GSRes.err("not_published"));
            }
            else {
              f(GSRes.succ(post));
            }
          }
        }
      });
    }
    const getContent = (pid: number, f: ServerResParamFx) => {
      let sql = `
      SELECT
      section_id AS sid,
      body
      FROM content
      WHERE post_id = ? AND visibility = 1 ${section > 0 ? ` AND section_id = ${section} ` : ''}
      ORDER BY last_modified DESC;
      `;
      DB.con().query<RowDataPacket[]>(sql, [pid], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          if (result.length == 0) {
            f(GSRes.err("not_published"));
          }
          else {
            f(GSRes.succ(result));
          }
        }
      });
    }
    const getRelatedPosts = (cat: number, id: number, f: ArrayParamFx) => {
      const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
      let sql = `
      SELECT
      p.title AS title,
      p.title_slug as slug,
      FROM_UNIXTIME(CAST((CAST(p.creation_ts AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp
      FROM post p
      WHERE p.is_hap = 0 AND p.visibility = 1 AND p.category = ? AND NOT p.id = ?
      ORDER BY p.creation_ts DESC
      LIMIT ${limit};
      `;
      DB.con().query<RowDataPacket[]>(sql, [cat, id], (err, result) => {
        if (err) {
          Log.dev(err);
          f([]);
        }
        else {
          f(result as any[]);
        }
      });
    }

    // flow
    getPost(r1 => {
      let sendback: any = {};
      if (!r1.succ) {
        fx(r1);
      }
      else {
        let post: any = r1.message;
        sendback.post = post;
        getContent(post.id, r2 => {
          if (!r2.succ) {
            fx(r2);
          }
          else {
            sendback.content = r2.message
            getRelatedPosts(post.cat, post.id, r3 => {
              sendback.rel = r3;
              fx(GSRes.succ(sendback));
            });
          }
        });
      }
    });
  }

  if (slug && LocalRegex.slugSection.test(slug)) {
    if (/\.[\d]+$/.test(slug)) {
      section = parseInt(slug.split(".")[1]);
      slug = slug.replace(/\.[\d]+$/, "");
    }
    if (slug == process.env["NG_APP_CURRENT_SLUG"]) {
      processCurrent();
    }
    else {
      processNonCurrent();
    }
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}


export const loadPostComment = (postID: any, index: any, fx: ServerResParamFx) => {
  if ((NInteger(index) ? (parseInt(index) >= 0) : false) && (NInteger(postID) ? (parseInt(postID) >= 1) : false)) {
    const getRecentComments = (f: ServerResParamFx) => {
      const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
      let sql = `
      SELECT
      commenter as maker,
      comment as stuff,
      FROM_UNIXTIME(CAST((CAST(last_modified AS INT) / 1000) AS INT), '%a, %b %e %Y %l:%i %p') as timestamp
      FROM comment
      WHERE post_id = ? AND visibility = 1
      ORDER BY last_modified DESC
      LIMIT ${limit} OFFSET ${parseInt(index) * limit};
      `;
      DB.con().query<RowDataPacket[]>(sql, [postID], (err, result) => {
        if (err) {
          Log.dev(err);
          f(GSRes.err("server"));
        }
        else {
          f(GSRes.succ(result as any[]));
        }
      });
    }

    // flow
    getRecentComments(r => {
      fx(r);
    });
  }
  else {
    fx(GSRes.succ([]));
  }
}

export const makeComment = (bd: any, fx: ServerResParamFx) => {
  let pidVal: boolean = bd.pid ? NInteger(bd.pid) : false;
  let comVal: boolean = bd.comment ? bd.comment.trim().length <= 255 : false;
  let conVal: boolean = bd.contact ? (LocalRegex.email.test(bd.contact.trim()) && bd.contact.trim().length <= 100) : false;
  let namVal: boolean = bd.name ? LocalRegex.commentName.test(bd.name.trim()) : true;
  if (comVal && conVal && namVal && pidVal) {
    let sql = `INSERT INTO comment (post_id, visibility, commenter, contact, comment, last_modified) VALUES(?, ?, ?, ?, ?, ?);`;
    let ins = [];
    ins.push(bd.pid);
    ins.push(0);
    ins.push(bd.name || "");
    ins.push(bd.contact);
    ins.push(bd.comment.replace(/[\n]{2,}/g, "\n").replace(/[\t]/g, " ").replace(/[\s]{2,}/g, " "));
    ins.push(Date.now());
    DB.con().query(sql, ins, (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        fx(GSRes.succ('translate:comment'));
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const searchPosts = (key: any, fx: ServerResParamFx) => {
  if(key && LocalRegex.search.test(key)){
    const limit = parseInt(process.env["LOAD_POST_LIMIT"]);
    let keys: string[] = key.split("+");
    let sql = `
      SELECT title, title_slug as slug, 'post' as type FROM post WHERE title RLIKE '${keys.join('|')}' AND visibility = 1 AND is_hap = 0 ORDER BY creation_ts DESC, last_modified DESC LIMIT ${limit};
    `;
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
  else{
    fx(GSRes.err("wrong_request"));
  }
}
