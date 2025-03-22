import { existsSync } from 'node:fs';
import { GSRes, ServerRes } from '@shared/model/res';
import { LocalRegex } from '@shared/model/regex';
import { Login } from '@shared/model/login';
import { Router } from "express";
import { Log } from '../../utility/Log';
import { AdminLogin, AdminLogout, changePassword, getJWTFromCookie, logOutOfOtherDevices, saveJWTToCookie, Verify } from '../../utility/admin _helper';
import * as cors from "cors";
import { mode } from 'server/utility/db';
import { AdminModules } from 'server/utility/admin_modules';
import { AdminModule } from '@shared/db/admin_module';
import { addCategory, addSection, deleteAccount, deleteCategory, deleteSection, editSlug, editSlugSection, editTitle, editTitleSection, getAccounts, getAllModules, getCategories, getSections, newAccount, updateReadOnly, updateRoles } from 'server/modular/admin';
import { config } from "dotenv";
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import { rootPath } from 'server';
import { deleteComment, deleteComments, deleteImage, deletePost, editImageTitle, getComments, getImages, getPostById, getPosts, processFileUpload, savePost, unpublishPost } from 'server/modular/post';
import { UUIDHelper } from 'server/utility/uuid';
import { approveComment, approvePost, getCommentsForApproval, getPostContents, getPostsForApproval } from 'server/modular/approve';
import { convertYesterdays, getYesterdaysIDs, loadCurrent, saveCurrentContent, validatePostSlug } from 'server/modular/current';
import { deleteSubs, downloadSubs, loadEmailComponent } from 'server/modular/email';
import { performQuery } from 'server/modular/query';
import { getStats } from 'server/modular/stats';
config();

export const adminRoute = Router();

adminRoute.use(cors({
  origin: process.env[`ADMIN_${mode}_URL`],
  optionsSuccessStatus: 200,
  credentials: true,
}));

adminRoute.post("/site-url", (req, res) => {
  res.json(GSRes.succ(process.env[`NG_APP_SITE_URL_${mode}`]));
});

adminRoute.post("/sign-in", (req, res) => {
  let bd = req.body;
  if (bd.username && bd.password) {
    let login: Login = {
      username: bd.username,
      password: bd.password,
    }
    if (LocalRegex.username.test(login.username) && LocalRegex.password.test(login.password)) {
      AdminLogin(login, (r) => {
        if (!r.succ) {
          res.json(r);
        }
        else {
          let token: string = r.message.token;
          let id: string = r.message.username;
          saveJWTToCookie(res, id, token, () => {
            res.json(GSRes.succ());
          });
        }
      });
    }
    else {
      Log.dev(`${login} did not pass regex test for admin login.`);
      res.json(GSRes.err('wrong_username_password'));
    }
  }
  else {
    Log.dev(`${bd} - not enough data supply for admin login.`);
    res.sendStatus(400);
  }
});

// verification middleware
adminRoute.use(async (req, res, next) => {
  let myMWPromise = () => {
    return new Promise<ServerRes>((resolve, reject) => {
      getJWTFromCookie(req, (rx) => {
        if (!rx.succ) {
          resolve(rx);
        }
        else {
          Verify(rx.message.jwt, rx.message.u, (rxx) => {
            if (!rxx.succ) {
              resolve(rxx);
            }
            else {
              req.lextra.admin = rxx.message.admin;
              if (rxx.message.newToken) {
                saveJWTToCookie(res, rx.message.u, rxx.message.newToken, () => {
                  resolve(GSRes.succ());
                });
              }
              else {
                resolve(GSRes.succ());
              }
            }
          });
        }
      });
    });
  }
  let m_res = await myMWPromise();
  if (!m_res.succ) {
    res.json(m_res);
  }
  else {
    next();
  }
});

adminRoute.post("/logout", (req, res) => {
  AdminLogout(req, res, () => {
    res.json(GSRes.succ('translate:logout'));
  });
});

adminRoute.use((req, res, next) => {
  req.lextra.password = `${req.lextra.admin.password}`;
  next();
});

adminRoute.post("/verify", (req, res) => {
  try {
    delete req.lextra.admin.password;
    delete req.lextra.admin.jwt;
    // delete req.lextra.admin.last_logged_in;
    // delete req.lextra.admin.last_modified;
  } catch (error) {
    Log.dev(error);
  }
  finally {
    res.json(GSRes.succ(req.lextra.admin));
  }
});

