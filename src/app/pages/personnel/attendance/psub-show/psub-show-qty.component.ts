import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';

import { MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IPsub } from '../../../../@core/model/psub';

class EchartQtyItem {
  oid: string;
  name: string;
  stack: string;
  quantity: number;
}

@Component({
  selector: 'mes-psub-show-qty',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
  styles: []
})
export class PsubShowQtyComponent implements AfterViewInit, OnDestroy {
  _psub: IPsub;
  @Input()
  set psub(psub: IPsub) {
    this._psub = psub;
    this.init();
  }
  _type: string = '仅物料';
  @Input()
  set type(type: string) {
    this._type = type;
    this.init();
  }

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  init(): void {
    if (this._psub && this._type) {

      //计划实际数量，最终的呈现结果
      //1. 计划的量
      //2. 实际的量
      //3. 获取xAixs值
      //4. 获取yAixs Series值
      let items: EchartQtyItem[] = [];
      _.forOwn(_.groupBy(this._psub.mAct, 'mdef.oid'), (value, key) => {
   //     console.log('value',value);
        switch (this._type) {
          case '仅物料':
            items.push({
              oid: key,
              name: '实际',
              stack: '实际',
              quantity: value.map(item => item.qty ? item.qty.quantity : 0).reduce((prev, curr) => prev + curr)
            });
            break;
          case '物料+成型工':
            _.forOwn(_.groupBy(value, 'subLot[0].molder.oid'), (value1, key1) => {
              items.push({
                oid: key,
                name: key1,
                stack: '实际',
                quantity: value1.map(item => item.qty ? item.qty.quantity : 0).reduce((prev, curr) => prev + curr)
              });
            });
            break;
          default:
            break;
        }
      });
      let xAxisData: string[] = _.uniq(_.map(items, 'oid'));
      let series: any[] = [];
      _.forOwn(_.groupBy(items, 'name'), (value, key) => {
        let thread = {
          name: key,
          stack: value[0].stack,
          data: _.values(_.assign(_.zipObject(xAxisData, xAxisData.map(item => 0)),
            _.zipObject(value.map(item => item.oid), value.map(item => item.quantity))))
        };
        series.push(thread);
      });
      console.log(series);

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
          legend: {
            data: series.map(item => item.name),
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
              // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          ],
          series: series.map(item => {
            return {
              name: item.name,
              stack: item.stack,
              type: 'bar',
              itemStyle: { normal: { label: { show: true, position: 'top' } } },
              data: item.data
            }
          })
        };
      });
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
