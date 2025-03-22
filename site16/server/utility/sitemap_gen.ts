import { Request, Response } from "express";
import { config } from 'dotenv';
import { getDateString } from "@shared/model/date_string";
import { DB } from "./db";
import { RowDataPacket } from "mysql2";
import { Log } from "./Log";
config();

const base = process.env[`NG_APP_SITE_URL_${process.env["MODE"]}`];
const staticDate = "2024-11-20";

const cf = {
  a: "always",
  h: "hourly",
  d: "daily",
  w: "weekly",
  m: "monthly",
  y: "yealy",
  n: "never"
}

const p = {
  home: "1.0",
  article: "0.9",
  static: "0.7",
  low: "0.5"
}

const sitemapPre: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${getDateString()}</lastmod>
    <changefreq>${cf.h}</changefreq>
    <priority>${p.home}</priority>
  </url>
  `;

const sitemapPost: string = `
  <url>
    <loc>${base}/about</loc>
    <lastmod>${staticDate}</lastmod>
    <changefreq>${cf.w}</changefreq>
    <priority>${p.static}</priority>
  </url>
  <url>
    <loc>${base}/terms-of-use</loc>
    <lastmod>${staticDate}</lastmod>
    <changefreq>${cf.m}</changefreq>
    <priority>${p.low}</priority>
  </url>
  <url>
    <loc>${base}/privacy-policy</loc>
    <lastmod>${staticDate}</lastmod>
    <changefreq>${cf.m}</changefreq>
    <priority>${p.low}</priority>
  </url>
</urlset>
`;

const makeURL = (loc: string, lastmod: string, changefreq: string, priority: string): string => {
  return `
  <url>
    <loc>${base}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
  `;
}

export const generateSitemap = (req: Request, res: Response) => {
  res.contentType("application/xml");
  let urls: string[] = [];
  // for happening today
  urls.push(makeURL(`/post/${process.env["NG_APP_CURRENT_SLUG"]}`, getDateString(), cf.h, p.article));
  const fetchContent = (f: Function) => {
    const limit = process.env["SITEMAP_CONTENT_LIMIT"];
    let sql = `
    SELECT title_slug, last_modified FROM post WHERE visibility = 1 AND is_hap = 0 ORDER BY creation_ts DESC, last_modified DESC LIMIT ${limit};
    SELECT title_slug, last_modified FROM category ORDER BY last_modified DESC LIMIT ${limit};
    SELECT title_slug, last_modified FROM section ORDER BY last_modified DESC LIMIT ${limit};
    `;
    DB.con().query<RowDataPacket[][]>(sql, (err, result) => {
      if(err){
        Log.dev(err);
      }
      else{
        result[0].forEach(x => {
          urls.push(makeURL(`/post/${x["title_slug"]}`, getDateString(parseInt(x["last_modified"])), cf.h, p.article));
        });
        result[1].forEach(x => {
          urls.push(makeURL(`/category/${x["title_slug"]}`, getDateString(parseInt(x["last_modified"])), cf.h, p.article));
        });
        result[2].forEach(x => {
          urls.push(makeURL(`/section/${x["title_slug"]}`, getDateString(parseInt(x["last_modified"])), cf.h, p.article));
        });
      }
      f();
    });
  }
  fetchContent(() => {
    res.send(sitemapPre + (urls.join("\n")) + sitemapPost);
  });
}
