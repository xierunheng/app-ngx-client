import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../@core/model/hs';
import { KpiService } from '../../@core/data/kpi.service';

@Component({
  selector: 'ngx-echarts-kpi',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsKPIComponent implements AfterViewInit, OnDestroy {
  @Input()
  set hs(hs: IHierarchyScope) {
    this.init(hs);
  }
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private kpiService: KpiService) {
  }

  init(hs: IHierarchyScope): void {
    this.kpiService.aggrClass(hs).subscribe(items => {
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

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
              data: items.map(item => item.name),
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
          series: [
            {
              name: '数量',
              type: 'bar',
              barWidth: '60%',
              // data: [10, 52, 200, 334, 390, 330, 220],
              data: items.map(item => item.value),
            },
          ],
        };
      });
    })
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
