import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionsComponent } from './productions.component';
import { HsComponent } from './prod-model/hs/hs.component';
import { ParameterComponent } from './prod-model/parameter/parameter.component';
import { PersonnelComponent } from './prod-model/personnel/personnel.component';
import { PersonComponent } from './prod-model/personnel/person/person.component';
import { MolderBodyStatsComponent } from './prod-model/personnel/person/molder-body-stats/molder-body-stats.component';
import { MolderBodyTrimableComponent } from './prod-model/personnel/person/molder-body-trimable/molder-body-trimable.component';
import { EquipmentComponent } from './prod-model/equipment/equipment.component';
import { MaterialComponent } from './prod-model/material/material.component';
import { EnergyComponent } from './prod-model/energy/energy.component';
import { ProsegComponent } from './prod-model/proseg/proseg.component';
import { KpiComponent } from './prod-model/kpi/kpi.component';
import { JobComponent } from './job/job.component';
import { OpDefComponent } from './prod-model/op-def/op-def.component';
import { FloorScheduleComponent } from './floor-schedule/floor-schedule.component';
import { EquipListComponent } from './prod-model/equipment/equip-list/equip-list.component';
import { WorkResComponent } from './job/work-res/work-res.component';
import { JobResComponent } from './job/job-res/job-res.component';
import { JobShowComponent } from './job/job-show/job-show.component';
import { JobsStatsComponent } from './job/jobs-stats/jobs-stats.component';
import { WorkShowComponent } from './job/work-show/work-show.component';

const routes: Routes = [{
	path: '',
	component: ProductionsComponent,
	children: [{
		path: 'hs',
		component: HsComponent
	}, {
		path: 'parameter',
		component: ParameterComponent
	}, {
		path: 'personnel',
		component: PersonnelComponent
	}, {
		path: 'personnel/person',
		component: PersonComponent
	}, {
		path: 'personnel/stats',
		component: MolderBodyStatsComponent 
	}, {
		path: 'personnel/trimable',
		component: MolderBodyTrimableComponent
	}, {
		path: 'equipment',
		component: EquipmentComponent
	}, {
		path: 'equipment/equip-list',
		component: EquipListComponent
	}, {
		path: 'material',
		component: MaterialComponent
	}, {
		path: 'energy',
		component: EnergyComponent
	}, {
		path: 'proseg',
		component: ProsegComponent
	}, {
		path: 'opdef',
		component: OpDefComponent
	}, {
		path: 'kpi',
		component: KpiComponent
	}, {
		path: 'job',
		component: JobComponent
	}, {
		path: 'jobOrder/jobOrder-show/:oid',
		component: JobShowComponent
	}, {
		path: 'jobs-stats',
		component: JobsStatsComponent
	}, {
		path: 'jobOrder/work-show/:oid',
		component: WorkShowComponent
	}, {
		path: 'work-res',
		component: WorkResComponent
	}, {
		path: 'jobOrder-res',
		component: JobResComponent
	}, {
		path: 'floor-schedule',
		component: FloorScheduleComponent
	}, {
		path: 'prod-logistic',
		loadChildren: './prod-logistic/prod-logistic.module#ProdLogisticModule',
	}, {
		path: 'track-trace',
		loadChildren: './track-trace/track-trace.module#TrackTraceModule',
	}, {
		path: 'process',
		loadChildren: './process/process.module#ProcessModule',
	}],
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProductionsRoutingModule { }
