import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../../@core/model/hs';
import { HsService } from '../../../@core/data/hs.service';
import { PsubService } from '../../../@core/data/psub.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'mes-psub-person',
  template: `
    <div echarts [options]="options" class="echart" (chartClick)="onChartClick($event)"></div>
  `,
  styles: []
})
export class PsubPersonComponent implements AfterViewInit, OnDestroy {
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

  _pclass: string;
  @Input() 
  set pclass(pclass: string) {
    this._pclass = pclass;
    this.init();
  }
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private hsService: HsService,
    private psubService: PsubService,
    private _router: Router) {
  }

  init(): void {
    if(this._hs && this._startTime && this._endTime && this._pclass) {
    this.psubService.aggr('person', this._hs, this._startTime, this._endTime, {'pclass.oid': this._pclass}).subscribe(items => {
      console.log(items);
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

        const colors = config.variables;
        const echarts: any = config.variables.echarts;

        this.options = {
          backgroundColor: echarts.bg,
          color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            // orient: 'vertical',
            top:'0',
            left:'1%',
            // data: ['USA', 'Germany', 'France', 'Canada', 'Russia'],
            data: items.map(item => item.name.oid),
            textStyle: {
              color: echarts.textColor,
            },
            type:'scroll',
          },
          series: [
            {
              // name: 'Countries',
              name: '作业数量',
              type: 'pie',
              radius: '70%',
              center: ['50%', '60%'],
              data: items.map(item => {
                return {
                  value: item.qty,
                  name: item.name.oid
                }
              }),
              // data: [
              //   { value: 335, name: 'Germany' },
              //   { value: 310, name: 'France' },
              //   { value: 234, name: 'Canada' },
              //   { value: 135, name: 'Russia' },
              //   { value: 1548, name: 'USA' },
              // ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: echarts.itemHoverShadowColor,
                },
              },
              label: {
                normal: {
                  textStyle: {
                    color: echarts.textColor,
                  },
                },
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: echarts.axisLineColor,
                  },
                },
              },
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
    if(this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onChartClick(event){
    this._router.navigate(['/pages/productions/personnel'],{ queryParams: { name: event.name } }); 
  }
}
