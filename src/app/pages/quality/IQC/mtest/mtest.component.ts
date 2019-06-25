import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import * as moment from 'moment';
import { MTestService } from '../../../../@core/data/mtest.service';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { IMTest } from '../../../../@core/model/mtest';
import { IMTestSpecElite } from '../../../../@core/model/mtest-spec';
import { HsService } from '../../../../@core/data/hs.service';
import { GlobalData } from '../../../../@core/model/global';

@Component({
  selector: 'ngx-mtest',
  templateUrl: './mtest.component.html',
  styleUrls: ['./mtest.component.scss']
})
export class MtestIQCComponent implements OnInit {

  mts: IMTest[];

  columns = {
    oid: {
      title: '名称',
      type: 'string',
    },
    mtSpec: {
      title: '检测规格',
      type: 'string',
      valuePrepareFunction: (mtSpec, row) => {
        return row.mtSpec ? row.mtSpec.oid + '-' + row.mtSpec.ver : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.ver &&
          `${value.oid}-${value.ver}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    tester: {
      title: '检测单位/人',
      type: 'string',
    },
    testTime: {
      title: '检测时间',
      type: 'string',
      valuePrepareFunction: (testTime, row) => {
        return row.testTime ? moment(row.testTime).format('YYYY-MM-DD') : '';
      },
    },
    sampleOid: {
      title: '样品编号',
      type: 'string',
    },
    sampleSpec: {
      title: '样品规格',
      type: 'string',
    },
    mlot: {
      title: '物料批次',
      type: 'string',
      valuePrepareFunction: (mlot, row) => {
        return row.mlot ? `${row.mlot.oid}` : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    msublot: {
      title: '物料子批次',
      type: 'string',
      valuePrepareFunction: (msublot, row) => {
        return row.msublot ? `${row.msublot.oid}` : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    reason: {
      title: '原因（状况）',
      type: 'string',
      valuePrepareFunction: (reason, row) => {
        return row.reason && row.reason.length > 0 ? `${row.reason[0].value.valueStr}` : '';
      },
    },
    result: {
      title: '结果（评价）',
      type: 'string',
      valuePrepareFunction: (result, row) => {
        return row.result ? `${row.result.valueStr}` : '';
      },
    },
    hs: {
      title: '层级结构',
      type: 'string',
      valuePrepareFunction: (hs, row) => {
        return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
      },
      filterFunction: (value, search) => {
        return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
      }
    },
    loc: {
      title: '存储位置',
      type: 'string',
      valuePrepareFunction: (loc, row) => {
        return row.loc ? `${row.loc.name} [${row.loc.level}]` : '';
      },
      filterFunction: (value, search) => {
        return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
      }
    },
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: MTestService,
    private hsService: HsService) {
  }

  ngOnInit() {
    this.service.getMTests().subscribe(mts => {
      this.mts = mts;
    });
  }

  onDelete(event): void {
    this.service.deleteMTest(event).subscribe(() => {
      // this.source.remove(event.data);
    });
  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

}

