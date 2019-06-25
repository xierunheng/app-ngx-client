import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdLogisticComponent } from './prod-logistic.component';
import { WipComponent } from './wip/wip.component';

const routes: Routes = [{
	path: '',
	component: ProdLogisticComponent,
	children: [{
		path: 'wip',
		component: WipComponent
	}]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdLogisticRoutingModule { }
