import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { BaseChartDirective } from 'ng2-charts';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    BaseChartDirective,
    SharedModule,
  ],
  providers: [
    // provideCharts(withDefaultRegisterables())
  ],
})
export class StatisticsModule { }
