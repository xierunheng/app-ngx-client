import { Component, OnDestroy } from '@angular/core';
import { StatsBarData } from '../../../../@core/data/stats-bar';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'mes-i-qc-back-side',
  templateUrl: './i-qc-back-side.component.html',
  styleUrls: ['./i-qc-back-side.component.scss']
})
export class IQcBackSideComponent implements OnDestroy {

  private alive = true;

  chartData: number[];

  constructor(private statsBarData: StatsBarData) {
    this.statsBarData.getStatsBarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.chartData = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
