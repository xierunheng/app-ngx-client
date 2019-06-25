import { Component, OnDestroy, OnInit } from '@angular/core';
import { PieChart, EarningData } from '../../../../@core/data/earning';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'mes-output-back-side',
	templateUrl: './output-back-side.component.html',
	styleUrls: ['./output-back-side.component.scss']
})
export class OutputBackSideComponent implements OnInit, OnDestroy {
	private alive = true;

  earningPieChartData: PieChart[];
  name: string;
  color: string;
  value: number;
  defaultSelectedCurrency: string = 'Bitcoin';

  constructor(private earningService: EarningData ) {
    this.earningService.getEarningPieChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((earningPieChartData) => {
        this.earningPieChartData = earningPieChartData;
      });
  }

  changeChartInfo(pieData: {value: number; name: string; color: any}) {
    this.value = pieData.value;
    this.name = pieData.name;
    this.color = pieData.color;
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
