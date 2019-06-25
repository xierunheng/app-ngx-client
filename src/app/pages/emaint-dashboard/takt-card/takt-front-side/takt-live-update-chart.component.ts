import { AfterViewInit, Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { delay, takeWhile } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'mes-takt-live-update-chart',
  template: `
    <div echarts class="echart" [options]="option" (chartInit)="onChartInit($event)"></div>
  `,
  styleUrls: ['takt-front-side.component.scss']
})
export class TaktLiveUpdateChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private alive = true;

  @Input() liveUpdateChartData: any[];

  option: any;
  echartsInstance;

  constructor(private theme: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.resizeChart());
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.option) {
      this.updateChartOptions(this.liveUpdateChartData);
    }
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive),
      )
      .subscribe(config => {
        const earningLineTheme: any = config.variables.earningLine;

        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;

        this.option = {
          backgroundColor: echarts.bg,
          color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],

          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          },
          xAxis: {
            // type: 'time',
            type: 'category',
            data: this.liveUpdateChartData ? this.liveUpdateChartData[0].data.map(item => item.name) : [],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              let str = params.map(item => `${item.seriesName}:${item.value}`).join('<br/>');
              var date = new Date(params[0].name);
              return date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '<br/>' + str;
            },
            axisPointer: {
              type: 'shadow',
            },
            textStyle: {
              color: earningLineTheme.tooltipTextColor,
              fontWeight: earningLineTheme.tooltipFontWeight,
              fontSize: earningLineTheme.tooltipFontSize,
            },
            position: 'top',
            backgroundColor: earningLineTheme.tooltipBg,
            borderColor: earningLineTheme.tooltipBorderColor,
            borderWidth: earningLineTheme.tooltipBorderWidth,
            extraCssText: earningLineTheme.tooltipExtraCss,
          },
          series: [
            {
              name: '实际产量',
              type: 'line',
              showSymbol: false,
              hoverAnimation: false,
              data: this.liveUpdateChartData ? this.liveUpdateChartData[0].data.map(item => item.value) : [],
            },
          ],
          animation: true,
        };
      });
  }

  updateChartOptions(chartData: any[]) {
    if(this.echartsInstance && chartData && chartData.length > 0)
    this.echartsInstance.setOption({
      xAxis: [{
        data: chartData[0].data.map(item => item.name),
      }],
      series: chartData.map(item => {
        return {
          name: item.name,
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: item.data ? item.data.map(d => d.value) : [],
        }
      }),
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
