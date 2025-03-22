import { Router } from "express";
import { adminRoute } from "./admin/admin";
import { Log, prod } from "../utility/Log";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { GSRes } from "@shared/model/res";
import { mode } from "server/utility/db";
import * as cors from "cors";
import { config } from "dotenv";
import { siteRoute } from "./site/site";
import { cookieExp, cookieExpSS } from "server/utility/general";
import { ThemeColors } from '@shared/model/colors';

const colors = ThemeColors.monochrome;

config();

declare global {
  namespace Express {
    interface Request {
      lextra?: any;
    }
  }
}

export const cookieOpts = (): any => {
  return {
    httpOnly: true,
    secure: prod ? true : false,
    sameSite: 'none',
    // maxAge: Math.ceil(parseInt(process.env["TIME_SESS_EXP_MS"]) / 1000),
    signed: true
  } as any;
};

export const cookieOptsSS = (): any => {
  return {
    httpOnly: true,
    secure: prod ? true : false,
    sameSite: 'strict',
    // maxAge: Math.ceil(parseInt(process.env["TIME_SESS_EXP_MS"]) / 1000),
    signed: true
  } as any;
};

export const apiRoute = Router();

apiRoute.use(cookieParser(process.env["PASS_COOK_SECRET"], cookieOpts()));

apiRoute.use(bodyParser.urlencoded({ extended: true }));


apiRoute.use(bodyParser.json());

apiRoute.use((req, res, next) => {
  req.lextra = {};
  next();
});

apiRoute.post("/theme", (req, res) => {
  if (req.body.theme ? ["light", "dark"].indexOf(req.body.theme) != -1 : false) {
    let cookOpts = cookieOptsSS();
    const exp = cookieExpSS();
    cookOpts.expires = exp;
    res.cookie("theme", req.body.theme, cookOpts);
    // for legacy support
    let cop_opts = cookieOpts();
    delete cop_opts.sameSite;
    cop_opts.expires = exp;
    // set legacy cookies here
    res.cookie("theme_legacy", req.body.theme, cop_opts);
    res.json(GSRes.succ())
  }
  else{
    res.sendStatus(404);
  }
});



apiRoute.get("/theme", (req, res) => {
  let u = req.signedCookies["theme"] || req.signedCookies["theme_legacy"] || "light";
  res.contentType("text/css");
  if(u){
    let text: string[] = [];
    let isDark: boolean = u == "dark";
    (isDark ? colors.map(x => x).reverse() : colors).forEach((color, index) => {
      const className1 = `.thx-${index} {color: ${color};}`;
      const className2 = `.thx-bg-${index} {background: ${color};}`;
      text.push(`${className1} ${className2}`);
    });
    res.send(text.join(" "));
  }
  else{
    res.send("");
  }
});

apiRoute.use("/admin", adminRoute);

apiRoute.use("/site", siteRoute);


apiRoute.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  res.send("Resource not found.");
});

apiRoute.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  Log.dev(err);
  res.status(500);
  res.send("A server error ws encountered.");
});
