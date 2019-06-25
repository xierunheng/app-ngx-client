import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { IDashboardModule } from './i-dashboard/i-dashboard.module';
import { DefDashboardModule } from './def-dashboard/def-dashboard.module';
import { ProcessDashboardModule} from './process-dashboard/process-dashboard.module';
import { RealtimeDashboardModule } from './realtime-dashboard/realtime-dashboard.module';
import { QcDashboardModule } from './qc-dashboard/qc-dashboard.module';
import { EmaintDashboardModule } from './emaint-dashboard/emaint-dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    ECommerceModule,
    IDashboardModule,
    DefDashboardModule,
    ProcessDashboardModule,
    RealtimeDashboardModule,
    QcDashboardModule,
    EmaintDashboardModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
