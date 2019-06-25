import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../../@core/model/hs';
import { WorkResponseService } from '../../../@core/data/work-res.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'process-work-type',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class WorkTypeComponent implements AfterViewInit, OnDestroy {
  _hs: IHierarchyScope;
  @Input()
  set hs(hs: IHierarchyScope) {
    this._hs = hs;
    this.init();
  }
  _startTime: Date;
  @Input()
  set startTime(startTime: Date) {
    this._startTime = startTime;
    this.init();
  }
  _endTime: Date;
  @Input()
  set endTime(endTime: Date) {
    this._endTime = endTime;
    this.init();
  }

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private wrService: WorkResponseService) {
  }

  init(): void {
    if (this._hs && this._startTime && this._endTime) {
      this.wrService.aggr('workType', this._hs, this._startTime, this._endTime).subscribe(items => {
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors: any = config.variables;
          const echarts: any = config.variables.echarts;

          this.options = {
            backgroundColor: echarts.bg,
            color: [colors.primaryLight],
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
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
