import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'mes-chart-panel-header',
  styleUrls: ['./chart-panel-header.component.scss'],
  templateUrl: './chart-panel-header.component.html',
})
export class ChartPanelHeaderComponent implements OnDestroy {

  private alive = true;

  @Output() periodChange = new EventEmitter<string>();

  @Input() type: string = '周';

 // types: string[] = ['周'];
 // types: string[] = ['week', 'month', 'year'];
  chartLegend: {iconColor: string; title: string}[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  currentTheme: string;

  orderProfitLegend = {
    // firstItem: 'linear-gradient(90deg, #3edd81 0%, #3bddad 100%)',
    // secondItem: 'linear-gradient(90deg, #8d7fff 0%, #b17fff 100%)',
    // thirdItem: 'rgba(236, 242, 245, 0.8)',
    firstItem: '#719efc',
    secondItem: '#5dcfe3',
    thirdItem: '#e3ecfe',
    fourthItem: '#800080',
    fifthItem: '#00FF00',
  };

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
        // console.log('theme.name',this.currentTheme);
        this.setLegendItems();
      });

      this.breakpoints = this.breakpointService.getBreakpointsMap();
      console.log('breakpoints',this.breakpoints);
      this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
          this.breakpoint = newValue;
        });
  }

  setLegendItems() {
    this.chartLegend = [
      {
        iconColor: this.orderProfitLegend.firstItem,
        title: '打浆',
      },
      {
        iconColor: this.orderProfitLegend.secondItem,
        title: '成型',
      },
      {
        iconColor: this.orderProfitLegend.thirdItem,
        title: '打磨',
      },
      {
        iconColor: this.orderProfitLegend.fourthItem,
        title: '喷釉',
      },
      {
        iconColor: this.orderProfitLegend.fifthItem,
        title: '窑烧',
      },
    ];
  }

  // changePeriod(period: string): void {
  //   this.type = period;
  //   this.periodChange.emit(period);
  // }

  ngOnDestroy() {
    this.alive = false;
  }
}
