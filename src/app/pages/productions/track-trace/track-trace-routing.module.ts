import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackTraceComponent } from './track-trace.component';
import { ProdTraceComponent } from './prod-trace/prod-trace.component';
import { PackTrackComponent } from './pack-track/pack-track.component';
import { GlazeTrackComponent } from './glaze-track/glaze-track.component';
import { MlotComponent } from './mlot/mlot.component';

const routes: Routes = [{
	path: '',
	component: TrackTraceComponent,
	children: [{
		path: 'mlot',
		component: MlotComponent,
	}, {
		path: 'prod-trace',
		component: ProdTraceComponent,
	}, {
		path: 'pack-track',
		component: PackTrackComponent,
	}, {
		path: 'glaze-track',
		component: GlazeTrackComponent,
	}]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackTraceRoutingModule { }
