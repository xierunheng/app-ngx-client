import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {
  UtilData,
  TableSettings, WorkData
} from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';
import { IOpRequest, IOpRequestProfile } from '../../../../@core/model/op-req';
import { OpRequestService } from '../../../../@core/data/op-req.service';
import { WorkRequest } from '../../../../@core/model/work-req';
import { WorkRequestService } from '../../../../@core/data/work-req.service';
import * as moment from 'moment';

@Component({
  selector: 'mes-op-req',
  templateUrl: './op-req.component.html',
  styleUrls: ['./op-req.component.scss']
})
export class OpReqComponent implements OnInit {
  opreq: IOpRequestProfile[];
  //界面配置接口
  vConfig: ViewConfig;

  columns = {
    oid: {
      title: 'ID',
      type: 'string',
    },
    desc: {
      title: '描述',
      type: 'string',
    },
    opType: {
      title: '操作类型',
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
    opDef: {
      title: '操作定义',
      type: 'string',
      valuePrepareFunction: (opDef, row) => {
        return row.opDef ? row.opDef.oid + '-' + row.opDef.ver : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.ver &&
          `${value.oid}-${value.ver}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    startTime: {
      title: '计划起时',
      type: 'string',
      valuePrepareFunction: (startTime, row) => {
        return row.startTime ? moment(row.startTime).format('YYYY-MM-DD') : '';
      },
    },
    endTime: {
      title: '计划终时',
      type: 'string',
      valuePrepareFunction: (endTime, row) => {
        return row.endTime ? moment(row.endTime).format('YYYY-MM-DD') : '';
      },
    },
    mdef: {
      title: '物料定义',
      type: 'string',
      valuePrepareFunction: (mlot, row) => {
        return row.mlot ? row.mlot.mdef.oid : '';
      },
    },
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (mlot, row) => {
        return row.mlot ? `${row.mlot.qty.quantity}${row.mlot.qty.unit}` : '';
      },
    },
    priority: {
      title: '优先级',
      type: 'number',
    },
    reqState: {
      title: '计划状态',
      type: 'string',
    },
    workReq: {
      title: '作业请求',
      type: 'html',
      valuePrepareFunction: (workReq, row) => {
        return row.workReq && row.workReq.length > 0 ? row.workReq.map(item => `<a href="/#/pages/works/workreq/${item._id}" routerLinkActive="active">${item.oid}</a>`).join(',') : '';
      },
      filterFunction: (value, search) => {
        return value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
      }
    },
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: OpRequestService,
    private wrService: WorkRequestService) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.vConfig = ViewConfig.create(data.config);
      let query = {};
      query = {'opType':'Maintenance'};
      this.service.getOpRequestsProfileBy(query).subscribe(ors => {
        this.opreq = ors;
      });
    });
  }

  onDelete(event): void {
    this.service.deleteOpRequest(event).subscribe(() => {
    });
  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }

}
