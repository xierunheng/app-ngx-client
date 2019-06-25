import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MsubLotService } from '../../../../../@core/data/msublot.service';

//import { IJobResponse } from '../../../../../@core/model/jobOrder-response';

// class EchartQciItem {
//   oid: string;
//   quantity: number;
// }

@Component({
  selector: 'mes-integration-qc-daily',
  templateUrl: './integration-qc-daily.component.html',
  styleUrls: ['./integration-qc-daily.component.scss']
})
export class IntegrationQcDailyComponent implements AfterViewInit, OnDestroy {
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

  options: any = {};
  themeSubscription: any;

  summary: any = [{
    title: '日产量',
    value: 83,
  }, {
    title: '良品数',
    value: 128,
  }, {
    title: '废品数',
    value: 21,
  }];

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

    if (this._reasons && this._reasons.length > 0) {
      this.calcReasons(this._reasons);
    };

  }


  calcQcs(items: any) {

    this.summary[0].value = items.map(mv => mv.count).reduce((prev, curr) => prev + curr);

    _.forOwn(items, (mv, key) => {

      switch (mv.qcState) {
        case "Checked":
          this.summary[1].value = mv.count;
          break;
        // case "Defective":
        //   this.summary[2].value = mv.count;
        //   break;
        case "Scraped":
          this.summary[2].value = mv.count;
          break;
        default:
          break;
      }
    });
  }

  calcReasons(items: any) {

    let reasons: any  = [];
    let reasons_Total = items.map(mv => mv.count).reduce((prev, curr) => prev + curr);//累积总数

    let reason_temp: any[] = _.orderBy(items, ['count'], ['desc']); //倒叙排序

    if (reasons_Total){
      let count_sum: number  = 0;
      _.forEach(reason_temp, (value, key)=>{
        count_sum = value.count + count_sum;
        let reason: any = {
          reason: value.reason,
          count: value.count,
          sum: count_sum,
          rate: ((value.count / reasons_Total) * 100).toFixed(2),
          rate_Sum: ((count_sum / reasons_Total) * 100).toFixed(2),
        };
        reasons.push(reason);
      });
    }

    reasons = _.take(reasons, 5); //取前五

    this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {
      const colors: any = config.variables;
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
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['数量', '累计占比'],
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
            data: reasons.map(item => item.reason),
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
          name: '数量',
          type: 'bar',
          itemStyle: { normal: { label: { show: true, position: 'top' } } },
          data: reasons.map(item => item.count)
        }, {
          name: '累计占比',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: { normal: { label: { show: true, position: 'bottom' } } },
          data: reasons.map(item => item.rate_Sum),
        }],
      };
    });

  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}

