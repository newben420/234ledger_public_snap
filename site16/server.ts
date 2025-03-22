import 'zone.js/node';
import 'reflect-metadata';
import { config } from 'dotenv';
config();
import { enableProdMode} from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import { apiRoute } from 'server/routes/api';
import * as path from 'path';
import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { generateSitemap } from 'server/utility/sitemap_gen';
import { Log } from 'server/utility/Log';
import { REQUEST, RESPONSE } from 'server/express.token';
import helmet from 'helmet';


enableProdMode();
// function findProjectRoot(currentDir: string) {
//   while (currentDir !== path.parse(currentDir).root) {
//       if (fs.existsSync(path.join(currentDir, 'package.json'))) {
//           return currentDir;
//       }
//       currentDir = path.dirname(currentDir);
//   }
//   return null; // If no package.json is found
// }

// export const rootPath = findProjectRoot(__dirname);
export const rootPath = process.cwd();

function setCacheHeaders(req: Request, res: Response, next: NextFunction) {
  // Add cache-control headers
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/site16/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  server.disable("x-powered-by");
  server.disable("etag");

  server.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  }));

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  // server.use(setCacheHeaders);

  server.use("/admin", express.static(path.join(rootPath, "admin"), {
    maxAge: '30d'
  }));

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
    inlineCriticalCss: false,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints

  server.get("/sitemap.xml", generateSitemap);

  server.use("/api", apiRoute);
  // server.use("/admin", express.static(path.join(__dirname, "admin/browser")));
  // Serve static files from /browser
  

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res, next) => {
    if (req.path.startsWith("/uploads")) {
      return next();
    }
    res.render(indexHtml, {
      req, providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: RESPONSE, useValue: res },
        { provide: REQUEST, useValue: req },
      ]
    });
  });

  server.use("/uploads", express.static(path.join(rootPath, "uploads"), {
    maxAge: '30d'
  }));

  

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
