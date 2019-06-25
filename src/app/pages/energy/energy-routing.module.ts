import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnergyComponent } from './energy.component';
import { EnergyMonitorComponent } from './energy-monitor/energy-monitor.component';

const routes: Routes = [{
	path: '',
	component: EnergyComponent,
	children: [ {
		path: 'energy-monitor',
		component: EnergyMonitorComponent
	},
 //  {
	// 	path: 'kpi',
	// 	component: KpiComponent
	// }, {
	// 	path: 'jobOrder',
	// 	component: JobOrderComponent
	// }
	],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnergyRoutingModule { }
