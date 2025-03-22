import { Login } from "@shared/model/login";
import { cookieExp, HashPassword, ServerResParamFx, SignToken } from "./general";
import { DB } from "./db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Log } from "./Log";
import { GSRes } from "@shared/model/res";
import { Request, Response } from "express";
import { cookieOpts } from "server/routes/api";
import { LocalRegex } from "@shared/model/regex";
import { JwtPayload, verify, VerifyOptions } from "jsonwebtoken";
import { AdminModules } from "./admin_modules";
import { UUIDHelper } from "./uuid";
import { config } from "dotenv";
config();

export const pref: string = "a";

export const AdminLogin = (login: Login, f: ServerResParamFx) => {
  // vars
  let ts: number = Date.now();
  let table: string = "admin";
  let admin: any = {};

  // functions
  const fetchAndValidate = (fs: ServerResParamFx) => {
    HashPassword(login.password, hash => {
      login.password = hash;
      let sql = `SELECT * FROM ${table} WHERE username = ? AND password = ?;`;
      DB.con().query<RowDataPacket[]>(sql, [login.username, login.password], (err, result) => {
        if (err) {
          Log.dev(err);
          fs(GSRes.err("server"));
        }
        else {
          if (result.length != 1) {
            fs(GSRes.err('wrong_username_password'));
          }
          else {
            admin = result[0];
            fs(GSRes.succ());
          }
        }
      });
    });
  }
  const updateLastLoggedIn = (fs: Function) => {
    let sql = `UPDATE ${table} SET last_logged_in = ? WHERE id = ?;`;
    DB.con().query(sql, [ts, admin.id], (err, result) => {
      if (err) {
        Log.dev(err);
      }
      fs();
    });
  }
  const signJWT = (fs: ServerResParamFx) => {
    let payload: any = {};
    payload.sub = admin.username;
    payload.iat = Math.ceil(Date.now() / 1000);
    payload.iss = process.env["PASS_JWT_ISS"];
    SignToken(payload, admin.jwt, (s_res) => {
      fs(s_res);
    });
  }

  // flow
  fetchAndValidate(r1 => {
    if (!r1.succ) {
      f(r1);
    }
    else {
      updateLastLoggedIn(() => {
        signJWT(r2 => {
          if (!r2.succ) {
            f(r2);
          }
          else {
            let fr = GSRes.succ({ username: admin.username, token: r2.message });
            f(fr);
          }
        });
      });
    }
  });
}

export const AdminLogout = (req: Request, res: Response, fx: Function) => {
  // set cookie in the past
  let cookOpts = cookieOpts();
  cookOpts.expires = new Date(Number(new Date()) - Number(process.env["TIME_COOK_EXP_MS"]));
  res.clearCookie(pref);
  res.clearCookie(pref + "_legacy");
  res.clearCookie((pref + "_jwt"));
  res.clearCookie((pref + "_jwt_legacy"));
  fx();
};

export const saveJWTToCookie = (res: Response, id: string, token: string, fx: Function) => {
  let cookOpts = cookieOpts();
  const exp = cookieExp();
  cookOpts.expires = exp;
  res.cookie(pref, id, cookOpts);
  res.cookie(pref + "_jwt", token, cookOpts);
  // for legacy support
  let cop_opts = cookieOpts();
  delete cop_opts.sameSite;
  cop_opts.expires = exp;
  // set legacy cookies here
  res.cookie(pref + "_legacy", id, cop_opts);
  res.cookie(pref + "_jwt_legacy", token, cop_opts);
  fx();
};

export const getJWTFromCookie = (req: Request, fx: ServerResParamFx) => {
  let u = req.signedCookies[pref];
  let jwt = req.signedCookies[(pref + "_jwt")];
  // for legacy.. to support older browsers
  let ul = req.signedCookies[pref + "_legacy"];
  let jwtl = req.signedCookies[(pref + "_jwt_legacy")];
  // console.log(`cookies => ${u} ${jwt} ${ul} ${jwtl}`)
  if (u && jwt && LocalRegex.username.test(u)) {
    fx(GSRes.succ({ u: u, jwt: jwt }));
  }
  else if (ul && jwtl && LocalRegex.username.test(ul)) {
    fx(GSRes.succ({ u: ul, jwt: jwtl }));
  }
  else {
    // Log.dev('get jwt from cookie failed');
    fx(GSRes.err('access_denied'));
  }

};

