import { createHmac } from 'crypto';
import { GSRes, Res, ServerRes } from "@shared/model/res";
import { sign } from 'jsonwebtoken';
import { Log } from './Log';
import { AdminModule } from '@shared/db/admin_module';
import { config } from "dotenv";
config();

// function types
export type ServerResParamFx = (data: ServerRes) => void;
export type ResParamFx = (data: Res) => void;
export type BoolParamFx = (data: boolean) => void;
export type StringParamFx = (data: string) => void;
export type StringArrayParamFx = (data: string[]) => void;
export type RecordArrayParamFx = (data: Record<string, any>[]) => void;
export type AMArrayParamFx = (data: AdminModule[]) => void;
export type ArrayParamFx = (data: any[]) => void;

// helpers
export const HashPassword = (pw: string, fn: StringParamFx) => {
  const salt: string = process.env["PASS_HASH_SALT"];
  let hash = createHmac('sha256', pw + salt).update(process.env["PASS_HASH_CRYPT"]).digest('hex');
  fn(hash);
}

export const SignToken = (payload: any, user_sec: string, f: ServerResParamFx) => {
  let options: any = {
    algorithm: 'HS256'
  };
  options.expiresIn = Math.ceil(parseInt(process.env["TIME_SESS_EXP_MS"]) / 1000);
  sign(payload, (process.env["PASS_JWT_PREFIX"] + user_sec), options, (err, token) => {
    if (err || !token) {
      Log.dev(err || "ERROR - JWT signing could not produce a token.");
      f(GSRes.err("server"));
    }
    else {
      f(GSRes.succ(token as string));
    }
  });
}

export const cookieExp = () => {
	return (new Date(Number(new Date()) + Number(parseInt(process.env["TIME_COOK_EXP_MS"]))));
}

export const cookieExpSS = () => {
	return (new Date(Number(new Date()) + Number(parseInt(process.env["TIME_COOK_EXP_MS"]) * 365)));
}

// HashPassword("Ralg5555#", (x) => {
//   console.log(x);
// });

export const getDateTime = (ts: number = Date.now()) => {
  var a = new Date(ts);
  var dd = a.getDate();
  var mm = a.getMonth();
  var yyyy = a.getFullYear();
  var hh: any = a.getHours();
  var ss = (a.getSeconds()).toString();
  if (ss.length == 1) {
    ss = "0" + ss;
  }
  var am;
  if (hh > 11) {
    am = "PM";
    if (hh > 12) {
      hh = hh - 12;
    }
  }
  else {
    am = "AM";
    if (hh < 1) {
      hh = 12;
    }
  }

  var mx: any = a.getMinutes();
  if (hh.toString().length == 1) {
    hh = "0" + hh;
  }
  if (mx.toString().length == 1) {
    mx = "0" + mx;
  }
  var m = '' + (mm + 1);
  var b = dd + "/" + m + "/" + yyyy + " " + hh + ":" + mx + ' ' + am;
  return b;
}


export const NInteger = (x: any) => {
  let y = parseInt(x);
  return !Number.isNaN(y);
}

export const addNoFollow = (x: string): string => {
  if(x){
    x = x.replace(/rel="noopener\snoreferrer"/g,`rel="noopener nofollow noreferrer"`).replace(/rel="noreferrer\snoopener"/g,`rel="noreferrer nofollow noopener"`);
  }
  return x;
}
