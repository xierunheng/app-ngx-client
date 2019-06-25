import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { ProfitChart } from '../../../../../../@core/data/profit-chart';
import { LayoutService } from '../../../../../../@core/utils/layout.service';

@Component({
  selector: 'mes-col-chart',
  styleUrls: ['charts-common.component.scss'],
  template: `
    <div echarts [options]="options" class="echart" (chartInit)="onChartInit($event)"></div>
  `,
})
export class ColChartComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input()
  profitChartData: ProfitChart;

  private alive = true;

  echartsIntance: any;
  options: any = {};
  profit = {
      // fourth bar
      fourthLineGradFrom: '#800080',
      fourthLineGradTo: '#8057ff',
      fourthLineShadow: 'rgba(14, 16, 48, 0.4)',

      fourthAreaGradFrom: 'rgba(188, 92, 255, 0.2)',
      fourthAreaGradTo: '#ffffff',
      fourthShadowLineDarkBg: 'rgba(0, 0, 0, 0)',
      // fifth bar
      fifthLineGradFrom: '#00FF00',
      fifthLineGradTo: '#0057ff',
      fifthLineShadow: 'rgba(14, 16, 48, 0.4)',

      fifthAreaGradFrom: 'rgba(188, 92, 255, 0.2)',
      fifthAreaGradTo: '#ffffff',
      fifthShadowLineDarkBg: 'rgba(0, 0, 0, 0)',
    };

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnChanges(): void {
    if (this.echartsIntance) {
      this.updateProfitChartOptions(this.profitChartData);
    }
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        const eTheme: any = config.variables.profit;

        this.setOptions(eTheme);
      });
  }

  setOptions(eTheme) {
    this.options = {
      backgroundColor: eTheme.bg,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
      legend: {
        data: ['打浆', '成型','打磨','喷釉','窑烧'],
        textStyle: {
          fontSize: 18,
          // color: echarts.textColor,
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
          data: this.profitChartData.chartLabel,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
            },
          },
          axisLabel: {
            color: eTheme.axisTextColor,
            fontSize: eTheme.axisFontSize,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: eTheme.splitLineColor,
            },
          },
          axisLabel: {
            color: eTheme.axisTextColor,
            fontSize: eTheme.axisFontSize,
          },
        },
      ],
      series: [
        {
          name: '打浆',
          type: 'bar',
          barGap: 0,
          barWidth: '17%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: eTheme.firstLineGradFrom,
              }, {
                offset: 1,
                color: eTheme.firstLineGradTo,
              }]),
            },
          },
          data: this.profitChartData.data[0],
        },
        {
          name: '成型',
          type: 'bar',
          barWidth: '17%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: eTheme.secondLineGradFrom,
              }, {
                offset: 1,
                color: eTheme.secondLineGradTo,
              }]),
            },
          },
          data: this.profitChartData.data[1],
        },
        {
          name: '打磨',
          type: 'bar',
          barWidth: '18%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: eTheme.thirdLineGradFrom,
              }, {
                offset: 1,
                color: eTheme.thirdLineGradTo,
              }]),
            },
          },
          data: this.profitChartData.data[2],
        },
        {
          name: '喷釉',
          type: 'bar',
          barWidth: '17%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: this.profit.fourthLineGradFrom
              }, {
                offset: 1,
                color: this.profit.fourthLineGradFrom,
              }]),
            },
          },
          data: this.profitChartData.data[3],
        },
        {
          name: '窑烧',
          type: 'bar',
          barWidth: '17%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: this.profit.fifthLineGradFrom,
              }, {
                offset: 1,
                color: this.profit.fifthLineGradFrom,
              }]),
            },
          },
          data: this.profitChartData.data[4],
        },
      ],
    };
  }

  updateProfitChartOptions(profitChartData: ProfitChart) {
    const options = this.options;
    const series = this.getNewSeries(options.series, profitChartData.data);

    this.echartsIntance.setOption({
      series: series,
      xAxis: {
        data: this.profitChartData.chartLabel,
      },
    });
  }

  getNewSeries(series, data: number[][]) {
    return series.map((line, index) => {
      return {
        ...line,
        data: data[index],
      };
    });
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  resizeChart() {
    if (this.echartsIntance) {
      // Fix recalculation chart size
      // TODO: investigate more deeply
      setTimeout(() => {
        this.echartsIntance.resize();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
