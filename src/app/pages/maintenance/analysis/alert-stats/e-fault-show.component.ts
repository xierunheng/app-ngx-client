import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';

//import { IJobResponse } from '../../../../@core/model/jobOrder-response';

// class EchartQciItem {
//   oid: string;
//   quantity: number;
// }

@Component({
  selector: 'mes-e-fault-show',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
  styles: []
})
export class EFaultShowComponent implements AfterViewInit, OnDestroy {
  _alerts: any;
  @Input()
  set alerts(alerts: any) {
    this._alerts = alerts;
    this.init();
  }

  _total: number;
  @Input()
  set total(total: number) {
    this._total = total;
    this.init();
  }

  _Checkoid: string;
  @Input()
  set Checkoid(Checkoid: string) {
    this._Checkoid = Checkoid;
    this.init();
  }

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  init(): void {

    if (this._alerts) {
     // let xAxisData: string[] = _.uniq(_.map(this._alerts, 'messageText'));
      let xAxisData: string[] = _.uniq(_.map(this._alerts, this._Checkoid));
     // console.log('xAxisData', xAxisData);
      let seriesData: number[] =[];
      for(let i=0;i<this._alerts.length;i++){
        seriesData.push(this._alerts[i].count);
      }
      //let seriesData: number[] = _.uniq(_.map(this._alerts, 'count'));
    //  console.log('seriesData', seriesData)
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
              //  data: _.keys(items),
                data: xAxisData,
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
                max: this._total,
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
              //data: _.values(items)
              data: seriesData
            }, {
              name: '累计占比',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: { normal: { label: { show: true, position: 'bottom' } } },
              data: seriesData.map((item,index,input) => this._total === 0 ? 0 : _.round(input.slice(0, index + 1).reduce((prev, curr) => prev + curr) / this._total * 100), 2),
              // _.values(items).map((item, index, input) => total === 0 ? 0 : _.round(input.slice(0, index + 1).reduce((prev, curr) => prev + curr) / total * 100), 2),
            }],
          };
        });
    }

    //}
  }

  // ngOnInit() {
  // }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

}
