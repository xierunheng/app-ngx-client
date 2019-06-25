import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../../../@core/utils/layout.service';

@Component({
  selector: 'mes-integration-qty-week-back',
  templateUrl: './integration-qty-week-back.component.html',
  styleUrls: ['./integration-qty-week-back.component.scss']
})
export class IntegrationQtyWeekBackComponent implements AfterViewInit, OnDestroy {

  private alive = true;

  @Input() trafficBarData: any;

  currentTheme: string;

  option: any = {};
  echartsInstance: any;

  constructor(private themeService: NbThemeService,
    private layoutService: LayoutService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
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

  ngAfterViewInit() {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        const trafficTheme: any = config.variables.trafficBarEchart;

        this.option = Object.assign({}, {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: this.trafficBarData.labels,
            axisLabel: {
              color: trafficTheme.axisTextColor,
              fontSize: trafficTheme.axisFontSize,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            show: false,
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            boundaryGap: [0, '5%'],
          },
          tooltip: {
            axisPointer: {
              type: 'shadow',
            },
            textStyle: {
              color: trafficTheme.tooltipTextColor,
              fontWeight: trafficTheme.tooltipFontWeight,
              fontSize: 16,
            },
            position: 'top',
            backgroundColor: trafficTheme.tooltipBg,
            borderColor: trafficTheme.tooltipBorderColor,
            borderWidth: 3,
            formatter: this.trafficBarData.formatter,
            extraCssText: trafficTheme.tooltipExtraCss,
          },
          series: [
            {
              type: 'bar',
              barWidth: '40%',
              data: this.trafficBarData.data,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: trafficTheme.gradientFrom,
                  }, {
                    offset: 1,
                    color: trafficTheme.gradientTo,
                  }]),
                  opacity: 1,
                  shadowColor: trafficTheme.gradientFrom,
                  shadowBlur: trafficTheme.shadowBlur,
                  label:{show: true, position: 'top'}
                },
              },
            },
          ],
        });
      });
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
