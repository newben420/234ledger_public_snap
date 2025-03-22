import { AdminModule } from '@shared/db/admin_module';
import { AMArrayParamFx, BoolParamFx, RecordArrayParamFx } from './general';
import { DB } from './db';
import { RowDataPacket } from 'mysql2';
import { Log } from './Log';
import { config } from 'dotenv';
config();
export class AdminModules {
  private static modules: AdminModule[] | null = null;
  private static loadModules = (fx: BoolParamFx) => {
    let sql = `SELECT * FROM admin_module ORDER BY slug ASC;`
    DB.con().query<RowDataPacket[]>(sql, (err, result) => {
      if (err) {
        Log.dev(err);
        fx(false);
      }
      else {
        this.modules = result as AdminModule[];
        fx(true);
      }
    });
  }

  static getModulesforMW = (fx: AMArrayParamFx) => {
    if (AdminModules.modules == null) {
      AdminModules.loadModules(loaded => {
        if (loaded) {
          fx(AdminModules.modules as AdminModule[]);
        }
        else {
          fx([]);
        }
      });
    }
    else {
      fx(AdminModules.modules);
    }
  }

  static jsonToModules = (json: string, fx: RecordArrayParamFx) => {
    const continueRun = () => {
      let idArr: number[] = [];
      try {
        idArr = JSON.parse(json);
      } catch (error) {
        idArr = [];
      }
      finally {
        if (idArr.length < 1) {
          fx([]);
        }
        else {
          let modules: Record<string, any>[] = [];
          AdminModules.modules!.forEach(mod => {
            if (idArr.indexOf(mod.id) != -1) {
              modules.push(mod);
            }
          });
          fx(modules);
        }
      }
    }
    if (AdminModules.modules == null) {
      AdminModules.loadModules(loaded => {
        if (loaded) {
          continueRun();
        }
        else {
          fx([]);
        }
      });
    }
    else {
      continueRun();
    }
  }
}
