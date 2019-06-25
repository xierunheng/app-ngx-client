import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';

import { MTestSpecService } from '../../../../@core/data/mtest-spec.service';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { IMTestSpec } from '../../../../@core/model/mtest-spec';
import { HsService } from '../../../../@core/data/hs.service';
import { GlobalData } from '../../../../@core/model/global';

@Component({
  selector: 'ngx-mtest-spec',
  templateUrl: './mtest-spec.component.html',
  styleUrls: ['./mtest-spec.component.scss']
})
export class MtestSpecComponent implements OnInit {


  mts: IMTestSpec[];

  columns = {
    oid: {
      title: '编号',
      type: 'string',
    },
    name: {
      title: '名称',
      type: 'string',
    },

    ver: {
      title: '版本',
      type: 'string',
    },
    tester: {
      title: '测试人/单位',
      type: 'string',
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
    testedMclassProp: {
      title: '物料类型检测项',
      type: 'string',
      valuePrepareFunction: (testedMclassProp, row) => {
        return row.testedMclassProp && row.testedMclassProp.length > 0 ? row.testedMclassProp.map(item => item.prop.oid).join(',') : '';
      },
      filterFunction: (value, search) => {
        return value.findIndex(v => (v.prop.oid && v.prop.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
      }
    },
    testedMdefProp: {
      title: '物料定义检测项',
      type: 'string',
      valuePrepareFunction: (testedMdefProp, row) => {
        return row.testedMdefProp ? row.testedMdefProp.map(item => item.prop.oid).join(',') : '';
      },
      filterFunction: (value, search) => {
        return value.findIndex(v => (v.prop.oid && v.prop.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
      }
    },
    desc: {
      title: '描述',
      type: 'string',
    },
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: MTestSpecService,
    private hsService: HsService) {
  }

  ngOnInit() {
    this.service.getMTestSpecs().subscribe(mts => {
      this.mts = mts;
    });
  }

  onDelete(event): void {
    this.service.deleteMTestSpec(event).subscribe(() => {
      // this.source.remove(event.data);
    });
  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

}
