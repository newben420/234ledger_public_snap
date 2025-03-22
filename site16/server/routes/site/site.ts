import { Router } from "express";
import { getCategories2, getSections } from "server/modular/admin";
import { submitEmail } from "server/modular/email";
import { homeInit, homeMore, loadByCategory, loadBySection, loadPost, loadPostComment, makeComment, searchPosts } from "server/modular/post";
import { savePostAnalytics, saveVisits } from "server/modular/stats";
import * as cors from "cors";
import { config } from 'dotenv';
import { mode } from "server/utility/db";
config();

export const siteRoute = Router();

siteRoute.use(cors({
  origin: process.env[`NG_APP_SITE_URL_${mode}`],
  optionsSuccessStatus: 200,
  credentials: true,
}));

siteRoute.get("/categories", (req, res) => {
  getCategories2(r => {
    res.json(r);
  });
});

siteRoute.get("/sections", (req, res) => {
  getSections(r => {
    res.json(r);
  });
});

siteRoute.post("/news", (req, res) => {
  submitEmail(req.body, r => {
    res.json(r);
  });
});

siteRoute.get("/home/init", (req, res) => {
  homeInit(r => {
    res.json(r);
  });
});

siteRoute.get("/home/more/:i", (req, res) => {
  homeMore(req.params.i, r => {
    res.json(r);
  });
});

siteRoute.get("/category/:c/:i", (req, res) => {
  loadByCategory(req.params.c, req.params.i, r => {
    res.json(r);
  });
});

siteRoute.get("/section/:s/:i", (req, res) => {
  loadBySection(req.params.s, req.params.i, r => {
    res.json(r);
  });
});

siteRoute.get("/post/:slug", (req, res) => {
  loadPost(req.params.slug, r => {
    res.json(r);
  });
});

siteRoute.get("/comments/:pid/:ind", (req, res) => {
  loadPostComment(req.params.pid, req.params.ind, r => {
    res.json(r);
  });
});

siteRoute.post("/comment", (req, res) => {
  makeComment(req.body, r => {
    res.json(r);
  });
});

siteRoute.post("/post-analytics", (req, res) => {
  savePostAnalytics(req, r => {
    res.json(r);
  });
});

siteRoute.post("/visits", (req, res) => {
  saveVisits(req, r => {
    res.json(r);
  });
});

siteRoute.post("/search", (req, res) => {
  searchPosts(req.body.key, r => {
    res.json(r);
  });
});
