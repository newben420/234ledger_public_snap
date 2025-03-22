import { GSRes } from "@shared/model/res";
import { config } from "dotenv";
import { DB } from "server/utility/db";
import { ServerResParamFx } from "server/utility/general";
config();

const banned: string[] = (process.env["QUERY_MODULE_BANNED_KEYWORDS"] || "").toString().split(" ").filter((x: string) => x.length > 0);
let bannedPattern = new RegExp(`${banned.join("|")}`, 'i');

export const performQuery = (query: string, fx: ServerResParamFx) => {
  if(query){
    if(bannedPattern.test(query)){
      fx(GSRes.err(`banned`));
    }
    else{
      DB.con().query(query, (err, result) => {
        if(err){
          fx(GSRes.succ(err.toString()));
        }
        else{
          fx(GSRes.succ(JSON.stringify(result, null, '\t')));
        }
      });
    }
  }
  else{
    fx(GSRes.err("wrong_request"));
  }
}
