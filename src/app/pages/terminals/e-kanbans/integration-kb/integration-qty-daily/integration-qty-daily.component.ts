import { AfterViewInit, Component, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

import { LayoutService } from '../../../../../@core/utils/layout.service';
import { MaterialData, WorkData } from '../../../../../@core/data/util.service';
import { IJobResponse } from '../../../../../@core/model/job-response';
import { IJobOrder } from '../../../../../@core/model/job-order';

class EchartQtyItem {
  oid: string;
  name: string;
  stack: string;
  quantity: number;
}

@Component({
  selector: 'mes-integration-qty-daily',
  templateUrl: './integration-qty-daily.component.html',
  styleUrls: ['./integration-qty-daily.component.scss']
})
export class IntegrationQtyDailyComponent implements AfterViewInit, OnDestroy, OnChanges {
  private alive = true;

  @Input() jr: IJobResponse;
  @Input() jo: IJobOrder;
  @Input() type: string = '仅物料';

  options: any = {};
  currentTheme: string;
  echartsInstance: any;

  series: any[] = [];

  labels: string[] = [];

  /**
 * [工单的进度值]
 * @type {number}
 */
  processValue: number = 72;

  showStatus: string = 'info';

  constructor(private themeService: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  init() {
    let mReq = this.jo.mReq.filter(mr => mr.use === MaterialData.useTypes[1]);
    if (!mReq || mReq.length <= 0) {
      mReq = this.jo.mReq.filter(mr => mr.use === MaterialData.useTypes[0]);
    }
    //计划实际数量，最终的呈现结果
    //1. 计划的量
    //2. 实际的量
    //3. 获取xAixs值
    //4. 获取yAixs Series值
    let items: EchartQtyItem[] = mReq.map(mr => {
      return {
        oid: mr.mdef.oid,
        name: '计划',
        stack: '计划',
        quantity: mr.qty.quantity,
      }
    });
    _.forOwn(_.groupBy(this.jr.mAct, 'mdef.oid'), (value, key) => {
      switch (this.type) {
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
    this.labels = _.uniq(_.map(items, 'oid'));
    _.forOwn(_.groupBy(items, 'name'), (value, key) => {
      let thread = {
        name: key,
        stack: value[0].stack,
        data: _.values(_.assign(_.zipObject(this.labels, this.labels.map(item => 0)),
          _.zipObject(value.map(item => item.oid), value.map(item => item.quantity))))
      };
      this.series.push(thread);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (!changes.jo.isFirstChange() && !changes.jr.isFirstChange()) {
    if(this.jo && this.jr) {
      this.init();
      if (this.series && this.series.length > 0) {
        console.log(this.series);

        this.echartsInstance.setOption({
          legend: {
            data: this.series.map(item => item.name)
          },
          series: this.series.map(item => {
            return {
              name: item.name,
              stack: item.stack,
              type: 'bar',
              itemStyle: { normal: { label: { show: true, position: 'top' } } },
              data: item.data
            }
          }),
          xAxis: {
            data: this.labels,
          },
          // tooltip: {
          //   formatter: this.formatter,
          // },
        });
        console.log(this.echartsInstance);
      }
    }
  }

  ngAfterViewInit() {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;

        this.options = Object.assign({}, {
          grid: {
            left: 0,
            top: '10%',
            right: 0,
            bottom: 0,
            containLabel: true,
          },
          backgroundColor: echarts.bg,
          color: [colors.primaryLight, colors.successLight, colors.infoLight, colors.warningLight, colors.dangerLight],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            data: this.series && this.series.length > 0 ? this.series.map(item => item.name) : [],
            textStyle: {
              fontSize: 18,
              color: echarts.textColor,
            },
          },
          xAxis: [
            {
              type: 'category',
              // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              data: this.labels,
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
          series: this.series && this.series.length > 0 ? this.series.map(item => {
            return {
              name: item.name,
              stack: item.stack,
              type: 'bar',
              itemStyle: { normal: { label: { show: true, position: 'top' } } },
              data: item.data
            }
          }) : [],
        });
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}

