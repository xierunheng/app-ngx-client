import { Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { IHierarchyScope } from '../../@core/model/hs';
import { MsubLotService } from '../../@core/data/msublot.service';

@Component({
  selector: 'mes-realtime-material',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class RealtimeMaterialComponent implements OnDestroy {
  private alive = true;
  intervalSubscription: Subscription;

  _hs: IHierarchyScope;
  @Input()
  set hs(hs: IHierarchyScope) {
    this._hs = hs;
    this.init(hs);
  }
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private mslService: MsubLotService) {
  }

  init(hs: IHierarchyScope): void {
    this.mslService.aggregate('updatedAt', {
      qty: 'qty.quantity', ngqty: 'ngqty.quantity'
    }, {
        hs: hs,
        opState: { $ne: 'Created' },
        qcState: { $ne: 'Idle' }
      }, {
        name: 'loc.name'
      }).subscribe(items => {
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
                data: items.map(item => item.qty),
              },
            ],
          };
          this.startReceivingLiveData();
        });
      })
  }

  startReceivingLiveData() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.intervalSubscription = interval(60 * 1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.mslService.aggregate('updatedAt', {
          qty: 'qty.quantity', ngqty: 'ngqty.quantity'
        }, {
            hs: this._hs,
            opState: { $ne: 'Created' },
            qcState: { $ne: 'Idle' }
          }, {
            name: 'loc.name'
          })),
      )
      .subscribe(data => {
        this.options.xAxis[0].data = data.map(item => item.name);
        this.options.series[0].data = data.map(item => item.qty);

        this.options = Object.assign({}, this.options);
      });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    this.alive = false;
  }
}
