import { AfterViewInit, Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, takeWhile } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils/layout.service';

@Component({
  selector: 'mes-emaint-trim',
  template: `
    <div echarts [options]="options" class="echart" (chartInit)="onChartInit($event)"></div>
  `,
  styleUrls: ['./emaint-trim.component.scss']
})
export class EmaintTrimComponent implements AfterViewInit, OnDestroy, OnInit, OnChanges {
  private alive = true;

  @Input() liveUpdateChartData: any[];

  options: any = {};
  echartsInstance;
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private layoutService: LayoutService) {
    this.layoutService.onChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.resizeChart());
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.options) {
      this.updateChartOptions(this.liveUpdateChartData);
    }
  }

  ngAfterViewInit() {
    this.theme.getJsTheme().pipe(
      delay(1),
      takeWhile(() => this.alive),
    ).subscribe(config => {
      const earningLineTheme: any = config.variables.earningLine;

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],

        grid: {
          // left: 4,
          // top: 4,
          // right: 4,
          // bottom: 4,
        },
        legend: {
          data: this.liveUpdateChartData ? this.liveUpdateChartData.map(item => item.name) : [],
        },
        xAxis: [{
          type: 'category',
          boundaryGap: true,
          data: this.liveUpdateChartData ? this.liveUpdateChartData[0].data.map(item => item.name) : [],

        }],
        yAxis: [{
          type: 'value',
          scale: true,
          name: '产量',
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }, {
          type: 'value',
          scale: true,
          name: '节拍',
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        }],
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
            // showSymbol: false,
            // hoverAnimation: false,
            data: this.liveUpdateChartData ? this.liveUpdateChartData[0].data.map(item => item.value) : [],
          },
        ],
        animation: true,
      };
    });
  }

  updateChartOptions(chartData: any[]) {
    if (this.echartsInstance && chartData && chartData.length > 0)
      this.echartsInstance.setOption({
        xAxis: [{
          data: chartData[0].data.map(item => item.name),
        }],
        series: chartData.map(item => {
          return {
            name: item.name,
            type: 'line',
            yAxisIndex: item.dataType === 'countData' ? 0 : 1,
            // showSymbol: false,
            // hoverAnimation: false,
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

  ngOnDestroy(): void {
    this.alive = false;
  }



}
