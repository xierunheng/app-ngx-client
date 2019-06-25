import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as _ from 'lodash';
import { TreeviewItem } from 'ngx-treeview';
import { GlobalData } from '../../../../@core/model/global';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { PersonService } from '../../../../@core/data/person.service';
import { IMsubLot, MsubLot, IMsubLotProfile } from '../../../../@core/model/msublot';
import { UtilData, IDCmpFn, TableSettings, MaterialData } from '../../../../@core/data/util.service';
// import { Headers, Http, Response } from '@angular/http';

@Component({
  selector: 'mes-mlot',
  templateUrl: './mlot.component.html',
  styleUrls: ['./mlot.component.scss']
})
export class MlotComponent implements OnInit {
  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  /**
     * [查询所用的model]
     * 任何的查询条件，都在这里组织
     * @type {IMsubLot}
     */
  searchModel: IMsubLot = new MsubLot();

  msublots: IMsubLotProfile[];

  columns = {
    oid: {
      title: '子批次号',
    },
    mlot: {
      title: '批次号',
      type: 'string',
      valuePrepareFunction: (mlot, row) => {
        return row.mlot ? row.mlot.oid : '';
      },
    },
    mdef: {
      title: '物料名称',
      type: 'string',
      valuePrepareFunction: (mdef, row) => {
        return row.mdef ? row.mdef.oid : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    desc: {
      title: '描述',
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
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty ? `${row.qty.quantity}${row.qty.unit}` : '';
      },
      filterFunction: (value, search) => {
        return value.quantity && value.unit &&
          `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    loc: {
      title: '位置',
      type: 'string',
      valuePrepareFunction: (loc, row) => {
        return row.loc ? row.loc.name : '';
      },
      filterFunction: (value, search) => {
        return value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    status: {
      title: '状态',
    },
    opState: {
      title: '操作状态',
    },
  };

  idCmpFn = IDCmpFn;

  //物料批次的状态可选项
  opStatuses: string[] = _.uniq(_.values(MaterialData.BodyOps).map(bo => bo.state));

  //成型工下拉可选项
  ptree: TreeviewItem[];

  // tree of Mdef, with Mclass
  mtree: TreeviewItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private pService: PersonService,
    private service: MsubLotService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '子批次号',
      },
      mlot: {
        title: '批次号',
        type: 'string',
        valuePrepareFunction: (mlot, row) => {
          return row.mlot ? row.mlot.oid : '';
        },
      },
      mdef: {
        title: '物料名称',
        type: 'string',
        valuePrepareFunction: (mdef, row) => {
          return row.mdef ? row.mdef.oid : '';
        },
        filterFunction: (value, search) => {
          return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
      desc: {
        title: '描述',
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
      qty: {
        title: '数量',
        type: 'string',
        valuePrepareFunction: (qty, row) => {
          return row.qty ? `${row.qty.quantity}${row.qty.unit}` : '';
        },
        filterFunction: (value, search) => {
          return value.quantity && value.unit &&
            `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
      loc: {
        title: '位置',
        type: 'string',
        valuePrepareFunction: (loc, row) => {
          return row.loc ? row.loc.name : '';
        },
        filterFunction: (value, search) => {
          return value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
      status: {
        title: '状态',
      },
      opState: {
        title: '操作状态',
      },
    };
  }

  onDelete(event): void {
    this.service.deleteMsubLot(event).subscribe(() => {
    });
  }

  ngOnInit() {
    //初始化过滤条件
    this.searchModel.opState = '';
    this.mtree = GlobalData.mtree;
    this.pService.getPersonsProfileBy({ 'pclass.oid': { $regex: `${UtilData.txtMolder}` } }).subscribe(ps => {
      this.ptree = this.pService.newPersonTree(ps);
    });
    // this.service.getMsubLotsProfile().subscribe(msls => {
    //   this.msublots = msls;
    //   // this.SocketService.syncUpdates('thing', this.awesomeThings);
    // });
  }

  search(): void {
    let query = {};
    if (this.searchModel.oid) {
      query['oid'] = { $regex: this.searchModel.oid };
    }
    if (this.searchModel.molder) {
      query['molder.oid'] = this.searchModel.molder.oid;
    }
    if (this.searchModel.mdef) {
      query['mdef.oid'] = this.searchModel.mdef.oid;
    }
    if (this.searchModel.opState) {
      query['opState'] = this.searchModel.opState;
    }
    console.log(query);
    this.service.getMsubLotsProfileBy(query).subscribe(msls => {
      this.msublots = msls;
    });
  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

}
