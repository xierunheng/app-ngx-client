import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonnelComponent } from './personnel.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { PsubShowComponent } from './attendance/psub-show/psub-show.component';
import { PclassStatsComponent } from './attendance/pclass-stats/pclass-stats.component';
import { PersonStatsComponent } from './attendance/person-stats/person-stats.component';

const routes: Routes = [{
  path: '',
  component: PersonnelComponent,
  children: [{
    path: 'attendance',
    component: AttendanceComponent
  }, {
    path: 'pclass-stats',
    component: PclassStatsComponent
  }, {
    path: 'person-stats',
    component: PersonStatsComponent
  }, {
    path: 'psub-show/:oid',
    component: PsubShowComponent
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelRoutingModule { }
