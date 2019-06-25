import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { ChartsModule } from '../charts/charts.module';

import { QcDashboardComponent } from './qc-dashboard.component';


@NgModule({
  declarations: [QcDashboardComponent],
  imports: [
    CommonModule,
    NgxEchartsModule,
    ThemeModule,
    ChartsModule
  ]
})
export class QcDashboardModule { }
