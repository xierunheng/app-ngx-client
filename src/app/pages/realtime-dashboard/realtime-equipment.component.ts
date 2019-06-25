import { Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { IHierarchyScope } from '../../@core/model/hs';
import { EsubService } from '../../@core/data/esub.service';

@Component({
  selector: 'mes-realtime-equipment',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class RealtimeEquipmentComponent implements OnDestroy {
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
    private esubService: EsubService) {
  }

  init(hs: IHierarchyScope): void {
    this.esubService.searchEsubEncode({
      hs: hs,
      status: 'released'
    }, 'oid qty.quantity').subscribe(items => {
      //参考 https://echarts.baidu.com/examples/editor.html?c=dynamic-data
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors: any = config.variables;
        const echarts: any = config.variables.echarts;

        this.options = {
          backgroundColor: echarts.bg,
          color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          legend: {
            data: items.map(item => item.oid),
          },
          toolbox: {
            show: true,
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: {
            show: false,
            start: 0,
            end: 100
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              data: [new Date().toLocaleTimeString().replace(/^\D*/, '')]
            },
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: '数量',
              min: 0,
            },
          ],
          series: items.map(item => {
            return {
              name: item.oid,
              type: 'line',
              data: [item.qty.quantity]
            }
          })
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
        switchMap(() => this.esubService.searchEsubEncode({
          hs: this._hs,
          status: 'released'
        }, 'oid qty.quantity')),
      )
      .subscribe(data => {
        let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
        let series = this.options.series;
        series.forEach(s => {
          let sItem = data.find(item => item.oid === s.name);
          if (sItem) {
            if (s.data.length >= 1000) {
              s.data.shift();
            }
            s.data.push(sItem.qty.quantity);
          }
        })

        //每个siries最多保留1000个数据
        if (this.options.xAxis[0].data.length >= 1000) {
          this.options.xAxis[0].data.shift();
        }
        this.options.xAxis[0].data.push(axisData);
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
