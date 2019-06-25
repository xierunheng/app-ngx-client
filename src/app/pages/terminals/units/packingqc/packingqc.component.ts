import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';

import * as _ from 'lodash';

import { GlobalData } from '../../../../@core/model/global';
import { UtilData, WorkData, MaterialData } from '../../../../@core/data/util.service';
import { IQuantity, Quantity } from '../../../../@core/model/common';
import { IJobOrder, JobOrder } from '../../../../@core/model/job-order';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { Terminal } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';

@Component({
  selector: 'mes-packingqc',
  templateUrl: './packingqc.component.html',
  styleUrls: ['../pad.scss','./packingqc.component.scss']
})
export class PackingQCComponent implements OnInit {
  @Output() update = new EventEmitter<any>();

  title: string = MaterialData.BodyOps.pqc.name;

  //扫码操作的Model
  model: Terminal = new Terminal();

  op: string = MaterialData.BodyOps.pqc.text;

  tag: string = UtilData.txtTags[4];

  //当前终端的状态，用于界面的呈现
  tState: string = UtilData.terminalStates[0];

  //扫码枪的扫码内容
  strBody: string;

  //本次登陆完成的总数
  totallast: number = 0;

  //待开工工单列表
  jos: IJobOrder[];

  constructor(private service: MsubLotService,
    private joService: JobOrderService,
    private jrService: JobResponseService) {
    this.model.oplog.op = this.op;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.model.initByUser(user);
    }
  }

  ngOnInit() {
    //1. 根据 工位/状态/工序名 查看正在执行的工单
    //1.1 如果有正在执行的工单，直接赋值操作；
    //1.2 如果没有正在执行的工单，根据 工序名/状态 查看准备执行的工单
    //1.2.1 如果有当天未开工的工单，直接赋值，等待开工
    //1.2.2 若果没有当天的工单，选择 可选工单的第一个工单
    this.jrService.getJobProfileBy({
      'hs.name': this.model.oplog.hs.name,
      'directive.proseg.oid': this.title,
      'state': WorkData.WorkStates.Running.text
    }).subscribe(job => {
      if (job) {
        // this.model.jobOrder = jobOrder;
        // this.model.jo = new JobOrder(jobOrder.jo);
        // this.model.jr = new JobResponse(jobOrder.jr);
      } else {
        this.joService.getJobOrdersBy({
          'master.proseg.oid': this.title,
          'jobResponse.state': WorkData.WorkStates.Ready.text
        }).subscribe(jos => {
          this.jos = jos;
          if (this.jos && this.jos.length > 0) {
            // let jo = this.model.jobToday(this.jos) || this.jos[0];
            // this.model.jo = new JobOrder(jo);
          }
        });
      }
    });
  }

  onOidChange(event): void {
    if (event.endsWith('\n')) {
      this.strBody = event;
      let oids = this.strBody.split('\n').filter(item => item !== '');
      // this.model.oids = oids.slice(oids.length - 1, oids.length);
      this.model.msublot.oid = _.last(oids);
      // this.totalall = this.totallast + this.jr.oids.length;
      this.service.op(this.model.getElite(this.op))
        .subscribe(item => {
          this.update.emit(this.model.msublot.oid);
        });
    }
  }

}
