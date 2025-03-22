import { PreloaderComponent } from './partials/preloader/preloader.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NotifierModule } from 'gramli-angular-notifier';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './partials/header/header.component';
import { NgToggleModule } from 'ng-toggle-button';
import { QuillModule } from 'ngx-quill';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    PreloaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    NgToggleModule.forRoot(),
    QuillModule.forRoot({
      theme: 'snow',
      placeholder: '',
      debug: 'log',
      modules: {
        toolbar: true,
      }
    }),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 10
        },
        vertical: {
          position: 'top',
          distance: 10,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          easing: 'ease'
        },
        overlap: 150
      }
    }),
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
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
