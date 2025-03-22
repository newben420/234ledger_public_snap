import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule, HttpLoaderFactory } from './app.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: import.meta.env["NG_APP_DEFAULT_LOCALE"],
      extend: true,
    }),
  ],
  providers: [
    provideHttpClient(withInterceptors([timeoutInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
