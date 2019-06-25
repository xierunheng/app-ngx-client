import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';

import { DefDashboardComponent } from './def-dashboard.component';
import { EchartsPersonComponent } from './echarts-person.component';
import { EchartsEquipmentComponent } from './echarts-equipment.component';
import { EchartsMaterialComponent } from './echarts-material.component';
import { EchartsEnergyComponent } from './echarts-energy.component';
import { EchartsKPIComponent } from './echarts-kpi.component';

@NgModule({
  declarations: [DefDashboardComponent,
    EchartsPersonComponent,
    EchartsEquipmentComponent,
    EchartsMaterialComponent,
  	EchartsEnergyComponent,
  	EchartsKPIComponent,
  	],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule
  ]
})
export class DefDashboardModule { }
