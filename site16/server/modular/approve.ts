import { GSRes } from "@shared/model/res";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { DB } from "server/utility/db";
import { ServerResParamFx } from "server/utility/general";
import { Log } from "server/utility/Log";
import { config } from 'dotenv';
config();

export const getPostsForApproval = (fx: ServerResParamFx) => {
  let sql = `SELECT post.id AS id, post.title AS title, (SELECT category.title FROM category WHERE category.id = post.category) AS category, FROM_UNIXTIME(CAST((CAST(post.last_modified AS INT) / 1000) AS INT), '%Y-%m-%e %l:%i %p') as last_modifiedx FROM post WHERE post.visibility = 0 AND post.is_hap = 0 AND post.ready = 1 ORDER BY post.last_modified DESC;`;
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

export const getPostContents = (id: number, fx: ServerResParamFx) => {
  if (id) {
    let sql = `SELECT post.description AS description, (SELECT image.link FROM image WHERE image.id = post.image) AS image FROM post WHERE id = ?;
    SELECT content.body AS body, (SELECT section.title FROM section WHERE section.id = content.section_id) AS section FROM content WHERE content.post_id = ? ORDER BY content.id ASC;
    `;
    DB.con().query<RowDataPacket[][]>(sql, [id, id], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result[0].length != 1) {
          fx(GSRes.err("wrong_request"));
        }
        else {
          fx(GSRes.succ({
            post: result[0][0],
            content: result[1],
          }));
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const approvePost = (id: number, fx: ServerResParamFx) => {
  if (id) {
    let sql = `UPDATE post SET visibility = 1 WHERE id = ? AND visibility = 0 AND is_hap = 0 AND ready = 1;`;
    DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result.affectedRows != 1) {
          fx(GSRes.err("wrong_request"));
        }
        else {
          fx(GSRes.succ('translate:default'));
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const getCommentsForApproval = (fx: ServerResParamFx) => {
  let sql = `SELECT id, CONCAT(commenter, ' <<', contact, '>> ', comment) AS comment FROM comment WHERE visibility = 0 ORDER BY last_modified DESC;`;
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

export const approveComment = (id: number, fx: ServerResParamFx) => {
  if (id) {
    let sql = `UPDATE comment SET visibility = 1 WHERE id = ? AND visibility = 0;`;
    DB.con().query<ResultSetHeader>(sql, [id], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result.affectedRows != 1) {
          fx(GSRes.err("wrong_request"));
        }
        else {
          fx(GSRes.succ('translate:default'));
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}
