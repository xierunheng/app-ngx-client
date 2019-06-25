import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsService } from './hs.service';
import { PclassService } from './pclass.service';
import { PersonService } from './person.service';
import { QTestSpecService } from './qtest-spec.service';
import { QTestService } from './qtest.service';
import { EclassService } from './eclass.service';
import { EquipmentService } from './equipment.service';
import { ECapTestSpecService } from './ectest-spec.service';
import { ECapTestService } from './ectest.service';
import { MclassService } from './mclass.service';
import { MdefService } from './mdef.service';
import { MlotService } from './mlot.service';
import { MsubLotService } from './msublot.service';
import { MTestSpecService } from './mtest-spec.service';
import { MTestService } from './mtest.service';
import { KpiDefinitionService } from './kpi-def.service';
import { KpiService } from './kpi.service';
import { KpiValueService } from './kpi-value.service';
import { ProsegService } from './proseg.service';
import { WorkMasterService } from './work-master.service';
import { JobOrderService } from './job-order.service';
import { JobResponseService } from './job-response.service';
import { WorkCapabilityService } from './work-cap.service';
import { WmCapabilityService } from './wm-cap.service';
import { WorkRequestService } from './work-req.service';
import { WorkResponseService } from './work-res.service';
import { WorkScheduleService } from './work-schedule.service';
import { WorkPerformanceService } from './work-perf.service';
import { OpDefService } from './op-def.service';
import { OpRequestService } from './op-req.service';
import { OpResponseService } from './op-res.service';
import { OpCapabilityService } from './op-cap.service';
import { ProsegCapabilityService } from './proseg-cap.service';
import { OpScheduleService } from './op-schedule.service';
import { OpPerformanceService } from './op-perf.service';
import { CustomerService } from './customer.service';
import { SupplierService } from './supplier.service';
import { OrderService } from './order.service';
import { OrderDefService } from './order-def.service';
import { ParameterService } from './parameter.service';
import { PsubService } from './psub.service';
import { EsubService } from './esub.service';
import { EdataService } from './edata.service';
import { EnclassService } from './enclass.service';
import { EnDefService } from './endef.service';
import { EnsubService } from './ensub.service';
import { EndataService } from './endata.service';
import { WorkAlertService } from './work-alert.service';
import { WorkAlertDefService } from './work-alert-def.service';
import { UploadService } from './upload.service';
import { SmsService } from './sms.service';
import { EMaintService } from './emaint.service';
import { PaclassService } from './paclass.service';
import { PhysicalAssetService } from './physical-asset.service';
import { TerminalDefService } from './terminal-def.service';
import { SingleEventService } from './single-event.service';
import { SampleService } from './sample.service';
import { BPRService } from './bpr.service';
import { ScadaDataService } from './scadaData.service';

const SERVICES = [
  HsService,
  PclassService,
  PersonService,
  QTestSpecService,
  QTestService,
  EclassService,
  EquipmentService,
  // ECapTestSpecService,
  // ECapTestService,
  MclassService,
  MdefService,
  MlotService,
  MsubLotService,
  MTestSpecService,
  MTestService,

  KpiDefinitionService,
  KpiService,
  KpiValueService,
  ProsegService,
  WorkMasterService,
  JobOrderService,
  JobResponseService,
  WorkCapabilityService,
  WmCapabilityService,
  WorkRequestService,
  WorkResponseService,
  WorkScheduleService,
  WorkPerformanceService,
  OpDefService,
  OpRequestService,
  OpResponseService,
  OpScheduleService,
  OpPerformanceService,
  OpCapabilityService,

  ProsegCapabilityService,
  CustomerService,
  SupplierService,
  OrderService,
  OrderDefService,
  ParameterService,
  PsubService,
  EsubService,
  EdataService,
  EnclassService,
  EnDefService,
  EnsubService,
  EndataService,
  WorkAlertService,
  WorkAlertDefService,
  UploadService,
  SmsService,
  EMaintService,
  PaclassService,
  PhysicalAssetService,
  TerminalDefService,
  SingleEventService,
  SampleService,
  BPRService,
  ScadaDataService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
