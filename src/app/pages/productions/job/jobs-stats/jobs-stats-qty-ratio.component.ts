import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IJobResponse } from '../../../../@core/model/job-response';
import { IJobOrder } from '../../../../@core/model/job-order';

interface EchartQtyRatio {
  oid: string;
  qty: number;
  ratio: number;
}

@Component({
  selector: 'mes-jobs-stats-qty-ratio',
  template: `
    <div echarts [options]="options" class="echart" (chartClick)="onChartClick($event)"></div>
  `,
  styles: []
})
export class JobsStatsQtyRatioComponent implements AfterViewInit, OnDestroy {
  _data: EchartQtyRatio[];
  @Input()
  set data(data: EchartQtyRatio[]) {
    this._data = data;
    this.init(data);
  }

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private router: Router) {
  }

  init(data: any[] = []): void {
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
            data: data.map(item => item.oid),
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
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
              formatter: '{value}%',
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            itemStyle: { normal: { label: { show: true, position: 'top' } } },
            data: data.map(item => item.qty),
            markLine: {
              lineStyle: {
                normal: {
                  type: 'dashed'
                }
              },
              // data: [
              //   [{ type: 'min' }, { type: 'max' }]
              // ]
            }
          }, {
            name: '累计占比',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: { normal: { label: { show: true, position: 'bottom' } } },
            data: data.map(item =>  item.ratio)
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

  onChartClick(event) {
    console.log(event);
    this.router.navigate(['/pages/productions/jobOrder/jobOrder-show/', event.name]);
  }
}
