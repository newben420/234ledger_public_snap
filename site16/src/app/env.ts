import { AdminModule } from "@shared/db/admin_module";
import { Res, ServerRes } from "@shared/model/res";

export const currentImage: string = import.meta.env["NG_APP_CURRENT_IMG"];
export const currentSlug: string = import.meta.env["NG_APP_CURRENT_SLUG"];
export const postDefaultImage: string = import.meta.env["NG_APP_POST_DEFAULT_IMG"];
export const placeholderImage: string = import.meta.env["NG_APP_POST_PLACEHOLDER_IMG"];
export const Author = {
  name: import.meta.env["NG_APP_AUTHOR_NAME"],
  pic: import.meta.env["NG_APP_AUTHOR_PIC"],
  desc: import.meta.env["NG_APP_AUTHOR_DESC"],
}

export const branding = {
  name: import.meta.env["NG_APP_SITE_BRAND"],
  title: import.meta.env["NG_APP_SITE_TITLE"],
  desc: import.meta.env["NG_APP_SITE_DESCRIPTION"],
  keywords: import.meta.env["NG_APP_SITE_KEYWORDS"],
  seoLocale: import.meta.env["NG_APP_SEO_LOCALE"],
  image: import.meta.env["NG_APP_BANNER"],
  xat: import.meta.env["NG_APP_TWITTER_AT"],
  theme: import.meta.env["NG_APP_THEME_COLOR"],
  favicon: import.meta.env["NG_APP_FAVICON"],
};

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
  var b = dd + "/" + m + " " + hh + ":" + mx + ":" + ss + ' ' + am;
  return b;
}

export const gdtProcess = (ts: string | number) => {
  let x: number = 0;
  if (typeof ts == "string") {
    x = parseInt(ts) || 0;
  }
  else {
    x = ts;
  }
  return getDateTime(x);
}

export const numArraysEqual = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.slice().sort().toString() === arr2.slice().sort().toString();
}


// functions
export type ServerResParamFx = (data: ServerRes) => void;
export type ResParamFx = (data: Res) => void;
export type StrOrNullParamFx = (data: string | null) => void;
export type StrParamFx = (data: string) => void;
export type NumArrParamFx = (data: number[]) => void;
export type BoolParamFx = (data: boolean) => void;
export type StringArrayParamFx = (data: string[]) => void;
export type AdminModuleArrayParamFx = (data: AdminModule[]) => void;

