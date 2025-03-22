import { NInteger, ServerResParamFx } from "server/utility/general";
import { format, subDays, subMonths } from "date-fns";
import { DB } from "server/utility/db";
import { RowDataPacket } from "mysql2";
import { GSRes } from "@shared/model/res";
import { Log } from "server/utility/Log";
import { Request } from "express";
import { countryCodes } from "@shared/model/location";
import { getDateString } from "@shared/model/date_string";
import { config } from 'dotenv';
config();

const maxItem: number = parseInt(process.env["STATS_MAX_ITEM"] || 5);

export const getStats = (fx: ServerResParamFx) => {
  let date: string[] = format(new Date(), 'yyyy-MM-dd').split("-");
  let ydate: string[] = format(subDays(new Date(), 1), 'yyyy-MM-dd').split("-");
  let lmdate: string[] = format(subMonths(new Date(), 1), 'yyyy-MM-dd').split("-");
  let day = date[2];
  let month = date[1];
  let year = date[0];
  let todayPat: string = `${year}-${month}-${day}`;
  let yesterPat: string = `${year}-${month}-${ydate[2]}`;
  let tmonthPat: string = `${year}-${month}-__`;
  let lmonthPat: string = `${year}-${lmdate[1]}-__`;
  let tyearPat = `${year}-__-__`;
  // 12 sql statements for each data
  // visits - today
  // visits - yesterdy
  // visits - this month
  // visits - last month
  // visits - this year
  // visits - total
  // location with most vists - this month
  // location with most vists - total
  // most visited posts - today
  // most visited posts - yesterday
  // most visited posts - this month
  // most visited posts - total
  let sql = `
  SELECT COUNT(id) AS l FROM visitor WHERE dat LIKE '${todayPat}';
  SELECT COUNT(id) AS l FROM visitor WHERE dat LIKE '${yesterPat}';
  SELECT COUNT(id) AS l FROM visitor WHERE dat LIKE '${tmonthPat}';
  SELECT COUNT(id) AS l FROM visitor WHERE dat LIKE '${lmonthPat}';
  SELECT COUNT(id) AS l FROM visitor WHERE dat LIKE '${tyearPat}';
  SELECT COUNT(id) AS l FROM visitor;
  SELECT loc AS label, COUNT(id) AS data FROM visitor WHERE dat LIKE '${tmonthPat}' GROUP BY loc ORDER BY data DESC LIMIT ${maxItem};
  SELECT loc AS label, COUNT(id) AS data FROM visitor GROUP BY loc ORDER BY data DESC LIMIT ${maxItem};
  SELECT (SELECT title FROM post WHERE post.id = post_analytics.post_id) as label, COUNT(post_analytics.id) AS data FROM post_analytics WHERE post_analytics.dat LIKE '${todayPat}' GROUP BY post_analytics.post_id ORDER BY data DESC LIMIT ${maxItem};
  SELECT (SELECT title FROM post WHERE post.id = post_analytics.post_id) as label, COUNT(post_analytics.id) AS data FROM post_analytics WHERE post_analytics.dat LIKE '${yesterPat}' GROUP BY post_analytics.post_id ORDER BY data DESC LIMIT ${maxItem};
  SELECT (SELECT title FROM post WHERE post.id = post_analytics.post_id) as label, COUNT(post_analytics.id) AS data FROM post_analytics WHERE post_analytics.dat LIKE '${tmonthPat}' GROUP BY post_analytics.post_id ORDER BY data DESC LIMIT ${maxItem};
  SELECT (SELECT title FROM post WHERE post.id = post_analytics.post_id) as label, COUNT(post_analytics.id) AS data FROM post_analytics GROUP BY post_analytics.post_id ORDER BY data DESC LIMIT ${maxItem};
  `;
  DB.con().query<RowDataPacket[][]>(sql, (err, result) => {
    if (err) {
      Log.dev(err);
      fx(GSRes.err("server"));
    }
    else {
      // console.log(result);
      fx(GSRes.succ(result));
    }
  });
}

export const savePostAnalytics = (req: Request, fx: ServerResParamFx) => {
  let bd = req.body;
  let a = ((req.headers["cf-ipcountry"] || "T1") as string).toUpperCase();
  if (a ? (countryCodes.indexOf(a) != -1) : false) {
    bd.loc = a;
  }
  let valid: boolean = (bd.loc ? (countryCodes.indexOf(bd.loc) != -1) : false) && (bd.pid ? NInteger(bd.pid) : false);
  if (valid) {
    // checks
    let ds = getDateString();
    let sql = `SELECT id FROM post WHERE id = ?; SELECT id FROM post_analytics WHERE ip = ? AND dat = ? AND post_id = ?;`;
    DB.con().query<RowDataPacket[][]>(sql, [bd.pid, req.headers["cf-connecting-ip"] || req.headers["cf-connecting-ipv6"] || req.ip, ds, bd.pid], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result[0].length == 1 && result[1].length == 0) {
          sql = `INSERT INTO post_analytics (dat, post_id, loc, ip) VALUES (?, ?, ?, ?);`;
          DB.con().query(sql, [ds, bd.pid, bd.loc, req.headers["cf-connecting-ip"] || req.headers["cf-connecting-ipv6"] || req.ip], (err, result) => {
            if (err) {
              Log.dev(err);
              fx(GSRes.err("server"));
            }
            else {
              fx(GSRes.succ('translate:default'));
            }
          });
        }
        else {
          fx(GSRes.err("wrong_request"));
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}

export const saveVisits = (req: Request, fx: ServerResParamFx) => {
  let bd: any = req.body;
  let a = ((req.headers["cf-ipcountry"] || "T1") as string).toUpperCase();
  if (a ? (countryCodes.indexOf(a) != -1) : false) {
    bd.loc = a;
  }
  let valid: boolean = (bd.loc ? (countryCodes.indexOf(bd.loc) != -1) : false);
  if (valid) {
    // checks
    let ds = getDateString();
    let sql = `SELECT id  FROM visitor WHERE ip = ? AND dat = ? AND loc = ?;`;
    DB.con().query<RowDataPacket[]>(sql, [req.headers["cf-connecting-ip"] || req.headers["cf-connecting-ipv6"] || req.ip, ds, bd.loc], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if (result.length == 0) {
          sql = `INSERT INTO visitor (ip, dat, loc) VALUES (?, ?, ?);`;
          DB.con().query(sql, [req.headers["cf-connecting-ip"] || req.headers["cf-connecting-ipv6"] || req.ip, ds, bd.loc], (err, result) => {
            if (err) {
              Log.dev(err);
              fx(GSRes.err("server"));
            }
            else {
              fx(GSRes.succ('translate:default'));
            }
          });
        }
        else {
          fx(GSRes.err("wrong_request"));
        }
      }
    });
  }
  else {
    fx(GSRes.err("wrong_request"));
  }
}
