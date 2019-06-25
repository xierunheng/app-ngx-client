import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../@core/model/hs';
import { HsService } from '../../@core/data/hs.service';
import { PersonService } from '../../@core/data/person.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-echarts-person',
  template: `
    <div echarts [options]="options" class="echart" (chartClick)="onChartClick($event)"></div>
  `,
})
export class EchartsPersonComponent implements AfterViewInit, OnDestroy {
  @Input()
  set hs(hs: IHierarchyScope) {
    this.init(hs);
  }
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private hsService: HsService,
    private pService: PersonService,
    private _router: Router) {
  }

  init(hs: IHierarchyScope): void {
    this.pService.aggrClass(hs).subscribe(items => {
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
            top: '0',
            left: '1%',
            // data: ['USA', 'Germany', 'France', 'Canada', 'Russia'],
            data: items.map(item => item.name),
            textStyle: {
              color: echarts.textColor,
            },
            type: 'scroll',
          },
          series: [
            {
              // name: 'Countries',
              name: '员工类型',
              type: 'pie',
              radius: '70%',
              center: ['50%', '60%'],
              data: items,
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

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onChartClick(event) {
    this._router.navigate(['/pages/productions/personnel/person'], { queryParams: { "pclass.oid": event.name } });
    console.log(event);
  }
}
