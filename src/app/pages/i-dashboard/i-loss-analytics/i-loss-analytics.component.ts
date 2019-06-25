import { Component, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { OutlineData, VisitorsAnalyticsData } from '../../../@core/data/visitors-analytics';
import { MsubLotService } from '../../../@core/data/msublot.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'mes-i-loss-analytics',
  templateUrl: './i-loss-analytics.component.html',
  styleUrls: ['./i-loss-analytics.component.scss']
})
export class ILossAnalyticsComponent implements OnDestroy {
  private alive = true;

  pieChartValue: number;
  pieData: any[];
  lineData: any[];
  chartLegend: {iconColor: string; title: string}[];
  visitorsAnalyticsData: { innerLine: number[]; outerLine: OutlineData[]; };

  constructor(private themeService: NbThemeService,
              private visitorsAnalyticsChartService: VisitorsAnalyticsData,
              private mslService: MsubLotService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.setLegendItems(theme.variables.orderProfitLegend);
      });
    this.mslService.aggregate('qcTime', {count: 1}, {
      startTime: moment().subtract(1, 'year').toDate(),
      endTime: moment(),
    }, {
      year: 'qcTime',
      month: 'qcTime',
      qcState: 'qcState',
    }).subscribe(data => {
      let lossData = data.filter(item => item.qcState === 'Scraped' ||
        item.qcState === 'Idle' ||
        item.qcState === 'Defective');
      this.pieData = [];
      _.forOwn(_.groupBy(lossData, 'qcState'), (value, key) => {
        this.pieData.push({
          name: key,
          value: _.sumBy(value, 'count'),
        });
      });

      this.lineData = lossData.map(item => {
        return {
          date: `${item.year}-${item.month}`,
          qcState: item.qcState,
          count: item.count,
        }
      });
      console.log(this.lineData);

    });

    forkJoin(
      this.visitorsAnalyticsChartService.getInnerLineChartData(),
      this.visitorsAnalyticsChartService.getOutlineLineChartData(),
      this.visitorsAnalyticsChartService.getPieChartData(),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([innerLine, outerLine, pieChartValue]: [number[], OutlineData[], number]) => {
        this.visitorsAnalyticsData = {
          innerLine: innerLine,
          outerLine: outerLine,
        };
        console.log(this.visitorsAnalyticsData);

        this.pieChartValue = pieChartValue;
      });
  }

  setLegendItems(orderProfitLegend): void {
    this.chartLegend = [
      {
        iconColor: orderProfitLegend.firstIcon,
        title: '生产损失',
      },
      {
        iconColor: orderProfitLegend.secondIcon,
        title: '储运损失',
      },
      {
        iconColor: orderProfitLegend.thirdItem,
        title: '其他损失',
      },
    ];
  }

  ngOnDestroy() {
    this.alive = false;
  }
}

