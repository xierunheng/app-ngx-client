import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UtilData } from '../../@core/data/util.service';
import { QualityComponent } from './quality.component';
import { DatabaseComponent } from './IPQC/database/database.component';
import { MtestComponent } from './IPQC/mtest/mtest.component';
import { MtestInfoComponent } from './IPQC/mtest/mtest-info/mtest-info.component';
import { MtestIQCComponent } from './IQC/mtest/mtest.component';
import { MtestIQCInfoComponent } from './IQC/mtest/mtest-info/mtest-info.component';
import { MtestSpecComponent } from './IQC/mtest-spec/mtest-spec.component';
import { MtestSpecInfoComponent } from './IQC/mtest-spec/mtest-spec-info/mtest-spec-info.component';
import { IPQCStatisticsComponent } from './IPQC/ipqc-statistics/ipqc-statistics.component';
import { IPQCAlertreportComponent } from './IPQC/ipqc-alertreport/ipqc-alertreport.component';

const routes: Routes = [{
  path: '',
  component: QualityComponent,
  children: [
    {
      path: 'IPQC/database',
      component: DatabaseComponent
    },
    {
      path: 'IPQC/mtest',
      component: MtestComponent
    }, {
      path: 'IPQC/mtest/new',
      component: MtestInfoComponent,
      data: {
        config: {
          title: '创建物料检测记录',
          buttonText: UtilData.txtNew,
          type: UtilData.txtCreateType,
        }
      }
    }, {
      path: 'IPQC/mtest/:mtid',
      component: MtestInfoComponent,
      data: {
        config: {
          title: '修改物料检测记录',
          buttonText: UtilData.txtUpdate,
          type: UtilData.txtUpdateType,
        }
      }
    },
    {
      path: 'IPQC/statistics',
      component: IPQCStatisticsComponent
    },
    {
      path: 'IPQC/alertreport',
      component: IPQCAlertreportComponent
    },
    {
      path: 'IQC/mtest-spec',
      component: MtestSpecComponent
    }, {
      path: 'IQC/mtest-spec/new',
      component: MtestSpecInfoComponent,
      data: {
        config: {
          title: '创建物料检测规格信息',
          buttonText: UtilData.txtNew,
          type: UtilData.txtCreateType,
        }
      }
    }, {
      path: 'IQC/mtest-spec/:mtsid',
      component: MtestSpecInfoComponent,
      data: {
        config: {
          title: '修改物料检测规格信息',
          buttonText: UtilData.txtUpdate,
          type: UtilData.txtUpdateType,
        }
      }
    },
    {
      path: 'IQC/mtest',
      component: MtestIQCComponent,
    },
    {
      path: 'IQC/mtest/new',
      component: MtestIQCInfoComponent,
      data: {
        config: {
          title: '创建物料检测记录',
          buttonText: UtilData.txtNew,
          type: UtilData.txtCreateType,
        }
      }
    }, {
      path: 'IQC/mtest/:mtid',
      component: MtestIQCInfoComponent,
      data: {
        config: {
          title: '修改物料检测记录',
          buttonText: UtilData.txtUpdate,
          type: UtilData.txtUpdateType,
        }
      }
    },

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityRoutingModule { }
