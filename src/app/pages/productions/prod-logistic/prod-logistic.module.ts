import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { NbDialogModule,NbActionsModule } from '@nebular/theme';

import { ProdLogisticRoutingModule } from './prod-logistic-routing.module';
import { ProdLogisticComponent } from './prod-logistic.component';
import { WipComponent } from './wip/wip.component';

@NgModule({
  declarations: [ProdLogisticComponent,
  	WipComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NgxEchartsModule,
    NbDialogModule.forChild(),
    NbActionsModule,
    ProdLogisticRoutingModule
  ]
})
export class ProdLogisticModule { }
