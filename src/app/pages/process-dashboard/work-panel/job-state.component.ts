import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../../@core/model/hs';
import { HsService } from '../../../@core/data/hs.service';
import { JobResponseService } from '../../../@core/data/job-response.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'process-job-state',
  template: `
    <div echarts [options]="options" class="echart" (chartClick)="onChartClick($event)"></div>
  `,
})
export class JobStateComponent implements AfterViewInit, OnDestroy {
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
    private hsService: HsService,
    private jrService: JobResponseService,
    private _router: Router) {
  }

  init(): void {
    if(this._hs && this._startTime && this._endTime) {
    this.jrService.aggr('state', this._hs, this._startTime, this._endTime).subscribe(items => {
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
            data: items.map(item => item.name),
            textStyle: {
              color: echarts.textColor,
            },
            type:'scroll',
          },
          series: [
            {
              // name: 'Countries',
              name: '工单状态',
              type: 'pie',
              radius: '70%',
              center: ['50%', '60%'],
              data: items,
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
    this._router.navigate(['/pages/productions/jobOrder-res'],{ queryParams: { state: event.name } });
  }
}
