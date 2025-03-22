import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { countryCodes } from '@shared/model/location';
import { StrParamFx } from '../env';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private store: StorageService,
    private http: HttpClient,
  ) { }

  private key: string = "xxloc";
  private url: string = "http://ip-api.com/json/";
  private def: string = "XX";

  async getLoc(f: StrParamFx) {
    const accessAPI = () => {
      return new Promise<string>((resolve, reject) => {
        let headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json');
        try {
          let s = this.http.get(this.url, { headers, withCredentials: false, observe: 'body', responseType: 'json' }).subscribe({
            next: (data) => {
              // json data gotten
              let obj = data as any;
              if (obj.status == "success" && countryCodes.indexOf(obj.countryCode) != -1) {
                this.store.set(this.key, obj.countryCode);
                resolve(obj.countryCode);
              }
              else {
                // no country code gotten
                resolve(this.def);
              }
              return;
            },
            error: (err) => {
              // error connecting
              resolve(this.def);
              return;
            },
            complete: () => {
              s.unsubscribe();
              return;
            }
          });
        } catch (error) {
          // an uncaught error
          resolve(this.def);
          return;
        }
      });
    }
    let stored = this.store.get(this.key);
    if (stored) {
      if (countryCodes.indexOf(stored) != -1) {
        f(stored);
      }
      else {
        this.store.delete(this.key);
        // f(await accessAPI());
        f("XX");
      }
    }
    else {
      // f(await accessAPI());
      f("XX");
    }
  }
}
