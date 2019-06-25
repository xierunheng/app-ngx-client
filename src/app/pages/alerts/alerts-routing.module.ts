import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertsComponent } from './alerts.component';
import { WorkAlertDefComponent } from './work-alert-def/work-alert-def.component';
import { WorkAlertDefInfoComponent } from './work-alert-def/work-alert-def-info/work-alert-def-info.component';
import { WorkAlertComponent } from './work-alert/work-alert.component';
import { WorkAlertInfoComponent } from './work-alert/work-alert-info/work-alert-info.component';

const routes: Routes = [{
	path: '',
	component: AlertsComponent,
	children: [ {
		path: 'work-alert-def',
		component: WorkAlertDefComponent
	},
  {
		path: 'work-alert',
		component: WorkAlertComponent 
	},
	// {
	// 	path: 'jobOrder',
	// 	component: JobOrderComponent
	// }
	],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