// separate modules here
// module authorization middleware
adminRoute.use((req, res, next) => {
  AdminModules.getModulesforMW(modules => {
    let module: string = req.path.replace(/^\/api\/admin\//i, "").replace(/^\//, "").replace(/\/.*$/i, "");
    if (module.length == 0) {
      next();
    }
    else {
      let allModulesArr: string[] = modules.map(x => x.slug) as string[];
      let authModulesArr: string[] = (req.lextra.admin.modules as AdminModule[]).map(x => x.slug);
      if (allModulesArr.indexOf(module) != -1 && authModulesArr.indexOf(module) == -1) {
        res.json(GSRes.err("access_denied"));
      }
      else {
        next();
      }
    }
  });
});

// all routes for various admin modules from here will start with their slugs
// all other routes after this will not be affected or protected by the above middleware
// dont forget to add read-only check for read-only accounts on write routes

// READ ROUTES AND OTHER ROUTES HERE
// ADMN MODULE READ ROUTES
adminRoute.post("/admin/get-accounts", (req, res) => {
  getAccounts(r => {
    res.json(r);
  });
});

adminRoute.post("/admin/get-all-modules", (req, res) => {
  getAllModules(r => {
    res.json(r);
  });
});

adminRoute.post("/admin/get-categories", (req, res) => {
  getCategories(r => {
    res.json(r);
  });
});

adminRoute.post("/admin/get-sections", (req, res) => {
  getSections(r => {
    res.json(r);
  });
});


// POST MODULE READ ROUTES

adminRoute.post("/post/get-images", (req, res) => {
  getImages(r => {
    res.json(r);
  });
});

adminRoute.post("/post/get-posts", (req, res) => {
  getPosts(r => {
    res.json(r);
  });
});

adminRoute.post("/post/get-comments", (req, res) => {
  getComments(req.body.id, r => {
    res.json(r);
  });
});

adminRoute.post("/post/get-post", (req, res) => {
  getPostById(req.body.id, r => {
    res.json(r);
  });
});

// APPROVE MODULE READ ROUTES

adminRoute.post("/approve/get-posts", (req, res) => {
  getPostsForApproval(r => {
    res.json(r);
  });
});

adminRoute.post("/approve/get-comments", (req, res) => {
  getCommentsForApproval(r => {
    res.json(r);
  });
});

adminRoute.post("/approve/get-post-content", (req, res) => {
  getPostContents(req.body.id, r => {
    res.json(r);
  });
});

// CURRENT MODULE READ ROUTES
adminRoute.post("/current/get-content", (req, res) => {
  loadCurrent(r => {
    res.json(r);
  });
});

adminRoute.post("/current/yester-ids", (req, res) => {
  getYesterdaysIDs(req.body, r => {
    res.json(r);
  });
});

adminRoute.post("/current/validate-post-slug", (req, res) => {
  validatePostSlug(req.body.slug, r => {
    res.json(r);
  });
});

// EMAIL MODULE READ ROUTES
adminRoute.post("/email/load", (req, res) => {
  loadEmailComponent(r => {
    res.json(r);
  });
});

// STATS MODULE READ ROUTES
adminRoute.post("/stats/get", (req, res) => {
  getStats(r => {
    res.json(r);
  });
});

// READ-ONLY MIDDLEWARE HERE
adminRoute.use((req, res, next) => {
  if (req.lextra.admin.read_only != 0) {
    if(req.method.toLowerCase() == "get"){
      res.status(401).send("The requested resource cannot be accessed from a read-only account.");
    }
    else{
      res.json(GSRes.err("read_only"));
    }
  }
  else {
    next();
  }
});

// WRITE ROUTES HERE
// ADMIN MODULE WRITE ROUTES
adminRoute.post("/admin/new-account", (req, res) => {
  let bd = req.body;
  newAccount(bd.username, bd.password, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/add-category", (req, res) => {
  let bd = req.body;
  addCategory(bd.title, bd.slug, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/add-section", (req, res) => {
  let bd = req.body;
  addSection(bd.title, bd.slug, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/update-read-only", (req, res) => {
  let bd = req.body;
  updateReadOnly(req.lextra.admin.username, bd.v, bd.i, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/delete-account", (req, res) => {
  let bd = req.body;
  deleteAccount(req.lextra.admin.username, bd.username, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/delete-category", (req, res) => {
  let bd = req.body;
  deleteCategory(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/delete-section", (req, res) => {
  let bd = req.body;
  deleteSection(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/update-roles", (req, res) => {
  let bd = req.body;
  updateRoles(bd.username, bd.roles, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/edit-title", (req, res) => {
  let bd = req.body;
  editTitle(bd.title, bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/edit-title-section", (req, res) => {
  let bd = req.body;
  editTitleSection(bd.title, bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/edit-slug", (req, res) => {
  let bd = req.body;
  editSlug(bd.slug, bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/admin/edit-slug-section", (req, res) => {
  let bd = req.body;
  editSlugSection(bd.slug, bd.id, r => {
    res.json(r);
  });
});

// POST MODULE WRITE ROUTES

adminRoute.post("/post/edit-image-title", (req, res) => {
  let bd = req.body;
  editImageTitle(bd.title, bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/post/delete-image", (req, res) => {
  let bd = req.body;
  deleteImage(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/post/save", (req, res) => {
  let bd = req.body;
  savePost(bd, r => {
    res.json(r);
  });
});

adminRoute.post("/post/delete-post", (req, res) => {
  let bd = req.body;
  deletePost(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/post/unpublish-post", (req, res) => {
  let bd = req.body;
  unpublishPost(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/post/delete-comment", (req, res) => {
  let bd = req.body;
  deleteComment(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/post/delete-comments", (req, res) => {
  let bd = req.body;
  deleteComments(bd.id, r => {
    res.json(r);
  });
});

// APPROVE MODULE WRITE ROUTES
adminRoute.post("/approve/approve-post", (req, res) => {
  approvePost(req.body.id, r => {
    res.json(r);
  });
});

adminRoute.post("/approve/delete-comment", (req, res) => {
  let bd = req.body;
  deleteComment(bd.id, r => {
    res.json(r);
  });
});

adminRoute.post("/approve/approve-comment", (req, res) => {
  approveComment(req.body.id, r => {
    res.json(r);
  });
});

// CURRENT MODULE WRITE ROUTES
adminRoute.post("/current/save", (req, res) => {
  let bd = req.body;
  saveCurrentContent(bd, r => {
    res.json(r);
  });
});

adminRoute.post("/current/convert-yesterday", (req, res) => {
  let bd = req.body;
  convertYesterdays(bd, r => {
    res.json(r);
  });
});

// EMAIL MODULE WRITE ROUTES
adminRoute.get("/email/download/:freq", (req, res) => {
  downloadSubs(req.params.freq, r => {
    if(r.succ){
      res.json(r.message);
    }
    else{
      res.sendStatus(404);
    }
  });
});

adminRoute.post("/email/delete", (req, res) => {
  let bd = req.body;
  deleteSubs(bd.freq, r => {
    res.json(r);
  });
});

// QUERY MODULE WRITE ROUTES
adminRoute.post("/query/perform", (req, res) => {
  let bd = req.body;
  performQuery(bd.query, r => {
    res.json(r);
  });
});

// NON MODULAR WRITE ROUTES
adminRoute.post("/logout-others", (req, res) => {
  logOutOfOtherDevices(req, res, () => {
    res.json(GSRes.succ('translate:logout_others'));
  });
});

adminRoute.post("/change-password", (req, res) => {
  let bd = req.body;
  changePassword(req.lextra.admin.username, req.lextra.password, bd.cpw, bd.pw, r => {
    res.json(r);
  });
});

// FILE UPLOADS WRITE ROUTES
adminRoute.use(fileUpload({
  abortOnLimit: true,
  createParentPath: false,
  safeFileNames: true,
  preserveExtension: true,
  // debug: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: {
    fileSize: parseInt(process.env["UPLOADS_MAX_FILE_SIZE_BYTES"])
  },
}));

adminRoute.post("/post/upload-image", (req, res) => {
  if (req.files ? req.files["file"] : false) {
    if (req.body.title && LocalRegex.title.test(req.body.title)) {
      let files = req.files!;
      let file = files["file"] as any;
      let uploadPath: string = path.join(rootPath, `uploads/${file.name}`);
      if (existsSync(uploadPath)) {
        uploadPath = path.join(rootPath, `uploads/${UUIDHelper.generate()}${path.extname(file.name)}`);
      }
      file.mv(uploadPath, (r: any) => {
        processFileUpload(uploadPath, req.body.title, r => {
          res.json(r);
        });
      });
    }
    else {
      res.json(GSRes.err("wrong_request"));
    }
  }
  else {
    res.json(GSRes.err("wrong_request"));
  }
});
