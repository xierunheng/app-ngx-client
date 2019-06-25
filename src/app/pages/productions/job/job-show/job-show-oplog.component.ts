import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';

import { MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IJobResponse } from '../../../../@core/model/job-response';
import { IJobOrder } from '../../../../@core/model/job-order';

@Component({
  selector: 'mes-job-show-oplog',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
  styles: []
})
export class JobShowOplogComponent implements AfterViewInit, OnDestroy {
  _jr: IJobResponse;
  @Input()
  set jr(jr: IJobResponse) {
    this._jr = jr;
    this.init();
  }

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  init(): void {
    if (this._jr) {
      let items: any[] = [];
      let count: number = 0;
      _.forEach(this._jr.oplog, log => {
        if (log.op === MaterialData.BodyOps.undo.text ||
          log.op === MaterialData.BodyOps.scrap.text ||
          log.op === MaterialData.BodyOps.reject.text) {
          count -= 1;
        } else {
          count += 1;
        }
        items.push([log.date, count, log]);
      })
      if (items && items.length > 0) {

        this.themeSubscription = this.theme.getJsTheme().pipe(delay(1)).subscribe(config => {
          const colors: any = config.variables;
          const echarts: any = config.variables.echarts;

          this.options = {
            backgroundColor: echarts.bg,
            color: [colors.primaryLight, colors.successLight, colors.infoLight, colors.warningLight, colors.dangerLight],
            tooltip: {
              trigger: 'item',
              axisPointer: {
                type: 'shadow',
              },
              textStyle: {
                fontSize: 20,
              },
              formatter: function(params) {
                let date = new Date(params.value[0]);
                let data = date.getFullYear() + '-'
                  + (date.getMonth() + 1) + '-'
                  + date.getDate() + ' '
                  + date.getHours() + ':'
                  + date.getMinutes();
                let result = params.value.length > 2 && params.value[2] &&
                  params.value[2].reason && params.value[2].reason.length > 0 ? params.value[2].reason[0].oid : '完成';
                return data + '<br/>'
                  + '进度:' + params.value[1] + '<br/> '
                  + '坯体:' + params.value[2].subLot.oid + '[' + params.value[2].subLot.mdef.oid + ']<br/> '
                  + '操作:' + params.value[2].op + '<br/> '
                  + '结果:' + result;
              }
            },
            toolbox: {
              show: true,
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            dataZoom: {
              show: true,
              type: 'slider',
              xAxisIndex: [0],
              filterMode: 'filter'
            },
            legend: {
              data: ['进程']
            },
            grid: {
              y2: 80
            },
            xAxis: [
              {
                type: 'time',
                splitNumber: 10
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            animation: true,
            series: [{
              name: '进程',
              type: 'line',
              data: items,
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              },
            }]
          };
        });
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
