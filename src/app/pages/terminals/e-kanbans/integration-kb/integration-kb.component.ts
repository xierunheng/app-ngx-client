import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';


import { GlobalData } from '../../../../@core/model/global';
import { IHierarchyScope } from '../../../../@core/model/hs';

import { IProsegElite } from '../../../../@core/model/proseg';
import { HsService } from '../../../../@core/data/hs.service';
import { OpDefService } from '../../../../@core/data/op-def.service';

import { IJobResponse, BarData, EchartBar, EchartData, IJob } from '../../../../@core/model/job-response';
import { IJobOrder } from '../../../../@core/model/job-order';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';

import { MsubLotService } from '../../../../@core/data/msublot.service';


@Component({
  selector: 'mes-integration-kb',
  templateUrl: './integration-kb.component.html',
  styleUrls: ['./integration-kb.component.scss']
})
export class IntegrationKbComponent implements OnInit {
  /**
     * [选择的hs]
     * @type {IHierarchyScope}
     */
  hs: IHierarchyScope;

  get hstree() {
    return GlobalData.hstree;
  }
  /**
   * [生产过程的结束时间]
   * @type {Date}
   */
  endTime: Date = moment().subtract(1, 'month').toDate();

  /**
   * [过去一个月的其实时间]
   * @type {Date}
   */
  monthStartTime: Date = moment(this.endTime).subtract(1, 'month').toDate();

  /**
   * [过去一周的起始时间]
   * @param {[type]} ).subtract(1, 'week').toDate( [description]
   */
  weekStartTime: Date = moment(this.endTime).subtract(1, 'week').toDate();


	/**
	 * [设备轮询周期]
	 * @type {number}
	 */
  interval: number = 60 * 1000;
 // interval: number = 3600 * 1000;

  /**
   * [jobOrder response]
   * @type {JobResponse}
   */
  jr: IJobResponse;

  /**
   * [jobOrder order]
   * @type {JobOrder}
   */
  jo: IJobOrder;

  /**
   * [一个月的工单数据]
   * @type {any[]}
   */
  jrsMonth: any[];

  /**
   * [一周的工单数据]
   * @type {any[]}
   */
  jrsWeek: any[];

  /**
   * [质量的月度数据]
   * @type {any[]}
   */
  qcsMonth: any[];

  /**
   * [质量的周度数据]
   * @type {any[]}
   */
  qcsWeek: any[];

  /**
   * [质量的日数据]
   * @type {any[]}
   */
  qcsDay: any[];


  /**
   * [缺陷项的月度数据]
   * @type {any[]}
   */
  reasonsMonth: any[];

  /**
   * [缺陷项的周度数据]
   * @type {any[]}
   */
  reasonsWeek: any[];

  /**
   * [缺陷项的日数据]
   * @type {any[]}
   */
  reasonsDay: any[];

  /**
   * [设备的月度数据]
   * @type {any[]}
   */
  equipsMonth: any[];

  /**
   * [设备的周度数据]
   * @type {any[]}
   */
  equipsWeek: any[];

  mdef:string[];


  constructor(private joService: JobOrderService,
              private jrService: JobResponseService,
              private mslService: MsubLotService) { }

  ngOnInit() {
    this.mdef = ['1601', '1610','1626','1712'];
    console.log('mdef',this.mdef)



    this.joService.getJobOrderNo404({ oid: 'XP19040401' }).subscribe(jo => {
      if (jo) {
   //     console.log('jo', jo.mReq);
        this.jo = jo;
        //以下代码为筛选 指定4个型号坯体
        let r = jo.mReq;
        let q = [];
        if( r && r.length >0 ) {
          r.forEach(item => {
            switch (item.mdef.oid) {
            case '1601':
            case '1610':
            case '1626':
            case '1712':
              q.push(item);
              break;
            default:
              break;
            }
          })
          this.jo.mReq = q;
        }

 //       console.log('this.jo',this.jo);

        this.jrService.searchJobResponses({ oid: 'XP19040401' }, '_id oid mAct.oid mAct.mdef mAct.subLot mAct.qty reasons.oid ').subscribe(jrs => {
          if(jrs && jrs.length > 0) {
     //       console.log('jrs[0]',jrs[0]);
            this.jr = jrs[0];
            //以下代码为筛选 指定4个型号坯体
            let jr = jrs[0].mAct;
            let j=[];
            if(jr && jr.length > 0){
              jr.forEach(item => {
                switch (item.mdef.oid) {
                  case '1601':
                  case '1610':
                  case '1626':
                  case '1712':
                    j.push(item);
                    break;
                  default:
                    break;
                }
              })
            }
            this.jr.mAct = j;
   //         console.log('jr内', this.jr);
          }
        })
      }
    })

    this.jrService.searchJobResponsesEncode({
      // hs: this.hs,
      startTime: this.monthStartTime,
      endTime: this.endTime,
      'directive.proseg.oid': '修坯'
    }, '-mAct -oplog', 'oid').subscribe(items => {
      this.jrsMonth = items;
 //     console.log('jrsMonth',this.jrsMonth);
      this.jrsWeek = items.slice(-7);
 //     console.log('jrsWeek',this.jrsWeek);
    })

  // 月质量数据查询
    // this.startTime = moment("2019-05-10", "YYYY-MM-DD").subtract(1, 'month').toDate();
    // this.endTime = moment("2019-05-10", "YYYY-MM-DD").toDate();

    this.mslService.aggregate('qcTime', {count: 1}, {
      startTime: this.monthStartTime,
      endTime: this.endTime,
    }, {
      //year: 'qcTime',
      month: 'qcTime',
      //week: 'qcTime',
      dayOfMonth: 'qcTime',
      qcState: 'qcState',
      //reason: 'reason.oid',
    }).subscribe(items => {
        if (items.length > 0){this.qcsMonth = items;};
    });

    this.mslService.aggrQCTimely(this.monthStartTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
      .subscribe(items => {
        if (items.length > 0){this.reasonsMonth = items;};
    });

  // 周质量数据查询
    // this.startTime = moment("2019-05-10", "YYYY-MM-DD").subtract(1, 'month').toDate();
    // this.endTime = moment("2019-05-10", "YYYY-MM-DD").toDate();

    this.mslService.aggregate('qcTime', {count: 1}, {
      startTime: this.weekStartTime,
      endTime: this.endTime,
    }, {
      // year: 'qcTime',
      //month: 'qcTime',
      week: 'qcTime',
      dayOfWeek: 'qcTime',
      qcState: 'qcState',
      //reason: 'reason.oid',
    }).subscribe(items => {
        if (items.length > 0){this.qcsWeek = items;};
    });
    this.mslService.aggrQCTimely(this.weekStartTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
      .subscribe(items => {
       if (items.length > 0){this.reasonsWeek = items;};
    });

  // 日质量数据查询
    let day_startTime = moment("2019-05-10", "YYYY-MM-DD").subtract(1, 'day').toDate();
    let day_endTime = moment("2019-05-10", "YYYY-MM-DD").toDate();

    let groups: string[] = ['qcState'];
    this.mslService.aggrQCTimely(day_startTime.toString(), day_endTime.toString(), groups)
      .subscribe(items => {
        if (items.length > 0){this.qcsDay = items;};
    });
    this.mslService.aggrQCTimely(day_startTime.toString(), day_endTime.toString(), ['reason'], {}, 'reason')
      .subscribe(items => {
        console.log(items);
        if (items.length > 0){this.reasonsDay = items;};
      });
  }

}
