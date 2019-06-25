import { Component, OnInit } from '@angular/core';
import { ProfitBarAnimationChartData } from '../../../../@core/data/profit-bar-animation-chart';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'mes-i-qc-front-side',
  templateUrl: './i-qc-front-side.component.html',
  styleUrls: ['./i-qc-front-side.component.scss']
})
export class IQcFrontSideComponent implements OnInit {

  private alive = true;

  linesData: { firstLine: number[]; secondLine: number[] };

  constructor(private profitBarAnimationChartService: ProfitBarAnimationChartData) {
    this.profitBarAnimationChartService.getChartData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((linesData) => {
        this.linesData = linesData;
      });
  }

  
  ngOnInit() {
  }

}
