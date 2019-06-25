import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../@core/utils/layout.service';
import * as _ from 'lodash';

@Component({
  selector: 'mes-i-loss-statistics',
  templateUrl: './i-loss-statistics.component.html',
  styleUrls: ['./i-loss-statistics.component.scss']
})
export class ILossStatisticsComponent implements AfterViewInit, OnDestroy {

  private alive = true;

  /**
   * [总的损失量]
   * @type {number}
   */
  total: number;

  /**
   * [分类的显示数据]
   * @type {any[]}
   */
  _data: any[];
  @Input()
  set data(data: any[]) {
    this._data = data;
    this.total = data && data.length > 0 ? data.map(item => item.value).reduce((prev, curr) => prev + curr) : -1;
    if (this.echartsIntance) {
      console.log(this._data);
      this.echartsIntance.setOption({
        legend: {
          data: this._data && this._data.length > 0 ? this._data.map(item => item.name) : [],
        },
        series: [{
          data: this._data
        }]
      })
    }

  };

  option: any = {};
  chartLegend: { iconColor: string; title: string }[];
  echartsIntance: any;

  constructor(private theme: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const variables: any = config.variables;
        const visitorsPieLegend: any = config.variables.visitorsPieLegend;

        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;
        this.option = {
          // backgroundColor: echarts.bg,
          color: [colors.danger, colors.primary, colors.info],

          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            data: this._data && this._data.length > 0 ? this._data.map(item => item.name) : [],
          },
          series: [
            {
              name: '损失分析',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this._data
            }
          ]
        };

      });
  }


  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      this.echartsIntance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
