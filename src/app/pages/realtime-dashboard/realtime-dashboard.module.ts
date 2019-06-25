import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeDashboardComponent } from './realtime-dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { RealtimeJobComponent } from './realtime-job.component';
import { RealtimeEquipmentComponent } from './realtime-equipment.component';
import { RealtimeMaterialComponent } from './realtime-material.component';
import { RealtimePersonComponent } from './realtime-person.component';

@NgModule({
  declarations: [RealtimeDashboardComponent,
  	RealtimeJobComponent,
  	RealtimeEquipmentComponent,
  	RealtimeMaterialComponent,
  	RealtimePersonComponent,
  	],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
  ]
})
export class RealtimeDashboardModule { }
