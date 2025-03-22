import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgToggleModule } from 'ng-toggle-button';
import { PromptComponent } from './prompt/prompt.component';
import { PromptFactoryComponent } from './prompt/prompt-factory/prompt-factory.component';
import { AccordionComponent } from './accordion/accordion.component';
import { BrandComponent } from './brand/brand.component';
import { TabsComponent } from './tabs/tabs.component';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [
    ThemeSelectorComponent,
    PromptComponent,
    PromptFactoryComponent,
    AccordionComponent,
    BrandComponent,
    TabsComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgToggleModule,
  ],
  exports: [
    ThemeSelectorComponent,
    TranslateModule,
    FormsModule,
    PromptComponent,
    AccordionComponent,
    TabsComponent,
    TableComponent,
    BrandComponent,
    NgToggleModule,
  ],
  providers: [
    TranslateStore,
  ]
})
export class SharedModule { }
