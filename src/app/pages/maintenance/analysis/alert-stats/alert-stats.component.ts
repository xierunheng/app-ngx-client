import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';
import { GlobalData } from '../../../../@core/model/global';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { HsService } from '../../../../@core/data/hs.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as jsonpatch from 'fast-json-patch';
import { unitOfTime } from 'moment';
//import { WorkAlert } from '../../../../@core/model/work-alert';
import { UtilData, IDCmpFn, TableSettings } from '../../../../@core/data/util.service';
import { WorkAlertService } from '../../../../@core/data/work-alert.service';
import {IWorkAlert} from '../../../../@core/model/work-alert';

@Component({
  selector: 'alert-stats',
  templateUrl: './alert-stats.component.html',
  styleUrls: ['./alert-stats.component.scss']
})
export class AlertStatsComponent implements OnInit {

  /**
   * [选择的hs]
   * @type {IHierarchyScope}
   */
  hs: IHierarchyScope;

  get hstree() {
    return GlobalData.hstree;
  }

  WorkAlert: IWorkAlert[];

 // model: WorkAlert;
  //查询周期
  period: string = 'month';

  //可能从查询周期
  periods: any[] = [{
    name: '按年',
    value: 'year',
  },{
    name: '按月',
    value: 'month',
  }, {
    name: '按周',
    value: 'week',
  }, {
    name: '按天',
    value: 'date',
  }];

  //统计开始时间
  startTime: Date = new Date('1970-01-01 00:00');
  //统计结束时间
  endTime: Date = new Date();

  //周期时间
  periodTime: Date;
  pd: number;
  pdy: number;

  //故障总数
  total: number;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //故障Top3
  alerts: any[];
  //发生故障的设备Top3
  alertequips: any[];
  //图表故障Top3横坐标显示的内容：
  Checkoid1: string = "messageText";
  //图表发生故障的设备Top3横坐标显示的内容：
  Checkoid2: string = "equipment";

  alertcolumns = {
    // oid: {
    //   title: '故障ID',
    //   type: 'string',
    // },
    messageText: {
      title: '故障信息',
      type: 'string',
    },
    // equipment: {
    //   title: '设备名称',
    //   type: 'string',
    // },
    count: {
      title: '故障数量',
      type: 'string',
    },
  }

  aequipcolumns = {
    equipment: {
      title: '设备名称',
      type: 'string',
    },
    count: {
      title: '故障数量',
      type: 'string',
    },
  }

  constructor(private location: Location,
    private Service: WorkAlertService,
    private hsService: HsService,
    private _router: Router) {
  }

  ngOnInit() {
    this.pdy = new Date().getFullYear();
    // this.pdy = moment(new Date()).year();
    // console.log("年",this.pdy);
    //默认统计上一个月的故障
    this.pd = new Date().getMonth();
    this.pd = (this.pd == 0)?(12):(this.pd);
    this.periodTime = new Date(this.pdy, this.pd, 0);
    this.startTime = moment(this.periodTime).startOf(this.period as unitOfTime.StartOf).toDate();
    this.endTime = moment(this.periodTime).endOf(this.period as unitOfTime.StartOf).toDate();

    console.log(this.hstree);
    GlobalData.hss$.subscribe(hss => {
      this.hs = hss[0];
      this.init();
    })

    this.aggrAlert();
  }

  init(): void {
    if (this.hs && this.startTime && this.endTime) {
      let hsPath = this.hsService.getCurrPath(this.hs);
    }
  }

  //报警查询
  aggrAlert(): void {
    let query = {};
     query['category'] = '设备故障报警';
    let group = ['messageText', 'category'];
    this.Service.aggrAlertTimely(this.hs, this.startTime.toString(), this.endTime.toString(),group,query).subscribe(items => {
      console.log(items);
     // this.alerts = items;
      this.alerts = this.DesSort(items);
      this.total = this.calcTotal(items);
    });

    let group2 = ['equipment', 'category'];
    this.Service.aggrAlertTimely(this.hs, this.startTime.toString(), this.endTime.toString(),group2,query).subscribe(items => {
   //   this.alertequips = items;
      this.alertequips=this.DesSort(items);
    });
  }

  /**
   * [hs发生变化时，所有的数据都要联动发生变化]
   * @param {[type]} event [description]
   */
  onHsChange(event) {
 //   console.log(this.hs);
    this.init();
  }

  onPeriodTimeChange(event) {
    this.periodTime = event;
    if (event) {
      this.startTime = moment(this.periodTime).startOf(this.period as unitOfTime.StartOf).toDate();
      this.endTime = moment(this.periodTime).endOf(this.period as unitOfTime.StartOf).toDate();
    }
  }

  onSubmit(value) {
    this.aggrAlert();
  }

  //查询结果降序排列，并获取前3条记录
  DesSort(items:any){
    //降序
    items.sort(function(a,b){return b.count - a.count;})
    //获取前3条记录
    let results = [];
    if(items.length > 3){
      for(let i=0; i<3; i++){
        results.push(items[i]);
      }
      return results;
    } else {
      return items;
    }
  }

  calcTotal (items) {
    let a =0 ;
    _.forOwn(_.groupBy(items, 'category'), (value, key) => {
      value.forEach(va => a = a + va.count);
    })
     return a;
  }

}
