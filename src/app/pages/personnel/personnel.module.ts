import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule, NbActionsModule } from '@nebular/theme';

import { PersonnelRoutingModule } from './personnel-routing.module';
import { PersonnelComponent } from './personnel.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { PsubShowComponent } from './attendance/psub-show/psub-show.component';
import { PsubShowTotalComponent } from './attendance/psub-show/psub-show-total/psub-show-total.component';
import { PsubShowOplogComponent } from './attendance/psub-show/psub-show-oplog.component';
import { PsubShowQtyComponent } from './attendance/psub-show/psub-show-qty.component';
import { PsubShowQciComponent } from './attendance/psub-show/psub-show-qci.component';
import { PersonStatsComponent } from './attendance/person-stats/person-stats.component';
import { PclassStatsComponent } from './attendance/pclass-stats/pclass-stats.component';
import { PclassStatsTotalComponent } from './attendance/pclass-stats/pclass-stats-total.component';
import { PclassStatsQtyComponent } from './attendance/pclass-stats/pclass-stats-qty.component';
import { PersonStatsQtyComponent } from './attendance/person-stats/person-stats-qty.component';
import { PersonStatsQtyRatioComponent } from './attendance/person-stats/person-stats-qty-ratio.component';
import { PersonStatsTotalComponent } from './attendance/person-stats/person-stats-total/person-stats-total.component';
import { PclassStatsQtyRatioComponent } from './attendance/pclass-stats/pclass-stats-qty-ratio.component';


@NgModule({
  declarations: [PersonnelComponent,
  	AttendanceComponent,
  	PsubShowComponent,
  	PsubShowTotalComponent,
  	PsubShowOplogComponent,
  	PsubShowQtyComponent,
  	PsubShowQciComponent,
  	PersonStatsComponent,
  	PclassStatsComponent,
  	PclassStatsTotalComponent,
  	PclassStatsQtyComponent,
    PersonStatsQtyComponent,
    PersonStatsQtyRatioComponent,
    PersonStatsTotalComponent,
    PclassStatsQtyRatioComponent],

  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    PersonnelRoutingModule,
    NbActionsModule
  ]
})
export class PersonnelModule { }
