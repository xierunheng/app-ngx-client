import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as jsonpatch from 'fast-json-patch';
import { LocalDataSource } from 'ng2-smart-table';

import { GlobalData } from '../../../../@core/model/global';
import { IQuantity } from '../../../../@core/model/common';
import { UtilData, IDCmpFn, OIDCmpFn, WorkData, TableSettings, winSize } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';

import { NbDialogRef } from '@nebular/theme';

import { OpSchedule, IOpSchedule } from '../../../../@core/model/op-schedule';
import { OpScheduleService } from '../../../../@core/data/op-schedule.service';
import { OpRequest } from '../../../../@core/model/op-req';
import { OpRequestService } from '../../../../@core/data/op-req.service';
import { IOpDefElite } from '../../../../@core/model/op-def';
import { OpDefService } from '../../../../@core/data/op-def.service';

@Component({
  selector: 'mes-op-schedule-info',
  templateUrl: './op-schedule-info.component.html',
  styleUrls: ['./op-schedule-info.component.scss']
})
export class OpScheduleInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's OpScheduleSchema
  @Input() model: IOpSchedule = new OpSchedule();
  modelObserver: any;

  // array of OpDefinition
  ods: IOpDefElite[];

  //界面配置接口
  //vConfig: ViewConfig;



  qty: IQuantity;
  // opType 的可选项
  opTypes: string[] = WorkData.opTypes;

  //reqState （请求状态）的可选项
  reqStates: string[] = WorkData.reqStates;

  //hs 的比较函数
  idCmpFn = IDCmpFn;

  //布产可选类型
  scheduleTypes: string[] = ['按物料布产', '按订单布产', '按设备布产', '按维护布产'];

  get orUrl(): string {
    if (this.model) {
      if (this.model.opType === WorkData.opTypes[0]) {
        return './opreqlot/';
      } else if (this.model.opType === WorkData.opTypes[3]) {
        return './opreqorder/';
      } else if (this.model.opType === WorkData.opTypes[2]) {
        return './opreqequip/';
      } else if (this.model.opType === WorkData.opTypes[1]) {
        return './opreqalert/';
      }
    } else {
      return './opreqlot/';
    }
  }

  orColunms = {
    oid: {
      title: 'ID',
      type: 'string',
    },
    desc: {
      title: '报警信息',
      type: 'string',
    },
    equip: {
      title: '设备',
      type: 'string',
      valuePrepareFunction: (equipment, row) => {
          return row.equipment ? `${row.equipment.oid} [${row.equipment.name}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
    },
    reqState: {
      title: '请求状态',
      type: 'string'
    }
  };

  get hstree() {
    return GlobalData.hstree;
  }

  /**
   * [是更新，修改的操作]
   * @return {boolean} [description]
   */
  // get isUpdate(): boolean {
  //   return this.vConfig.type === UtilData.txtUpdateType;
  // }
   isUpdate: boolean = false;

   ssize: string;

  /**
   * [可布产]
   * @return {boolean} [description]
   */
  get releasable(): boolean {
    return this.model.scheduleState === WorkData.reqStates[0] && this.isUpdate;
  }

  /**
   * [可撤销布产]
   * @return {boolean} [description]
   */
  get unreleasable(): boolean {
    return this.model.scheduleState === WorkData.reqStates[1];
  }

  /**
   * [可插单布产]
   * 当前工单已经布产了，但是有插入了新的物料批次
   * @return {boolean} [description]
   */
  get insertReleasable(): boolean {
    return this.model.scheduleState === WorkData.reqStates[1] &&
      this.model.opReq.findIndex(or => or.reqState === WorkData.reqStates[0]) > -1;
  }

  constructor(private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private location: Location,
    private service: OpScheduleService,
    private oprService: OpRequestService,
    private odService: OpDefService,
    protected ref: NbDialogRef<OpScheduleInfoComponent>) {
  }

  ngOnInit() {
    this.odService.getOpDefinitionsElite().subscribe(ods => {
      this.ods = ods;
    });
    if ( this.model.oid ) {
      this.isUpdate = true;
    }

     //根据高度大小确定弹窗的大小
    this.ssize = winSize();
  }

	/**
	 * [根据操作定义，默认替换 布产类型，也可以自主选择]
	 * @param {[type]} event [description]
	 */
  onOpDefChange(event) {
    this.odService.getOpDefinition(this.model.opDef._id).subscribe(od => {
      this.model.hs = od.hs;
      this.model.opType = od.opType;
    })
  }

	/**
 * [ng2-smart-table's delete event]
 * @param {[type]} event [description]
 */
  onDelete(event): void {
    this.oprService.deleteOpRequest(event).subscribe(() => {
    });
  }

  /**
   * [撤销布产操作，首先判断该操作能不能撤销布产，
   * 然后，提示撤销到后果，
   * 最后，撤销成功后，提示‘成功’，并重新加载 opreq ]
   */
  onUnRelease(): void {
    if (this.model.opPerf && this.model.opPerf.state !== WorkData.WorkStates.Ready.text) {
      window.alert('该操作计划已经开始执行，不能 撤销布产 ！');
    } else {
      if (window.confirm('撤销布产后，相关的作业内容，操作响应将一并删除，是否继续？')) {
        this.service.unrelease(this.model._id)
          .subscribe(item => {
            window.alert('撤销布产维护计划成功！');
            this.model = new OpSchedule(item);
          }, err => {
            window.alert(err);
          });
      }
    }
  }

  /**
   * [布产操作，]
   */
  onRelease(): void {
    if (window.confirm(`即将布产[${this.model.oid}]维护计划，是否继续？`)) {
      this.service.updateOpSchedule(this.model).subscribe(ops => {
        this.service.release(this.model._id).subscribe(item => {
          window.alert('维护计划布产成功！');
          this.model = new OpSchedule(item);
        }, err => {
          window.alert(err);
        });
      });

    }
  }

  /**
   * [插单布产，该布产单已经发布了，临时需要插入新的物料批次]
   */
  onInsertRelease(): void {
    let insertOprs: string = this.model.opReq
      .filter(opr => opr.reqState === WorkData.reqStates[0])
      .map(opr => opr.oid)
      .join(',');
    if(insertOprs != '' && window.confirm(`即将插单布产[${insertOprs}]维护计划，是否继续？`)) {
      this.service.updateOpSchedule(this.model).subscribe(ops => {
        this.service.insertRelease(this.model._id).subscribe(item => {
          window.alert('插单布产成功！');
          this.model = new OpSchedule(item);
        }, err => {
          window.alert(err);
        });
      });

    }
  }


  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

  // onSubmit(value: any): void {
  //   if (this.vConfig.type === UtilData.txtUpdateType) {
  //     this.service.updateOpSchedule(this.model).subscribe(item => {
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     });
  //   } else if (this.vConfig.type === UtilData.txtCreateType) {
  //     this.service.createOpSchedule(this.model).subscribe(item => {
  //       this.router.navigate(['../', item._id], { relativeTo: this.route });
  //     });
  //   }
  // }
}
