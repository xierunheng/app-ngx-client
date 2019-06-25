import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'mes-integration-energy-daily',
  templateUrl: './integration-energy-daily.component.html',
  styleUrls: ['./integration-energy-daily.component.scss']
})
export class IntegrationEnergyDailyComponent implements OnDestroy {

  private alive = true;

  progressInfoData: any[] = [
    {
      title: '综合能耗',
      value: '11.89',
      activeProgress: 70,
      description: 'Better than last week (70%)',
    },
    {
      title: '新增天然气',
      value: 2378,
      activeProgress: 30,
      description: 'Better than last week (30%)',
    },
    {
      title: '新增电量',
      value: 1234,
      activeProgress: 43,
      description: 'Better than last week (43%)',
    },
    {
      title: '新增成品',
      value: 200,
      activeProgress: 55,
      description: 'Better than last week (55%)',
    },
  ];

  constructor() {
  }

  ngOnDestroy() {
    this.alive = true;
  }
}
