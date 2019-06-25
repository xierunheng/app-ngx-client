import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';

import { IJobResponse } from '../../../../@core/model/job-response';

class EchartQciItem {
  oid: string;
  quantity: number;
}

@Component({
  selector: 'mes-esub-show-qci',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
  styles: []
})
export class EsubShowQciComponent implements AfterViewInit, OnDestroy {
  _oplog: any;
  @Input()
  set oplog(oplog: any) {
    this._oplog = oplog;
    this.init();
  }



  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  init(): void {
    let items: any[] = [];
    _.forOwn(_.groupBy(this._oplog, 'reason'), (value, key) => {
      if(value[0].reason.length != 0){
        items.push({
         oid: value[0].reason[0].oid,
         number:value.length
       })
      }
      console.log(items);
     //  let items: any = _.fromPairs(_.orderBy(_.toPairs(_.countBy(value[0].reason, 'oid')), ['1'], ['desc']));
     //  console.log(items);
      // let items: any[];

      // let item:any = {
      //   oid: value[0].reason[0].oid,
      //   qty: value.length
      // }
      // console.log(item);
      // items.push(item);
      // console.log(items);




      // let item:any= {
      //   value[0].reason.oid = value.length;
      // }
      // console.log('value', value);
      // if(value[0].reason.length != 0) {
      //   let items: any = _.fromPairs(_.orderBy(_.toPairs(_.countBy(value[0].reason, 'oid')), ['1'], ['desc']));
      //   items.keys = value.length;
      //   console.log(items);



      // }

    })


    // if (this._reasons) {
    //   let items: any = _.fromPairs(_.orderBy(_.toPairs(_.countBy(this._reasons, 'oid')), ['1'], ['desc']));
      if (items) {
        let total: number = 0;
        for(let i=0;i<items.length;i++) {
          total += items[i].number;
        }
      let xAxisData: string[] = _.uniq(_.map(items, 'oid'));
      console.log('xAxisData', xAxisData);
    //  let seriesData: number[] = _.uniq(_.map(items, 'number'));
      let seriesData: number[] = [];
      for(let i=0; i<items.length; i++){
        seriesData.push(items[i].number);
      }

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
                max: total,
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
              data: seriesData.map((item,index,input) => total === 0 ? 0 : _.round(input.slice(0, index + 1).reduce((prev, curr) => prev + curr) / total * 100), 2),
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
