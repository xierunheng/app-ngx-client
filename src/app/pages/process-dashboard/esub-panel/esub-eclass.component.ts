import { AfterViewInit, Component, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../../@core/model/hs';
import { EsubService } from '../../../@core/data/esub.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'mes-esub-eclass',
  template: `
    <div echarts [options]="options" class="echart"  (chartClick)="onChartClick($event)"></div>
  `,
  styles: []
})
export class EsubEclassComponent implements AfterViewInit, OnDestroy {
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

  @Output() eclassChange: EventEmitter<string> = new EventEmitter<string>();

  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private esubService: EsubService) {
  }

  init(): void {
    if (this._hs && this._startTime && this._endTime) {
      this.esubService.aggrClass(this._hs, this._startTime, this._endTime).subscribe(items => {
        console.log(items);
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

          const colors: any = config.variables;
          const echarts: any = config.variables.echarts;

          this.options = {
            backgroundColor: echarts.bg,
            color: [colors.warningLight, colors.infoLight, colors.dangerLight],
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
            dataZoom: [
              {
                  show: true,
                  yAxisIndex: 0,
                  filterMode: 'empty',
                  width: 20,
                  height: '80%',
                  showDataShadow: false,
                  left: '0'
              }
            ],
            series: [
              {
                name: '优等品',
                type: 'bar',
                // data: [10, 52, 200, 334, 390, 330, 220],
                data: items.map(item => item.qty),
              },
              {
                name: '非优品',
                type: 'bar',
                // data: [10, 52, 200, 334, 390, 330, 220],
                data: items.map(item => item.ngqty),
              },
            ],
          };
        });
      })
    }
  }

  onChartClick(event){
    this.eclassChange.emit(event.name);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
