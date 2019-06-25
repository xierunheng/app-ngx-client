import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintenanceComponent } from './maintenance.component';
import { PhysicalAssetComponent } from './physical-asset/physical-asset.component';
import { AlertStatsComponent } from './analysis/alert-stats/alert-stats.component';
import { OpScheduleComponent } from './maint-sched/op-schedule/op-schedule.component';
import { OpScheduleInfoComponent } from './maint-sched/op-schedule-info/op-schedule-info.component';
import { PaListComponent } from './physical-asset/pa-list/pa-list.component';
import { EAlertComponent } from './e-alert/e-alert.component';
import { EquipPerfComponent } from './equip-perf/equip-perf.component';
import { EquipStatsQtyRatioComponent } from './equip-perf/equip-stats/equip-stats-qty-ratio.component';
import { EquipStatsComponent } from './equip-perf/equip-stats/equip-stats.component';
import { EsubShowComponent } from './equip-perf/esub-show/esub-show.component';
import { EclassStatsComponent } from './equip-perf/eclass-stats/eclass-stats.component';
import { EmtSignalComponent } from './emt-signal/emt-signal.component';

const routes: Routes = [{
	path: '',
	component: MaintenanceComponent,
	children: [ {
		path: 'physical-asset',
		component: PhysicalAssetComponent
	}, {
    path: 'physical-asset/pa-list',
    component: PaListComponent
  }, {
    path: 'alertStats',
    component: AlertStatsComponent,
  }, {
		path: 'sched',
		component: OpScheduleComponent,
	}, {
    path: 'e-alert',
    component: EAlertComponent,
  },{
    path: 'MTSignal',
    component: EmtSignalComponent,
  }, {
    path: 'equip-perf',
    component: EquipPerfComponent,
  }, {
    path: 'equip-stats',
    component: EquipStatsComponent,
  }, {
    path: 'eclass-stats',
    component: EclassStatsComponent,
  }, {
    path: 'esub-show/:oid',
    component: EsubShowComponent
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
