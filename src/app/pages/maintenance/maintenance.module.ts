import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NbDialogModule, NbActionsModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { PhysicalAssetComponent } from './physical-asset/physical-asset.component';
import { PaClassInfoComponent } from './physical-asset/pa-class-info/pa-class-info.component';
import { PaInfoComponent } from './physical-asset/pa-info/pa-info.component';
import { AlertStatsComponent } from './analysis/alert-stats/alert-stats.component';
import { OpScheduleComponent } from './maint-sched/op-schedule/op-schedule.component';
import { OpScheduleInfoComponent } from './maint-sched/op-schedule-info/op-schedule-info.component';
import { OpReqInfoComponent } from './maint-sched/op-req-info/op-req-info.component';
import { PaListComponent } from './physical-asset/pa-list/pa-list.component';
import { EAlertComponent } from './e-alert/e-alert.component';
import { EAlertInfoComponent } from './e-alert/e-alert-info/e-alert-info.component';
import { EquipPerfComponent } from './equip-perf/equip-perf.component';
import { EclassStatsComponent } from './equip-perf/eclass-stats/eclass-stats.component';
import { EquipStatsComponent } from './equip-perf/equip-stats/equip-stats.component';
import { EsubShowComponent } from './equip-perf/esub-show/esub-show.component';
import { EsubShowTotalComponent } from './equip-perf/esub-show/esub-show-total/esub-show-total.component';
import { EquipStatsTotalComponent } from './equip-perf/equip-stats/equip-stats-total/equip-stats-total.component';
import { EquipStatsQtyComponent } from './equip-perf/equip-stats/equip-stats-qty.component';
import { EquipStatsQtyRatioComponent } from './equip-perf/equip-stats/equip-stats-qty-ratio.component';
import { EsubShowOplogComponent } from './equip-perf/esub-show/esub-show-oplog.component';
import { EsubShowQciComponent } from './equip-perf/esub-show/esub-show-qci.component';
import { EsubShowQtyComponent } from './equip-perf/esub-show/esub-show-qty.component';
import { EclassStatsTotalComponent } from './equip-perf/eclass-stats/eclass-stats-total.component';
import { EclassStatsQtyComponent } from './equip-perf/eclass-stats/eclass-stats-qty.component';
import { EclassStatsQtyRatioComponent } from './equip-perf/eclass-stats/eclass-stats-qty-ratio.component';
import { EmtSignalComponent } from './emt-signal/emt-signal.component';
import { EFaultShowComponent } from './analysis/alert-stats/e-fault-show.component';


const ENTRY_COMPONENTS = [
	PaClassInfoComponent,
	PaInfoComponent,
  OpScheduleInfoComponent,
  OpReqInfoComponent,
  EAlertInfoComponent,
];

@NgModule({
  declarations: [MaintenanceComponent,
  	PhysicalAssetComponent,
  	PaClassInfoComponent,
  	PaInfoComponent,
    AlertStatsComponent,
    OpScheduleComponent,
    OpScheduleInfoComponent,
    OpReqInfoComponent,
    PaListComponent,
    EAlertComponent,
    EAlertInfoComponent,
    EquipPerfComponent,
    EclassStatsComponent,
    EsubShowComponent,
    EsubShowTotalComponent,
    EquipStatsComponent,
    EquipStatsTotalComponent,
    EquipStatsQtyComponent,
    EquipStatsQtyRatioComponent,
    EsubShowOplogComponent,
    EsubShowQciComponent,
    EsubShowQtyComponent,
    EclassStatsTotalComponent,
    EclassStatsQtyComponent,
    EclassStatsQtyRatioComponent,
    EmtSignalComponent,
    EFaultShowComponent,
    ],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    MaintenanceRoutingModule,
    NbActionsModule
  ],
  entryComponents: [
  	...ENTRY_COMPONENTS,
  ],
})
export class MaintenanceModule { }
