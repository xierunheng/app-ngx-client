import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { ProcessEquipmentComponent } from './process-equipment/process-equipment.component';
import { ProcessCompareComponent } from './process-compare/process-compare.component';

const routes: Routes = [{
	path: '',
	component: ProcessComponent,
	children: [{
		path: 'single-event',
		component: SingleEventComponent
	}, {
		path: 'process-equipment',
		component: ProcessEquipmentComponent 
	}, {
		path: 'process-compare',
		component: ProcessCompareComponent 
	}]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
