import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule, NbActionsModule } from '@nebular/theme';

import { TrackTraceRoutingModule } from './track-trace-routing.module';
import { TrackTraceComponent } from './track-trace.component';
import { ProdTraceComponent } from './prod-trace/prod-trace.component';
import { PackTrackComponent } from './pack-track/pack-track.component';
import { GlazeTrackComponent } from './glaze-track/glaze-track.component';
import { MlotComponent } from './mlot/mlot.component';

@NgModule({
  declarations: [TrackTraceComponent,
  	ProdTraceComponent,
  	PackTrackComponent,
  	GlazeTrackComponent,
  	MlotComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    NbActionsModule,
    TrackTraceRoutingModule
  ]
})
export class TrackTraceModule { }
