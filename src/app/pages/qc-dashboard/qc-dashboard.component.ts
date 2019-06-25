import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtilData, IDCmpFn, TableSettings } from '../../@core/data/util.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';
import { GlobalData } from '../../@core/model/global';
import { unitOfTime } from 'moment';
import { MsubLotService } from '../../@core/data/msublot.service';
import { MdefService } from '../../@core/data/mdef.service';
import { PersonService } from '../../@core/data/person.service';
import { IMsubLot, MsubLot, IMsubLotProfile } from '../../@core/model/msublot';
import { BarData, EchartBar, EchartBarData } from '../../@core/model/job-response';
import { OptionSet } from '../../@core/model/echart';

@Component({
  selector: 'mes-qc-dashboard',
  templateUrl: './qc-dashboard.component.html',
  styleUrls: ['./qc-dashboard.component.scss']
})
export class QcDashboardComponent implements OnInit {

  /**
   * [查询所用的model]
   * 任何的查询条件，都在这里组织
   * @type {IMsubLot}
   */
  searchModel: IMsubLot = new MsubLot();

  //查询周期
  period: string = 'month';

  total: number = 0;

  //可能从查询周期
  periods: any[] = [{
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
  startTime: Date = new Date('1970-01-01');
  //统计结束时间
  endTime: Date = new Date();
  //周期时间
  periodTime: Date;

  //成型工下拉可选项
  ptree: TreeviewItem[];

  // tree of Mdef, with Mclass
  mtree: TreeviewItem[];

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  qcs: any[];
  qccolumns = {
    molder: {
      title: '成型工',
      type: 'string',
    },
    mdef: {
      title: '型号',
      type: 'string',
    },
    total: {
      title: '总数',
      type: 'number',
    },
    Defective: {
      title: '有缺陷',
      type: 'number',
    },
    Checked: {
      title: '优等品',
      type: 'number',
    },
    NG: {
      title: '等外品',
      type: 'number',
    },
    OK: {
      title: '再检优等品',
      type: 'number',
    },
    Scraped: {
      title: '已报废',
      type: 'number',
    },
    Idle: {
      title: '已停滞',
      type: 'number',
    },
  };

  qc_statistics: any[];
  qc_statistics_columns = {
    total: {
      title: '总数',
      type: 'number',
    },
    rate_Checked: {
      title: '优等品率',
      type: 'string',
    },
    rate_Passed: {
      title: '合格率',
      type: 'string',
    },
    rate_Idle: {
      title: '停滞率',
      type: 'string',
    },
    rate_Scraped: {
      title: '报废率',
      type: 'string',
    },
    Defective: {
      title: '有缺陷',
      type: 'number',
    },
    Checked: {
      title: '优等品',
      type: 'number',
    },
    NG: {
      title: '等外品',
      type: 'number',
    },
    OK: {
      title: '再检优等品',
      type: 'number',
    },
    Scraped: {
      title: '已报废',
      type: 'number',
    },
    Idle: {
      title: '已停滞',
      type: 'number',
    },
  };

  //缺陷统计情况
  reason_Statistics: EchartBarData;

  reasons: any[];

  rcolumns = {
//    qcState: {
//      title: '质检结果',
//      type: 'string',
//    },
    reason: {
      title: '缺陷项',
      type: 'string',
    },
    count: {
      title: '数量',
      type: 'number',
    },
    sum: {
      title: '缺陷累加',
      type: 'number',
    },
    rate: {
      title: '缺陷占比',
      type: 'number',
    },
    rate_Sum: {
      title: '缺陷占比累加',
      type: 'number',
    },
  };

  // 局部echart样式
  optionSet= new OptionSet();


  constructor(private location: Location,
    private mslService: MsubLotService,
    private pService: PersonService,
    private mService: MdefService) { }

  ngOnInit() {
    //初始化过滤条件
    this.mService.getMdefsBy().subscribe(ms => {
      this.mtree = this.mService.newMdefTree(ms);
    });
    //this.mtree = GlobalData.mtree;
    console.log(this.mtree);
    this.pService.getPersonsProfileBy().subscribe(ps => {
      this.ptree = this.pService.newPersonTree(ps);
    });
  }

  onPeriodTimeChange(event) {
  //  console.log(event);
    this.periodTime = event;
    if (event) {
      this.startTime = moment(this.periodTime).startOf(this.period as unitOfTime.StartOf).toDate();
      this.endTime = moment(this.periodTime).endOf(this.period as unitOfTime.StartOf).toDate();
    }
  }

  calcQcs(items: any) {
    let statistics: any = {
      total: 0,
      Defective: 0,
      Checked: 0,
      NG: 0,
      OK: 0,
      Scraped: 0,
      Idle: 0,
      rate_Checked: '',
      rate_Passed: '',
      rate_Idle: '',
      Rate_Scraped: '',
    };
    this.qcs = [];
    this.qc_statistics = [];
    _.forOwn(_.groupBy(items, 'molder'), (value, key) => {
      _.forOwn(_.groupBy(value, 'mdef'), (mvalue, mkey) => {
        let qc: any = {
          molder: mvalue[0].molder,
          mdef: mvalue[0].mdef,
          total: mvalue.map(mv => mv.count).reduce((prev, curr) => prev + curr),
          Defective: 0,
          Checked: 0,
          NG: 0,
          OK: 0,
          Scraped: 0,
          Idle: 0,
        };
        mvalue.forEach(mv => qc[mv.qcState] = mv.count);
        this.qcs.push(qc);
        statistics.total = statistics.total + qc.total;
        statistics.Checked = statistics.Checked + qc.Checked;
        statistics.Defective = statistics.Defective + qc.Defective;
        statistics.NG = statistics.NG + qc.NG;
        statistics.OK = statistics.OK + qc.OK;
        statistics.Scraped = statistics.Scraped + qc.Scraped;
        statistics.Idle = statistics.Idle + qc.Idle;
      });
    });
    statistics.total=statistics.total-statistics.Idle;
    if (statistics.total) {
      statistics.rate_Checked = ((statistics.Checked/statistics.total)*100).toFixed(2);
      statistics.rate_Scraped = ((statistics.Scraped/statistics.total)*100).toFixed(2);
      statistics.rate_Passed = (((statistics.Checked+statistics.OK+statistics.NG)/statistics.total)*100).toFixed(2);
      statistics.rate_Idle = ((statistics.Idle/statistics.total)*100).toFixed(2);
    }
    this.qc_statistics.push(statistics);
  }

  calcReasoncs(items: any) {
    this.reasons=[];
    this.total = items.map(mv => mv.count).reduce((prev, curr) => prev + curr);//累积总数
//    this.reasons = _.orderBy(items, ['count'], ['desc']); //倒叙排序

    let reason_temp: any[] = _.orderBy(items, ['count'], ['desc']); //倒叙排序

    if (this.total){
      let count_sum: number  = 0;
      _.forEach(reason_temp, (value, key)=>{
        count_sum = value.count + count_sum;
//        console.log(value);
        let reason: any = {
          reason: value.reason,
          count: value.count,
          sum: count_sum,
          rate: ((value.count/this.total)*100).toFixed(2),
          rate_Sum: ((count_sum/this.total)*100).toFixed(2),
        };
 //       console.log(reason);
        this.reasons.push(reason);
      });
    }

    this.optionSet.options = {
      yAxis: [
          {
              type: 'value',
              name: '数量',
              nameTextStyle:{
                fontSize :this.optionSet.fontSize-5,
              },
              // min: 0,
              // max: 25,
              position: 'left',
              axisLine: {
                  // lineStyle: {
                  //     color: colors[2]
                  // }
              },
              axisLabel: {
                  formatter: '{value}个',
                  fontSize:this.optionSet.fontSize,
              }
          },
          {
              type: 'value',
              name: '占比',
              min: 0,
              max: 100,
              splitLine:{show:false},
              position: 'right',
              nameTextStyle:{
                fontSize :this.optionSet.fontSize-5,
              },
              axisLine: {
                  // lineStyle: {
                  //     color: colors[0]
                  // }
              },
              axisLabel: {
                  formatter: '{value} %',
                  fontSize:this.optionSet.fontSize,

              }
          },

      ],

    };
    this.reasons = _.take(this.reasons,5); //取前五
    console.log(this.reasons);
    this.reason_Statistics = {
      titleText: '缺陷帕累托图',
      legendData: ['数量','占比'],
      xData: this.reasons.map(item => item.reason),
      series: [{
        name: '数量',
        type: 'bar',
        barWidth: '40%',
        itemStyle: { normal: { label: { show: true, position: 'top' } } },
        data: this.reasons.map(item => item.count)
      },
      {
        name: '占比',
        type: 'line',
        barWidth: '40%',
        yAxisIndex: 1,
        itemStyle: { normal: { label: { show: true, position: 'bottom' } } },
        data: this.reasons.map(item => item.rate_Sum)
      }]
    };

//    console.log(this.total);
  }

  onSubmit(value) {
    let query = {};
    if(this.searchModel.molder) {
      query['molder.oid'] = this.searchModel.molder.oid;
    }
    if(this.searchModel.mdef) {
      query['mdef.oid'] = this.searchModel.mdef.oid;
    }
    let groups: string[] = ['qcState', 'molder', 'mdef', 'qcTime'];
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), groups, query)
      .subscribe(items => {
        console.log(items);
        this.calcQcs(items);
      });
    this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
      .subscribe(items => {
        console.log(items);
       if (items.length > 0)
         {this.calcReasoncs(items);};
      });
  }

  /**
   * [返回上一级]
   */
  goBack(): void {
    this.location.back();
  }


}
