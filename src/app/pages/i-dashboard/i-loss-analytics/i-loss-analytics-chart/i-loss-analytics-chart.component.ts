import { delay, takeWhile } from 'rxjs/operators';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils';
import { OutlineData } from '../../../../@core/data/visitors-analytics';
import * as _ from 'lodash';

@Component({
  selector: 'mes-i-loss-analytics-chart',
  template: `
    <div echarts
         [options]="option"
         class="echart"
         (chartInit)="onChartInit($event)">
    </div>
  `,
  styleUrls: ['i-loss-analytics-chart.component.scss']
})
export class ILossAnalyticsChartComponent implements AfterViewInit, OnDestroy {

  private alive = true;

  @Input() chartData: {
    innerLine: number[];
    outerLine: OutlineData[];
  };

  _data: any;
  @Input()
  set data(data: any) {
    this._data = data;
    console.log(this._data);
    if (this.echartsIntance) {
      this.echartsIntance.setOption({
        legend: {
          data: this._data && this._data.length > 0 ? _.keys(_.groupBy(this._data, 'qcState')) : [],
        },
        xAxis: [{
          data: this._data && this._data.length > 0 ? _.keys(_.groupBy(this._data, 'date')) : [],
        }],
        series: this._data && this._data.length > 0 ?
          _.keys(_.groupBy(this._data, 'qcState')).map(item => {
            return {
              name: item,
              type: 'line',
              stack: 'loss',
              areaStyle: {},
              data: _.values(_.groupBy(this._data, 'date')).map(value => {
                let rnFind = value.find(v => v.qcState === item);
                return rnFind ? rnFind.count : 0;
              })
            }
          })
          : []
      })
      console.log(this.option);
    }

  }

  option: any;
  themeSubscription: any;
  echartsIntance: any;

  constructor(private theme: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngAfterViewInit(): void {
    this.theme.getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive),
      )
      .subscribe(config => {
        const eTheme: any = config.variables.visitors;
        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;

        this.option = {
          color: [colors.danger, colors.primary, colors.info],
          title: {
            text: '堆叠区域图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: this._data && this._data.length > 0 ? _.keys(_.groupBy(this._data, 'qcState')) : [],
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this._data && this._data.length > 0 ? _.keys(_.groupBy(this._data, 'date')) : [],
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: this._data && this._data.length > 0 ?
            _.keys(_.groupBy(this._data, 'qcState')).map(item => {
              return {
                name: item,
                type: 'line',
                stack: 'loss',
                areaStyle: {},
                data: _.values(_.groupBy(this._data, 'date')).map(value => {
                  let rnFind = value.find(v => v.qcState === item);
                  return rnFind ? rnFind.count : 0;
                })
              }
            })
            : []
          // series: [
          //   {
          //     name: '邮件营销',
          //     type: 'line',
          //     stack: '总量',
          //     areaStyle: {},
          //     data: [120, 132, 101, 134, 90, 230, 210]
          //   },
          //   {
          //     name: '联盟广告',
          //     type: 'line',
          //     stack: '总量',
          //     areaStyle: {},
          //     data: [220, 182, 191, 234, 290, 330, 310]
          //   },
          //   {
          //     name: '视频广告',
          //     type: 'line',
          //     stack: '总量',
          //     areaStyle: {},
          //     data: [150, 232, 201, 154, 190, 330, 410]
          //   },
          //   {
          //     name: '直接访问',
          //     type: 'line',
          //     stack: '总量',
          //     areaStyle: { normal: {} },
          //     data: [320, 332, 301, 334, 390, 330, 320]
          //   },
          //   {
          //     name: '搜索引擎',
          //     type: 'line',
          //     stack: '总量',
          //     label: {
          //       normal: {
          //         show: true,
          //         position: 'top'
          //       }
          //     },
          //     areaStyle: { normal: {} },
          //     data: [820, 932, 901, 934, 1290, 1330, 1320]
          //   }
          // ]

        };
      });
  }

  setOptions(eTheme) {
    this.option = {
      grid: {
        left: 40,
        top: 20,
        right: 0,
        bottom: 60,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: eTheme.tooltipLineColor,
            width: eTheme.tooltipLineWidth,
          },
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          fontSize: 20,
          fontWeight: eTheme.tooltipFontWeight,
        },
        position: 'top',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: 3,
        formatter: (params) => {
          return Math.round(parseInt(params[0].value, 10));
        },
        extraCssText: eTheme.tooltipExtraCss,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 25,
        data: this.chartData.outerLine.map(i => i.label),
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '2',
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '1',
          },
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisTick: {
          show: false,
        },
        splitLine: {

          lineStyle: {
            color: eTheme.yAxisSplitLine,
            width: '1',
          },
        },
      },
      series: [
        this.getInnerLine(eTheme),
        this.getOuterLine(eTheme),
      ],
    };
  }

  getOuterLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.lineStyle,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.lineGradFrom,
          }, {
            offset: 1,
            color: eTheme.lineGradTo,
          }]),
          shadowColor: eTheme.lineShadow,
          shadowBlur: 6,
          shadowOffsetY: 12,
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.areaGradFrom,
          }, {
            offset: 1,
            color: eTheme.areaGradTo,
          }]),
        },
      },
      data: this.chartData.outerLine.map(i => i.value),
    };
  }

  getInnerLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      tooltip: {
        show: false,
        extraCssText: '',
      },
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          opacity: 0,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.innerLineWidth,
          type: eTheme.innerLineStyle,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1),
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.innerAreaGradFrom,
          }, {
            offset: 1,
            color: eTheme.innerAreaGradTo,
          }]),
          opacity: 1,
        },
      },
      data: this.chartData.innerLine,
    };
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
