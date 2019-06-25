import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule } from '@nebular/theme';

import { QualityRoutingModule } from './quality-routing.module';
import { QualityComponent } from './quality.component';
import { DatabaseComponent } from './IPQC/database/database.component';
import { DatabaseInfoComponent } from './IPQC/database/database-info/database-info.component';
import { MtestComponent } from './IPQC/mtest/mtest.component';
import { MtestInfoComponent } from './IPQC/mtest/mtest-info/mtest-info.component';
import { MtestIQCComponent } from './IQC/mtest/mtest.component';
import { MtestIQCInfoComponent } from './IQC/mtest/mtest-info/mtest-info.component';
import { MtestSpecComponent } from './IQC/mtest-spec/mtest-spec.component';
import { MtestSpecInfoComponent } from './IQC/mtest-spec/mtest-spec-info/mtest-spec-info.component';
import { IPQCStatisticsComponent } from './IPQC/ipqc-statistics/ipqc-statistics.component';
import { IPQCAlertreportComponent } from './IPQC/ipqc-alertreport/ipqc-alertreport.component';

const ENTRY_COMPONENTS = [
  DatabaseInfoComponent,
  MtestSpecInfoComponent,
  MtestInfoComponent,

];

@NgModule({
  declarations: [QualityComponent,
    DatabaseComponent,
    DatabaseInfoComponent,
    MtestComponent,
    MtestIQCComponent,
    MtestIQCInfoComponent,
    MtestInfoComponent,
    MtestSpecComponent,
    MtestSpecInfoComponent,
    IPQCStatisticsComponent,
    IPQCAlertreportComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    QualityRoutingModule,
  ],
   entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class QualityModule { }
