import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { ProcessDashboardComponent } from './process-dashboard.component';
import { WorkPanelComponent } from './work-panel/work-panel.component';
import { WorkStateComponent } from './work-panel/work-state.component';
import { WorkTypeComponent } from './work-panel/work-type.component';
import { JobStateComponent } from './work-panel/job-state.component';
import { JobMasterComponent } from './work-panel/job-master.component';
import { PsubPanelComponent } from './psub-panel/psub-panel.component';
import { PsubPclassComponent } from './psub-panel/psub-pclass.component';
import { SlideOutComponent } from './slide-out/slide-out.component';
import { PsubPersonComponent } from './psub-panel/psub-person.component';
import { EsubEclassComponent } from './esub-panel/esub-eclass.component';
import { EsubEquipmentComponent } from './esub-panel/esub-equipment.component';
import { MsubMclassComponent } from './msub-panel/msub-mclass.component';
import { MsubMdefComponent } from './msub-panel/msub-mdef.component';


@NgModule({
  declarations: [ProcessDashboardComponent,
  	WorkPanelComponent,
  	WorkStateComponent,
  	WorkTypeComponent,
  	JobStateComponent,
  	JobMasterComponent,
  	PsubPanelComponent,
  	PsubPclassComponent,
  	SlideOutComponent,
  	PsubPersonComponent,
  	EsubEclassComponent,
  	EsubEquipmentComponent,
    MsubMclassComponent,
    MsubMdefComponent,
  	],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
  ]
})
export class ProcessDashboardModule { }
