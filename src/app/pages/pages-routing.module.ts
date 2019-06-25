import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { IDashboardComponent } from './i-dashboard/i-dashboard.component';
import { DefDashboardComponent } from './def-dashboard/def-dashboard.component';
import { ProcessDashboardComponent } from './process-dashboard/process-dashboard.component';
import { RealtimeDashboardComponent } from './realtime-dashboard/realtime-dashboard.component';
import { QcDashboardComponent } from './qc-dashboard/qc-dashboard.component';
import { EmaintDashboardComponent } from './emaint-dashboard/emaint-dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: ECommerceComponent,
  }, {
    path: 'iot-dashboard',
    component: DashboardComponent,
  }, {
    path: 'i-dashboard',
    component: IDashboardComponent,
  }, {
    path: 'def-dashboard',
    component: DefDashboardComponent,
  }, {
    path: 'process-dashboard',
    component: ProcessDashboardComponent,
  }, {
    path: 'realtime-dashboard',
    component: RealtimeDashboardComponent
  }, {
    path: 'qc-dashboard',
    component: QcDashboardComponent
  }, {
    path: 'emaint-dashboard',
    component: EmaintDashboardComponent
  }, {
    path: 'productions',
    loadChildren: './productions/productions.module#ProductionsModule',
  }, {
    path: 'maintenance',
    loadChildren: './maintenance/maintenance.module#MaintenanceModule',
  }, {
    path: 'quality',
    loadChildren: './quality/quality.module#QualityModule',
  }, {
    path: 'personnel',
    loadChildren: './personnel/personnel.module#PersonnelModule',
  }, {
    path: 'energy',
    loadChildren: './energy/energy.module#EnergyModule',
  }, {
    path: 'alerts',
    loadChildren: './alerts/alerts.module#AlertsModule',
  }, {
    path: 'terminals',
    loadChildren: './terminals/terminals.module#TerminalsModule',
  }, {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
  },
  // {
  //   path: 'ui-features',
  //   loadChildren: './ui-features/ui-features.module#UiFeaturesModule',
  // }, {
  //   path: 'modal-overlays',
  //   loadChildren: './modal-overlays/modal-overlays.module#ModalOverlaysModule',
  // }, {
  //   path: 'extra-components',
  //   loadChildren: './extra-components/extra-components.module#ExtraComponentsModule',
  // }, {
  //   path: 'bootstrap',
  //   loadChildren: './bootstrap/bootstrap.module#BootstrapModule',
  // }, {
  //   path: 'charts',
  //   loadChildren: './charts/charts.module#ChartsModule',
  // }, {
  //   path: 'forms',
  //   loadChildren: './forms/forms.module#FormsModule',
  // }, {
  //   path: 'tables',
  //   loadChildren: './tables/tables.module#TablesModule',
  // }, {
  //   path: 'miscellaneous',
  //   loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
  // }, 
  {
    path: '',
    redirectTo: 'i-dashboard',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
