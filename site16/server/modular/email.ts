import { NInteger, ServerResParamFx } from "server/utility/general";
import { emailFreqs } from "@shared/model/email_frequency"
import { GSRes } from "@shared/model/res";
import { DB } from "server/utility/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Log } from "server/utility/Log";
import { LocalRegex } from "@shared/model/regex";
import { config } from 'dotenv';
config();

export const loadEmailComponent = (fx: ServerResParamFx) => {
  let frq = emailFreqs.map(x => x);
  if(frq.length == 0){
    fx(GSRes.err("no_freq"));
  }
  else{
    let sqls: string[] = [];
    let response: any = {};
    frq.forEach(x => {
      let sql = `SELECT COUNT(id) as l FROM email WHERE freq = ${x.id};`;
      sqls.push(sql);
    });
    DB.con().query<RowDataPacket[][]>(sqls.join(" "), (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else {
        if(frq.length == 1){
          response[frq[0].title] = (result[0] as RowDataPacket)["l"];
        }
        else{
          frq.forEach((x, i) => {
            response[x.title] = result[i][0]["l"];
          });
        }
      }
      fx(GSRes.succ(response));
    });
  }
}

export const downloadSubs = (freq: string, fx: ServerResParamFx) => {
  if(freq){
    let frq = emailFreqs.filter(x => x.title.toLowerCase() ==  freq.toLowerCase());
    if(frq.length != 1){
      fx(GSRes.err("wrong_request"));
    }
    else{
      let freqId: number = frq[0].id;
      let sql = `SELECT address, FROM_UNIXTIME(CAST((CAST(last_modified AS INT) / 1000) AS INT), '%Y-%m-%e %l:%i %p') as reg_timestamp FROM email WHERE freq = ${freqId} ORDER BY last_modified DESC;`;
      DB.con().query<RowDataPacket[]>(sql, (err, result) => {
        if (err) {
          Log.dev(err);
          fx(GSRes.err("server"));
        }
        else{
          if(result.length == 0){
            fx(GSRes.err("wrong_request"));
          }
          else{
            fx(GSRes.succ(result));
          }
        }
      });
    }
  }
  else{
    fx(GSRes.err("wrong_request"));
  }
}


export const deleteSubs = (freq: string, fx: ServerResParamFx) => {
  if(freq){
    let frq = emailFreqs.filter(x => x.title.toLowerCase() ==  freq.toLowerCase());
    if(frq.length != 1){
      fx(GSRes.err("wrong_request"));
    }
    else{
      let freqId: number = frq[0].id;
      let sql = `DELETE FROM email WHERE freq = ${freqId};`;
      DB.con().query<ResultSetHeader>(sql, (err, result) => {
        if (err) {
          Log.dev(err);
          fx(GSRes.err("server"));
        }
        else{
          if(result.affectedRows == 0){
            fx(GSRes.err("server"));
          }
          else{
            fx(GSRes.succ('translate:default'));
          }
        }
      });
    }
  }
  else{
    fx(GSRes.err("wrong_request"));
  }
}

export const submitEmail = (bd: any, fx: ServerResParamFx) => {
  if(NInteger(bd.freq) && emailFreqs.filter(x => x.id == bd.freq).length > 0 && (bd.email ? LocalRegex.email.test(bd.email) : false)){
    let sql = `SELECT id FROM email WHERE address = ?;`
    DB.con().query<RowDataPacket[]>(sql, [bd.email], (err, result) => {
      if (err) {
        Log.dev(err);
        fx(GSRes.err("server"));
      }
      else{
        if(result.length > 0){
          fx(GSRes.succ('translate:email'));
        }
        else{
          sql = `INSERT INTO email (address, freq, last_modified) VALUES (?, ?, ?);`;
          DB.con().query<ResultSetHeader>(sql, [bd.email, bd.freq, Date.now()], (err, result) => {
            if (err) {
              Log.dev(err);
              fx(GSRes.err("server"));
            }
            else{
              fx(GSRes.succ('translate:email'));
            }
          });
        }
      }
    });
  }
  else{
    fx(GSRes.err("wrong_request"));
  }
}
