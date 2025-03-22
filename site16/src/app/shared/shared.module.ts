import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgToggleModule } from 'ng-toggle-button';
import { PromptComponent } from './prompt/prompt.component';
import { PromptFactoryComponent } from './prompt/prompt-factory/prompt-factory.component';
import { BrandComponent } from './brand/brand.component';
import { BttComponent } from '../partials/btt/btt.component';
import { FooterComponent } from '../partials/footer/footer.component';
import { NewsComponent } from '../partials/news/news.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { ShareComponent } from './share/share.component';



@NgModule({
  declarations: [
    ThemeSelectorComponent,
    PromptComponent,
    PromptFactoryComponent,
    BrandComponent,
    NewsComponent,
    FooterComponent,
    BttComponent,
    BreadcrumbComponent,
    SanitizeHtmlPipe,
    ShareComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgToggleModule,
  ],
  exports: [
    ThemeSelectorComponent,
    BrandComponent,
    PromptComponent,
    NewsComponent,
    FooterComponent,
    BttComponent,
    TranslateModule,
    BreadcrumbComponent,
    ShareComponent,
    SanitizeHtmlPipe,
  ]
})
export class SharedModule { }
