import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { config } from 'dotenv';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToggleModule } from 'ng-toggle-button';
import { SharedModule } from './shared/shared.module';
import { NotifierModule } from 'angular-notifier';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { timeoutInterceptor } from './interceptors/timeout.interceptor';
import { PreloaderComponent } from './partials/preloader/preloader.component';
import { HomeComponent } from './routes/home/home.component';
import { HeaderComponent } from './partials/header/header.component';
import { AboutComponent } from './routes/about/about.component';
import { CarouselComponent } from './partials/carousel/carousel.component';
import { ScrollerComponent } from './partials/scroller/scroller.component';
import { NewsComponent } from './partials/news/news.component';
import { FooterComponent } from './partials/footer/footer.component';
import { BttComponent } from './partials/btt/btt.component';
import { CookieNoticeComponent } from './partials/cookie-notice/cookie-notice.component';
import { SearchComponent } from './partials/search/search.component';
import { FormsModule } from '@angular/forms';
import { TermsComponent } from './routes/terms/terms.component';
import { PrivacyComponent } from './routes/privacy/privacy.component';


const envMap: any = {
  NG_APP_SITE_URL_DEV: import.meta.env["NG_APP_SITE_URL_DEV"],
  NG_APP_SITE_URL_PROD: import.meta.env["NG_APP_SITE_URL_PROD"],
  NG_APP_MODE: import.meta.env["NG_APP_MODE"],
};

export const SiteURL = (): string => {
  return envMap[`NG_APP_SITE_URL_${envMap["NG_APP_MODE"]}`];
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `${SiteURL()}/assets/i18n/`, '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PreloaderComponent,
    HomeComponent,
    HeaderComponent,
    AboutComponent,
    CarouselComponent,
    ScrollerComponent,
    CookieNoticeComponent,
    SearchComponent,
    TermsComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
    NgToggleModule.forRoot(),
    AppRoutingModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
