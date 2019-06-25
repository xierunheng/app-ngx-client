import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NbDialogModule } from '@nebular/theme';

import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './alerts.component';
import { WorkAlertDefComponent } from './work-alert-def/work-alert-def.component';
import { WorkAlertDefInfoComponent } from './work-alert-def/work-alert-def-info/work-alert-def-info.component';
import { WorkAlertComponent } from './work-alert/work-alert.component';
import { WorkAlertInfoComponent } from './work-alert/work-alert-info/work-alert-info.component';

const ENTRY_COMPONENTS = [
	WorkAlertDefInfoComponent,
	WorkAlertInfoComponent,
];

@NgModule({
  declarations: [AlertsComponent,
  	WorkAlertDefComponent,
  	WorkAlertDefInfoComponent,
  	WorkAlertComponent,
  	WorkAlertInfoComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NbDialogModule.forChild(),
    AlertsRoutingModule
  ],
  entryComponents: [
  	...ENTRY_COMPONENTS,
  ],
})
export class AlertsModule { }
