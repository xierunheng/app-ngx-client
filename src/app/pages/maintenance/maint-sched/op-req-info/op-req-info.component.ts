import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogRef } from '@nebular/theme';
import { GlobalData } from '../../../../@core/model/global';
import { UtilData, IDCmpFn, OIDCmpFn, WorkData, TableSettings, winSize } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';

import { IOpRequest, OpRequest } from '../../../../@core/model/op-req';
import { OpRequestService } from '../../../../@core/data/op-req.service';
import { IOpDefElite } from '../../../../@core/model/op-def';
import { OpDefService } from '../../../../@core/data/op-def.service';
//import { MmodalComponent } from '../../../ui-custom/modals';

@Component({
  selector: 'mes-op-req-info',
  templateUrl: './op-req-info.component.html',
  styleUrls: ['./op-req-info.component.scss']
})
export class OpReqInfoComponent implements OnInit {

  // array of OpDefinition
  ods: IOpDefElite[];

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's OpRequestSchema
  @Input() model: IOpRequest = new OpRequest();
 // modelObserver: any;

  //界面配置接口
 // vConfig: ViewConfig;

  //reqState （请求状态）的可选项
  reqStates: string[] = WorkData.reqStates;

  //hs 的比较函数
  idCmpFn = IDCmpFn;

  isUpdate: boolean = false;
  ssize: string;

 // imodal = MmodalComponent;

  sRColunms = {
    oid: {
      title: '名称',
      type: 'string',
    },
    earliestSTime: {
      title: '最早起时',
      type: 'string',
      valuePrepareFunction: (earliestSTime, row) => {
        return row.earliestSTime ? new Date(row.earliestSTime).toLocaleDateString('zh', UtilData.shortDateOpt) : '';
      },
    },
    latestETime: {
      title: '最晚终时',
      type: 'string',
      valuePrepareFunction: (latestETime, row) => {
        return row.latestETime ? new Date(row.latestETime).toLocaleDateString('zh', UtilData.shortDateOpt) : '';
      },
    },
    segState: {
      title: '段计划状态',
      type: 'string',
    },
    jobOrder: {
      title: '工单计划',
      type: 'html',
      valuePrepareFunction: (jobOrder, row) => {
        return row.jobOrder ?
          `<a href="/#/pages/works/joborder/${row.jobOrder._id}" routerLinkActive="active">${row.jobOrder.oid}</a>` : '';
      },
    },
  };

  sRurl = 'segreq';

  get hstree() {
    return GlobalData.hstree;
  }

  get releasable() {
    return this.model.reqState === WorkData.reqStates[0] && this.isUpdate === true;
  }

  get unreleasable() {
    return this.model.reqState === WorkData.reqStates[1];
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: OpRequestService,
    private odService: OpDefService,
    protected ref: NbDialogRef<OpReqInfoComponent>) {
  }

  ngOnInit(): void {

     //根据高度大小确定弹窗的大小
    this.ssize = winSize();

    this.odService.getOpDefinitionsElite().subscribe(ods => {
      this.ods = ods;
      //通过route的data区分新建数据和修改数据
    });
    if ( this.model.oid ) {
      this.isUpdate = true;
    }
  }

  /**
   * 根据 名称 和 操作定义 的信息在，自动补齐相关信息
   */
  syncOpReq(): void {
    if (this.isUpdate == false) {
      if (this.model.oid && this.model.opDef) {
        this.odService.getOpDefinition(this.model.opDef._id)
          .subscribe(item => {
            this.model.DeriveFromOpDef(item);
            //这里需要用new， Object.assign只是赋值可枚举的量，函数时不会赋值的，所以这里需要注意
            // this.model = new OpRequest(this.model);
          });
      }
    }
  }

  onOidChange(event): void {
    this.syncOpReq();
  }

  onOpDefChange(event): void {
    this.syncOpReq();
  }

  /**
   * [撤销布产操作，首先判断该操作能不能撤销布产，
   * 然后，提示撤销到后果，
   * 最后，撤销成功后，提示‘成功’，并重新加载 opreq ]
   */
  onUnRelease(): void {
    if (this.model.opRes.state !== WorkData.WorkStates.Ready.text) {
      window.alert('该操作计划已经开始执行，不能 撤销布产 ！');
    } else {
      if (window.confirm('撤销布产后，相关的作业内容，操作响应将一并删除，是否继续？')) {
        this.service.unrelease(this.model._id)
          .subscribe(item => {
            window.alert('撤销布产成功！');
            this.model = new OpRequest(item);
          }, err => {
            window.alert(err);
          });
      }
    }
  }

  onRelease(): void {
    if (window.confirm(`即将布产[${this.model.oid}]操作计划，是否继续？`)) {
      this.service.release(this.model._id).subscribe(item => {
        window.alert('订单布产成功！');
        this.model = new OpRequest(item);
      }, err => {
        window.alert(err);
      });
    }
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }
}