export const Verify = (token: string, id: string, fn: ServerResParamFx) => {
  let ts = Date.now();
  if (LocalRegex.username.test(id)) {
    let table = "admin";
    let admin: any = {};
    let getSecret = (fx: ServerResParamFx) => {
      var sql = `SELECT * FROM ${table} WHERE username = ? ;`;
      DB.con().query<RowDataPacket[]>(sql, [id], (err, result) => {
        if (err) {
          Log.dev(err);
          fx(GSRes.err("server"));
        }
        else {
          if (result.length != 1) {
            fx(GSRes.err('access_denied'));
          }
          else {
            AdminModules.jsonToModules(result[0]["modules"], mods => {
              admin = result[0];
              admin.modules = mods;
              fx(GSRes.succ());
            });
          }
        }
      });
    }
    // flow
    getSecret((sec_res) => {
      if (!sec_res.succ) {
        fn(sec_res);
      }
      else {
        let secret = process.env["PASS_JWT_PREFIX"] + admin.jwt;
        let options: VerifyOptions = {
          algorithms: ["HS256", "HS384"],
          issuer: process.env["PASS_JWT_ISS"],
          ignoreExpiration: false,
          subject: id,
          clockTolerance: 120,
          maxAge: (process.env["TIME_SESS_EXP_MS"] || "0") + "ms",
          clockTimestamp: Math.ceil(Date.now() / 1000),
        }
        verify(token, secret, options, (error, payload) => {
          if (error) {
            Log.dev(error);
            fn(GSRes.err('access_denied'));
            return;
          }
          else {
            if (payload) {
              try {
                if ((payload as JwtPayload).exp) {
                  // check if token is almost expiring and issue a new one
                  let exp = ((payload as JwtPayload).exp || 0) * 1000;
                  if (exp - Date.now() < parseInt(process.env["TIME_JWT_TTE_MS"])) {
                    // renew an almost expiring jwt
                    let curr_iat = ((payload as JwtPayload).iat || 0) + 0;
                    let curr_exp = exp + 0;
                    let pl = (payload as JwtPayload);
                    delete pl.exp;
                    pl.iat = Date.now();
                    SignToken(pl, admin.jwt, (s_res) => {
                      // ignore error messages here since incoming jwt is already verified
                      pl.iat = curr_iat;
                      pl.exp = curr_exp;
                      let rxxc = GSRes.succ({ payload: pl, admin: admin })
                      if (s_res.succ) {
                        rxxc.message.newToken = s_res.message;
                      }
                      fn(rxxc);
                      return;
                    });
                  }
                  else {
                    fn(GSRes.succ({ payload: payload, admin: admin }));
                    return;
                  }
                }
                else {
                  fn(GSRes.succ({ payload: payload, admin: admin }));
                  return;
                }
              } catch (error) {
                Log.dev(error);
                fn(GSRes.err("server"));
              }
            }
            else {
              Log.dev("JWT Verify payload not defined.");
              fn(GSRes.err("server"));
            }

          }
        });
      }
    });
  }
  else {
    Log.dev('Verify val failed');
    fn(GSRes.err('access_denied'));
  }
};

export const logOutOfOtherDevices = (req: Request, res: Response, fx: ServerResParamFx) => {
  let cooks: any = {};
  let us: any = {};
  let table = "admin";
  let n_jwt: string = "eefwrwerwtwetrtewtwte"; //random placeholder string in case if help.u4 ever fails
  let saveNewJWT = (fn: ServerResParamFx) => {
    let sql = `UPDATE ${table} SET jwt = ? WHERE username = ? `;
    DB.con().query(sql, [n_jwt, us.username], (err, result) => {
      if (err) {
        Log.dev(err);
        fn(GSRes.err("server"));
      }
      else {
        if ((result as ResultSetHeader).affectedRows != 1) {
          fn(GSRes.err('access_denied'));
        }
        else {
          fn(GSRes.succ());
        }
      }
    });
  };
  // flow
  getJWTFromCookie(req, (g_res) => {
    if (!g_res.succ) {
      fx(g_res);
    }
    else {
      cooks = g_res.message;
      // now we have user cookies, lets verify
      Verify(cooks.jwt, cooks.u, (v_res) => {
        if (!v_res.succ) {
          fx(v_res);
        }
        else {
          us = v_res.message.admin;
          // now generate new uid
          let new_jwt = UUIDHelper.generate();
          n_jwt = new_jwt;
          saveNewJWT((s_res) => {
            if (!s_res.succ) {
              fx(s_res);
            }
            else {
              // now sign new payload and save to cookie
              let payload: any = {};
              payload.sub = us["username"];
              payload.iat = Math.ceil(Date.now() / 1000);
              payload.iss = process.env["PASS_JWT_ISS"];
              SignToken(payload, n_jwt, (sx_res) => {
                if (!sx_res.succ) {
                  fx(sx_res);
                }
                else {
                  // now save new payload to cookie
                  saveJWTToCookie(res, us["username"], sx_res.message, () => {
                    fx(GSRes.succ('translate:logout_others'));
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};


export const changePassword = (username: string, dbCurrentPassword: string, userCurrentPassword: string, newPassword: string, fx: ServerResParamFx) => {
  if(userCurrentPassword && newPassword && LocalRegex.password.test(userCurrentPassword) && LocalRegex.password.test(newPassword)){
    HashPassword(userCurrentPassword, hash => {
      if(hash === dbCurrentPassword){
        HashPassword(newPassword, newHash => {
          if(newHash === hash){
            fx(GSRes.succ("translate:password"));
          }
          else{
            let sql = `UPDATE admin SET password = ?, last_modified = ? WHERE username = ?;`;
            DB.con().query<ResultSetHeader>(sql, [newHash, Date.now(), username], (err, result) => {
              if (err) {
                Log.dev(err);
                fx(GSRes.err("server"));
              }
              else{
                fx(GSRes.succ("translate:password"));
              }
            });
          }
        });
      }
      else{
        fx(GSRes.err("wrong_curr_pass"));
      }
    });
  }
  else{
    fx(GSRes.err("wrong_request"));
  }
}
