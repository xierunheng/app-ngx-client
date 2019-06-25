import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';
import {IJobResponse} from "../../../../../@core/model/job-response";


class EchartQciItem {
  oid: string;
  quantity: number;
}

@Component({
  selector: 'mes-m-job-show-qci',
  templateUrl: './job-show-qci.component.html',
  styles: []
})
export class JobShowQciComponent implements AfterViewInit, OnDestroy {
  _jr: IJobResponse;
  @Input()
  set jr(jr: IJobResponse) {
    this._jr = jr;
    this.init();
  }

  options: any = {};
  themeSubscription: any;

  qciArray = [];
  percenArray = [];

  constructor() {
  }

  init(): void {
    if (this._jr) {
      let items: any = _.fromPairs(_.orderBy(_.toPairs(_.countBy(this._jr.reasons, 'oid')), ['1'], ['desc']));
      if (items) {
        let total: number = _.values(items).length > 0 ? _.values(items).reduce((prev, curr) => prev + curr) : 0;
        console.log(this._jr,"jr!!!!!!");
        console.log(items,"items!!!!!!");
        console.log(total,"total!!!!!!");
        console.log(_.values(items),'[]!!!');
        let dataArray = [];//缺陷数据数组
        let sumNum = 0;//累计缺陷数
        let percenArray = [];//累计占比数据数组
        for(let item in items){
          console.log(item+"="+items[item]);
          //组装缺陷数据
          let data = {
            oid:item,
            num:items[item]
          }
          dataArray.push(data);

          //计算累计占比，组装累计占比数据
          sumNum += items[item];
          let percenData = {
            oid:item,
            percen:_.round(sumNum/total * 100,2)
          }
          percenArray.push(percenData);
        }
        this.qciArray = dataArray;
        this.percenArray = percenArray;
        console.log(this.qciArray,"this.qciArray!!!!");
        console.log(this.percenArray,"this.percenArray!!!!");
        // this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {
        //   const colors: any = config.variables;
        //   const echarts: any = config.variables.echarts;
        //
        //   this.options = {
        //     backgroundColor: echarts.bg,
        //     color: [colors.primaryLight, colors.successLight, colors.infoLight, colors.warningLight, colors.dangerLight],
        //     tooltip: {
        //       trigger: 'axis',
        //       axisPointer: {
        //         type: 'shadow',
        //       },
        //       textStyle: {
        //         fontSize: 20,
        //       },
        //     },
        //     toolbox: {
        //       feature: {
        //         dataView: { show: true, readOnly: false },
        //         restore: { show: true },
        //         saveAsImage: { show: true }
        //       }
        //     },
        //     legend: {
        //       data: ['数量', '累计占比'],
        //       textStyle: {
        //         fontSize: 18,
        //         color: echarts.textColor,
        //       },
        //     },
        //     grid: {
        //       left: '3%',
        //       right: '4%',
        //       bottom: '3%',
        //       containLabel: true,
        //     },
        //     xAxis: [
        //       {
        //         type: 'category',
        //         data: _.keys(items),
        //         axisTick: {
        //           alignWithLabel: true,
        //         },
        //         axisLine: {
        //           lineStyle: {
        //             color: echarts.axisLineColor,
        //           },
        //         },
        //         axisLabel: {
        //           fontSize: 18,
        //           textStyle: {
        //             color: echarts.textColor,
        //           },
        //         },
        //       },
        //     ],
        //     yAxis: [
        //       {
        //         type: 'value',
        //         min: 0,
        //         max: total,
        //         axisLine: {
        //           lineStyle: {
        //             color: echarts.axisLineColor,
        //           },
        //         },
        //         splitLine: {
        //           lineStyle: {
        //             color: echarts.splitLineColor,
        //           },
        //         },
        //         axisLabel: {
        //           fontSize: 18,
        //           textStyle: {
        //             color: echarts.textColor,
        //           },
        //         },
        //       },
        //       {
        //         type: 'value',
        //         axisLine: {
        //           lineStyle: {
        //             color: echarts.axisLineColor,
        //           },
        //         },
        //         splitLine: {
        //           lineStyle: {
        //             color: echarts.splitLineColor,
        //           },
        //         },
        //         axisLabel: {
        //           fontSize: 18,
        //           formatter: '{value}%',
        //           textStyle: {
        //             color: echarts.textColor,
        //           },
        //         },
        //       },
        //     ],
        //     series: [{
        //       name: '数量',
        //       type: 'bar',
        //       itemStyle: { normal: { label: { show: true, position: 'top' } } },
        //       data: _.values(items)
        //     }, {
        //       name: '累计占比',
        //       type: 'line',
        //       yAxisIndex: 1,
        //       itemStyle: { normal: { label: { show: true, position: 'bottom' } } },
        //       data: _.values(items).map((item, index, input) => total === 0 ? 0 : _.round(input.slice(0, index + 1).reduce((prev, curr) => prev + curr) / total * 100), 2),
        //     }],
        //   };
        // });
      }

    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
