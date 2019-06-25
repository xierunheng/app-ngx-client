import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NbDialogModule } from '@nebular/theme';

import { EnergyRoutingModule } from './energy-routing.module';
import { EnergyComponent } from './energy.component';
import { EnergyMonitorComponent } from './energy-monitor/energy-monitor.component';

@NgModule({
  declarations: [EnergyComponent,
  	EnergyMonitorComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NbDialogModule.forChild(),
    EnergyRoutingModule
  ]
})
export class EnergyModule { }
