import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule, NbActionsModule } from '@nebular/theme';

import { ProductionsRoutingModule } from './productions-routing.module';
import { ProductionsComponent } from './productions.component';
import { HsComponent } from './prod-model/hs/hs.component';
import { HsInfoComponent } from './prod-model/hs/hs-info/hs-info.component';
import { ParameterComponent } from './prod-model/parameter/parameter.component';
import { ParaInfoComponent } from './prod-model/parameter/para-info/para-info.component';
import { PersonnelComponent } from './prod-model/personnel/personnel.component';
import { PclassInfoComponent } from './prod-model/personnel/pclass-info/pclass-info.component';
import { PersonInfoComponent } from './prod-model/personnel/person-info/person-info.component';
import { PersonComponent } from './prod-model/personnel/person/person.component';
import { MolderBodyStatsComponent } from './prod-model/personnel/person/molder-body-stats/molder-body-stats.component';
import { MolderBodyTrimableComponent } from './prod-model/personnel/person/molder-body-trimable/molder-body-trimable.component';

import { EquipmentComponent } from './prod-model/equipment/equipment.component';
import { EclassInfoComponent } from './prod-model/equipment/eclass-info/eclass-info.component';
import { EquipInfoComponent } from './prod-model/equipment/equip-info/equip-info.component';
import { MaterialComponent } from './prod-model/material/material.component';
import { EnergyComponent } from './prod-model/energy/energy.component';
import { ProsegComponent } from './prod-model/proseg/proseg.component';
import { ProsegInfoComponent } from './prod-model/proseg/proseg-info/proseg-info.component';
import { KpiComponent } from './prod-model/kpi/kpi.component';
import { JobComponent } from './job/job.component';
import { HsPopComponent } from './prod-model/hs/hs-pop/hs-pop.component';
import { EnclasInfoComponent } from './prod-model/energy/enclas-info/enclas-info.component';
import { OpDefComponent } from './prod-model/op-def/op-def.component';
import { OpDefInfoComponent } from './prod-model/op-def/op-def-info/op-def-info.component';
import { MaterialInfoComponent } from './prod-model/material/material-info/material-info.component';
import { MclassInfoComponent } from './prod-model/material/mclass-info/mclass-info.component';
import { WorkReqInfoComponent } from './job/work-req-info/work-req-info.component';
import { JobOrderInfoComponent } from './job/job-order-info/job-order-info.component';
import { KpiInfoComponent } from './prod-model/kpi/kpi-info/kpi-info.component';
import { KpiDefInfoComponent } from './prod-model/kpi/kpi-def-info/kpi-def-info.component';
import { FloorScheduleComponent } from './floor-schedule/floor-schedule.component';
import { EndefInfoComponent } from './prod-model/energy/endef-info/endef-info.component';
import { EquipListComponent } from './prod-model/equipment/equip-list/equip-list.component';
import { WorkResComponent } from './job/work-res/work-res.component';
import { WorkResInfoComponent } from './job/work-res-info/work-res-info.component';
import { JobResComponent } from './job/job-res/job-res.component';
import { JobShowComponent } from './job/job-show/job-show.component';
import { JobShowTotalComponent } from './job/job-show/job-show-total/job-show-total.component';
import { JobShowRatioComponent } from './job/job-show/job-show-ratio.component';
import { JobShowQtyComponent } from './job/job-show/job-show-qty.component';
import { JobShowQciComponent } from './job/job-show/job-show-qci.component';
import { JobShowOplogComponent } from './job/job-show/job-show-oplog.component';
import { JobsStatsComponent } from './job/jobs-stats/jobs-stats.component';
import { JobsStatsQtyComponent } from './job/jobs-stats/jobs-stats-qty.component';
import { JobsStatsQtyRatioComponent } from './job/jobs-stats/jobs-stats-qty-ratio.component';
import { WorkShowComponent } from './job/work-show/work-show.component';
import { WorkShowQtyComponent } from './job/work-show/work-show-qty/work-show-qty.component';
import { WorkShowOplogComponent } from './job/work-show/work-show-oplog.component';
import { WorkShowTotalComponent } from './job/work-show/work-show-total/work-show-total.component';
import { WorkShowQciComponent } from './job/work-show/work-show-qci/work-show-qci.component';
import { JobsStatsTotalComponent } from './job/jobs-stats/jobs-stats-total/jobs-stats-total.component';

const ENTRY_COMPONENTS = [
  HsInfoComponent,
  HsPopComponent,
  ParaInfoComponent,
  PclassInfoComponent,
  PersonInfoComponent,
  EnclasInfoComponent,
  EndefInfoComponent,
  PersonComponent,
  MclassInfoComponent,
  MaterialInfoComponent,
  EclassInfoComponent,
  EquipInfoComponent,
  ProsegInfoComponent,
  OpDefInfoComponent,
  WorkReqInfoComponent,
  JobOrderInfoComponent,
  KpiInfoComponent,
  KpiDefInfoComponent,
  WorkResInfoComponent
];

@NgModule({
  declarations: [ProductionsComponent,
    HsComponent,
    HsInfoComponent,
    ParameterComponent,
    PersonnelComponent,
    PclassInfoComponent,
    PersonInfoComponent,
    PersonComponent,
    MolderBodyStatsComponent,
    MolderBodyTrimableComponent,
    EquipmentComponent,
    EclassInfoComponent,
    EquipInfoComponent,
    MaterialComponent,
    EnergyComponent,
    ProsegComponent,
    ProsegInfoComponent,
    KpiComponent,
    JobComponent,
    HsPopComponent,
    MaterialInfoComponent,
    MclassInfoComponent,
    HsPopComponent,
    ParaInfoComponent,
    EnclasInfoComponent,
    EndefInfoComponent,
    OpDefComponent,
    OpDefInfoComponent,
    WorkReqInfoComponent,
    JobOrderInfoComponent,
    KpiInfoComponent,
    KpiDefInfoComponent,
    FloorScheduleComponent,
    EquipListComponent,
    WorkResComponent,
    WorkResInfoComponent,
    JobResComponent,
    JobShowComponent,
    JobShowTotalComponent,
    JobShowRatioComponent,
    JobShowQtyComponent,
    JobShowQciComponent,
    JobShowOplogComponent,
    JobsStatsComponent,
    JobsStatsQtyComponent,
    JobsStatsQtyRatioComponent,
    WorkShowComponent,
    WorkShowQtyComponent,
    WorkShowOplogComponent,
    WorkShowTotalComponent,
    WorkShowQciComponent,
    JobsStatsTotalComponent,
  ],

  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    NbActionsModule,
    ProductionsRoutingModule,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ProductionsModule { }
