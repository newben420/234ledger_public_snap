import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Res, ServerRes } from '@shared/model/res';
import { Observable } from 'rxjs';
import { LocaleService } from './locale.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient, private locale: LocaleService) { }

  base = import.meta.env["NG_APP_API_URL"];

  get(path: string, fn: Function) {
    let obs = this.http.get(`${this.base}/${path}`, { withCredentials: true, observe: 'response', responseType: 'blob' as 'json' });
    this.obHandler(obs, (r: Res) => {
      fn(r);
      return;
    });
  }

  post(path: string, body: any, fn: Function, file: boolean = false) {
    let headers = new HttpHeaders();
    if (file) {
      headers.set('Content-Type', '');
      headers.set('Accept', 'multipart/form-data');
    }
    let obs = this.http.post<any>(`${this.base}/${path}`, body, { headers, withCredentials: true, responseType: "json", observe: 'body' });
    this.obHandler(obs, (r: Res) => {
      fn(r);
      return;
    });
  }

  downloadTitle = "";

  translateServerResponse = async (r: ServerRes, fn: Function) => {
    // connection succeeded
    if (r.succ) {

      // handle file responses
      if (r.message.body ? typeof r.message.body == 'object' : false) {
        if (r.message.body.type ? !(/json/ig.test(r.message.body.type)) : true) {
          saveAs(r.message.body, this.downloadTitle);
          this.downloadTitle = "";
          r.message = { succ: true, message: 'translate:download' } as ServerRes;
        }
        else {
          try {
            let b = await r.message.body.text();
            b = JSON.parse(b);
            r.message = b;
          } catch (error) {
            r.message = { succ: true, message: 'translate:download' } as ServerRes;
          }
        }
      }

      // get actual server response
      let rr: ServerRes = r.message as ServerRes;
      // server operation succeeded
      if (rr.succ) {
        if (typeof rr.message == 'string' && rr.message.startsWith('translate:')) {
          // attempt translating
          this.locale.trans('server_responses.success.' + rr.message.replace("translate:", ''), (rx: Res) => {
            // ignore translation errors since operation was successful
            fn({ err: false, message: rx.message } as Res);
          });
        }
        else {
          // no need to translate
          fn({ err: false, message: rr.message } as Res);
        }
      }
      // server operation failed
      else {
        // check for message
        if (rr.message) {
          this.locale.trans('server_responses.errors.' + rr.message, (rx: Res) => {
            fn({ err: true, message: rx.message } as Res);
          });
        }
        else {
          this.locale.trans('server_responses.errors.default', (rx: Res) => {
            fn({ err: true, message: rx.message } as Res);
          });
        }
      }
    }
    // connection failed
    else if (r.message) {
      this.locale.trans(r.message, (rx: Res) => {
        fn({ err: true, message: rx.message } as Res);
      });
    }
  };

  private obHandler(o: Observable<any>, fn: Function): any {
    var r: ServerRes;
    try {
      var s = o.subscribe({
        next: (data) => {
          r = { succ: true, message: data };
          this.translateServerResponse(r, (xx: Res) => {
            fn(xx);
          });
          return;
        },
        error: (err) => {
          r = { succ: false, message: 'server_responses.errors.no_conn' };
          this.translateServerResponse(r, (xx: Res) => {
            fn(xx);
          });
          return;
        },
        complete: () => {
          s.unsubscribe();
          return;
        }
      });
    } catch (error) {
      r = { succ: false, message: 'server_responses.errors.unknown_response' };
      this.translateServerResponse(r, (xx: Res) => {
        fn(xx);
      });
      return;
    }
  }
}
