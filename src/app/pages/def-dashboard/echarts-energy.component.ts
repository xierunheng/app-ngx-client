import { AfterViewInit, Component, OnDestroy, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { IHierarchyScope } from '../../@core/model/hs';
import { HsService } from '../../@core/data/hs.service';
import { EnDefService } from '../../@core/data/endef.service';
import { Router }  from '@angular/router';

@Component({
  selector: 'ngx-echarts-energy',
  template: `
    <div echarts [options]="options" class="echart" (chartClick)="onChartClick($event)"></div>
  `,
})
export class EchartsEnergyComponent implements AfterViewInit, OnDestroy {
  @Input()
  set hs(hs: IHierarchyScope) {
    this.init(hs);
  }
  options: any = {};
  themeSubscription: any;

  constructor(private theme: NbThemeService,
    private enService: EnDefService,
    private _router: Router) {
  }
  
  init(hs: IHierarchyScope): void {
    this.enService.aggrClass(hs).subscribe(items => {
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
              name: '能源类型',
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
  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    if(this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  onChartClick(event){
    this._router.navigate(['/pages/productions/energy'],{ queryParams: { name: event.name } }); 
      console.log(event);
  }
}
