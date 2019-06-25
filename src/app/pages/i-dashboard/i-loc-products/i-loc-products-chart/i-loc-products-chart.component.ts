import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import * as _ from 'lodash';

import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'mes-i-loc-products-chart',
  template: `
    <div class="header">
      <span class="title">选择区域</span>
      <h2>{{loc}}</h2>
    </div>
    <div echarts [options]="option"class="echart"(chartInit)="onChartInit($event)"></div>
  `,
  styleUrls: ['./i-loc-products-chart.component.scss']
})
export class ILocProductsChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() loc: string;
  @Input() data: any[];

  private maxValue: number;
  private alive = true;

  option: any = {};
  echartsInstance;

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.isFirstChange()) {
      this.maxValue = this.data.length > 0 ? _.maxBy(this.data, 'qty').qty : 0;
      this.echartsInstance.setOption({
        yAxis: {
          data: this.data.length > 0 ? this.data.map(item => item.name) : [],
        },
        series: [
          {
            data: this.data.length > 0 ? this.data.map(v => this.maxValue) :[],
          },
          {
            data: this.data.length > 0 ? this.data.map(item => item.qty) : [],
          },
          {
            data: this.data.length > 0 ? this.data.map(item => item.qty) : [],
          },
        ],
      });
    }
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        const countriesTheme: any = config.variables.countryOrders;

        this.option = Object.assign({}, {
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            top: '3%',
            containLabel: true,
          },
          xAxis: {
            axisLabel: {
              color: countriesTheme.chartAxisTextColor,
              fontSize: countriesTheme.chartAxisFontSize,
            },
            axisLine: {
              lineStyle: {
                color: countriesTheme.chartAxisLineColor,
                width: '2',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: countriesTheme.chartAxisSplitLine,
                width: '1',
              },
            },
          },
          yAxis: {
            data: this.data.length > 0 ? this.data.map(item => item.name) : [],
            axisLabel: {
              color: countriesTheme.chartAxisTextColor,
              fontSize: countriesTheme.chartAxisFontSize,
            },
            axisLine: {
              lineStyle: {
                color: countriesTheme.chartAxisLineColor,
                width: '2',
              },
            },
            axisTick: {
              show: false,
            },
          },
          series: [
            { // For shadow
              type: 'bar',
              data: this.data.length > 0 ? this.data.map(v => this.maxValue) :[],
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: countriesTheme.chartInnerLineColor,
                },
                opacity: 1,
              },
              barWidth: '40%',
              barGap: '-100%',
              barCategoryGap: '30%',
              animation: false,
              z: 1,
            },
            { // For bottom line
              type: 'bar',
              data: this.data.length > 0 ? this.data.map(item => item.qty) : [],
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: countriesTheme.chartLineBottomShadowColor,
                },
                opacity: 1,
              },
              barWidth: '40%',
              barGap: '-100%',
              barCategoryGap: '30%',
              z: 2,
            },
            {
              type: 'bar',
              barWidth: '35%',
              data: this.data.length > 0 ? this.data.map(item => item.qty) : [],
              cursor: 'default',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                    offset: 0,
                    color: countriesTheme.chartGradientFrom,
                  }, {
                    offset: 1,
                    color: countriesTheme.chartGradientTo,
                  }]),
                },
              },
              z: 3,
            },
          ],
        });
      });
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
