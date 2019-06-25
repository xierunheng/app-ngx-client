import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

import * as _ from 'lodash';
import * as moment from 'moment';
// import { takeWhile } from 'rxjs/operators';
// import { forkJoin } from 'rxjs';
import { MsubLotService } from '../../../../../@core/data/msublot.service';


@Component({
  selector: 'mes-integration-qc-week',
  templateUrl: './integration-qc-week.component.html',
  styleUrls: ['./integration-qc-week.component.scss']
})
export class IntegrationQcWeekComponent implements OnInit, OnDestroy {

  _qcs: any[];
  _reasons : any[];
  @Input()
  set qcs(qcs: any[]) {
    this._qcs = qcs;
    this.init_Qcs();
  }
  @Input()
  set reasons(reasons: any[]) {
    this._reasons = reasons;
    this.init_Reasons();
  }

  // //统计开始时间
  // startTime: Date;
  // //统计结束时间
  // endTime: Date;

  summary: any = [{
    title: '周产量',
    value: 0,
  }, {
    title: '良品数',
    value: 0,
  }, {
    title: '良品率',
    value: 0,
  }];

  qcsWeek_statistics : any[];

  reasons_Total:number;

  // reasons_Table: any = _.fill(Array(5), {
  //   reason: '缺陷项',
  //   count: 0,
  //   rate: ''
  // });

  reasons_Table: any = [{
    reason: '缺陷项',
    count: 0,
    rate: ''
  },{
    reason: '缺陷项',
    count: 0,
    rate: ''
  },{
    reason: '缺陷项',
    count: 0,
    rate: ''
  },{
    reason: '缺陷项',
    count: 0,
    rate: ''
  },{
    reason: '缺陷项',
    count: 0,
    rate: ''
  }];


  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
              private themeService: NbThemeService,
              private mslService: MsubLotService) {

  }

  init_Qcs() {

    if (this._qcs && this._qcs.length > 0) {
      this.calcQcs(this._qcs);
    };

  }

  init_Reasons() {
    console.log(this._reasons);
    if (this._reasons && this._reasons.length > 0) {
      this.calcReasons(this._reasons);
    };

  }

  ngOnInit() {

    // this.startTime = moment("2019-05-10", "YYYY-MM-DD").subtract(1, 'week').toDate();
    // this.endTime = moment("2019-05-10", "YYYY-MM-DD").toDate();

    // this.mslService.aggregate('qcTime', {count: 1}, {
    //   startTime: this.startTime,
    //   endTime: this.endTime,
    // }, {
    //   // year: 'qcTime',
    //   //month: 'qcTime',
    //   week: 'qcTime',
    //   dayOfWeek: 'qcTime',
    //   qcState: 'qcState',
    //   //reason: 'reason.oid',
    // }).subscribe(data => {
    //   //console.log(data);
    //   this.calcQcs(data);
    // });
    // this.mslService.aggrQCTimely(this.startTime.toString(), this.endTime.toString(), ['reason'], {}, 'reason')
    //   .subscribe(items => {
    //    if (items.length > 0)
    //      {this.calcReasoncs(items);};
    //   });

  }

  calcQcs(items: any) {
    this.qcsWeek_statistics = [];
    _.forOwn(_.groupBy(items, 'dayOfWeek'), (value, key) => {
      let qcs_day: any = {
        week: value[0].week,
        dayOfWeek: value[0].dayOfWeek,
        total: value.map(mv => mv.count).reduce((prev, curr) => prev + curr),
        checked: 0,
        defective: 0,
        scraped: 0,
        rate_checked: '',
      };

      _.forOwn(value, (mv, key) => {
        switch (mv.qcState) {
          case "Checked":
            qcs_day.checked = mv.count;
            break;
          case "Defective":
            qcs_day.defective = mv.count;
            break;
          case "Scraped":
            qcs_day.scraped = mv.count;
            break;
          default:
            break;
        }
      });

      if (qcs_day.total > 0) {qcs_day.rate_checked = ((qcs_day.checked / qcs_day.total)*100).toFixed(2)};
      this.qcsWeek_statistics.push(qcs_day);
    });
    this.qcsWeek_statistics = _.orderBy(this.qcsWeek_statistics, ['week']);

    let xData:any=[];
    let yData_Checked:any=[];
    let yData_Defective:any=[];
    let yData_Scraped:any=[];

    _.forOwn(this.qcsWeek_statistics, (value, key) => {
      xData[key]=value.dayOfWeek;
      yData_Checked[key]=value.checked;
      yData_Defective[key]=value.defective;
      yData_Scraped[key]=value.scraped;
      this.summary[0].value = this.summary[0].value + value.total;
      this.summary[1].value = this.summary[1].value + value.checked;
      if (this.summary[0].value > 0) {this.summary[2].value = ((this.summary[1].value / this.summary[0].value)*100).toFixed(2)};
    });
    console.log(xData);
    console.log(yData_Checked);
    console.log(yData_Scraped);

  // 良品率趋势图
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight, colors.successLight, colors.infoLight, colors.warningLight, colors.dangerLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: 20,
          },
        },
        toolbox: {
          feature: {
            dataView: { show: false, readOnly: false },
            restore: { show: false },
            saveAsImage: { show: false }
          }
        },
        legend: {
          data: ['缺陷数', '良品数'],
          textStyle: {
            fontSize: 18,
            color: echarts.textColor,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              fontSize: 18,
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 'dataMax',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              fontSize: 18,
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              fontSize: 18,
              formatter: '{value}%',
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [{
          name: '良品数',
          type: 'bar',
          barGap:'1%',
          barCategoryGap:'50%',
          itemStyle: { normal: { label: { show: true, position: 'top' } } },
          data: yData_Checked,
        }, {
          name: '缺陷数',
          type: 'bar',
          itemStyle: { normal: { label: { show: true, position: 'top' } } },
          data: yData_Scraped,
        }],
      };
    });
  }

  calcReasons(items: any) {
    let reasons:any = [];
    this.reasons_Total = items.map(mv => mv.count).reduce((prev, curr) => prev + curr);//累积总数
//    this.reasons = _.orderBy(items, ['count'], ['desc']); //倒叙排序

    let reason_temp: any[] = _.orderBy(items, ['count'], ['desc']); //倒叙排序

    if (this.reasons_Total){
      let count_sum: number  = 0;
      _.forEach(reason_temp, (value, key)=>{
        count_sum = value.count + count_sum;
        let reason: any = {
          reason: value.reason,
          count: value.count,
          sum: count_sum,
          rate: ((value.count/this.reasons_Total)*100).toFixed(2),
          rate_Sum: ((count_sum/this.reasons_Total)*100).toFixed(2),
        };
        reasons.push(reason);
      });
    }

    reasons = _.take(reasons, 5); //取前五
    _.forOwn(reasons, (value, key) => {
      this.reasons_Table[key].reason = value.reason;
      this.reasons_Table[key].count = value.count;
      this.reasons_Table[key].rate = value.rate;
    });
  }

  ngOnDestroy() {
    //this.alive = false;
  }
}
