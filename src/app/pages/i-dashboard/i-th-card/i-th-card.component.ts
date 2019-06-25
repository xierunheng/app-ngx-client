import { Component, OnDestroy } from '@angular/core';
import { TrafficList, TrafficListData } from '../../../@core/data/traffic-list';
import { TrafficBarData, TrafficBar } from '../../../@core/data/traffic-bar';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'mes-i-th-card',
  templateUrl: './i-th-card.component.html',
  styleUrls: ['./i-th-card.component.scss']
})
export class IThCardComponent implements OnDestroy {

  private alive = true;

  trafficBarData: TrafficBar;
  trafficListData: TrafficList;
  revealed = false;
  period: string = 'week';

  constructor(private trafficListService: TrafficListData,
              private trafficBarService: TrafficBarData) {
    this.getTrafficFrontCardData(this.period);
    this.getTrafficBackCardData(this.period);
  }

  toggleView() {
    this.revealed = !this.revealed;
  }

  setPeriodAngGetData(value: string): void {
    this.period = value;

    this.getTrafficFrontCardData(value);
    this.getTrafficBackCardData(value);
  }

  getTrafficBackCardData(period: string) {
    this.trafficBarService.getTrafficBarData(period)
      .pipe(takeWhile(() => this.alive ))
      .subscribe(trafficBarData => {
        this.trafficBarData = trafficBarData;
      });
  }

  getTrafficFrontCardData(period: string) {
    this.trafficListService.getTrafficListData(period)
      .pipe(takeWhile(() => this.alive ))
      .subscribe(trafficListData => {
        this.trafficListData = trafficListData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
