import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule, NbActionsModule } from '@nebular/theme';

import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { ProcessEquipmentComponent } from './process-equipment/process-equipment.component';
import { ProcessCompareComponent } from './process-compare/process-compare.component';
import { SingleEventInfoComponent } from './single-event/single-event-info/single-event-info.component';

const ENTRY_COMPONENTS = [
  SingleEventInfoComponent
];

@NgModule({
  declarations: [ProcessComponent,
  	SingleEventComponent,
  	ProcessEquipmentComponent,
  	ProcessCompareComponent,
  	SingleEventInfoComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    NbActionsModule,
    ProcessRoutingModule
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ProcessModule { }
