import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

import * as _ from 'lodash';

import { LiveUpdateChart, EarningData } from '../../../../@core/data/earning';
import { ScadaDataService } from '../../../../@core/data/scadaData.service';

interface IDelta {
  up: boolean;
  value: number;
}

interface ITaktData {
  name: string;
  value: number;
}

interface ITaktDatas {
  name: string;
  data: ITaktData[];
}

@Component({
  selector: 'mes-takt-front-side',
  templateUrl: './takt-front-side.component.html',
  styleUrls: ['./takt-front-side.component.scss']
})
export class TaktFrontSideComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() selectedCurrency: string = '整线';

  intervalSubscription: Subscription;
  currencies: string[] = ['整线', '喷釉', '打磨'];
  currentTheme: string;
  liveUpdateChartData: ITaktDatas[];
  currentValue: number = 0;

  delta: IDelta = {
    up: true,
    value: 0,
  };

  constructor(private themeService: NbThemeService,
    private scadaService: ScadaDataService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit() {
    this.init();
  }

  changeCurrency(currency) {
    if (this.selectedCurrency !== currency) {
      this.selectedCurrency = currency;
      this.init();
    }
  }

  private init() {
    this.scadaService.getPeriods().subscribe(data => {
      this.liveUpdateChartData = [{
        name: '喷釉',
        data: data.SprT
      }, {
        name: '打磨',
        data: data.CT
      }];
      if (data.CT && data.CT > 0) {
        this.currentValue = _.last<ITaktData>(data.CT).value;
      }
      this.startReceivingLiveData(this.selectedCurrency);

    })
  }

  startReceivingLiveData(currency) {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(10 * 1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.scadaService.getPeriod()),
      )
      .subscribe(data => {
        this.currentValue = data.CT.quantity;
        this.liveUpdateChartData.forEach(item => {
          if (item.data.length >= 100) {
            item.data.shift();
          }
          item.data.push({
            value: item.name === '喷釉' ? data.SprT.quantity : data.CT.quantity,
            name: new Date().toISOString(),
          })
        })
        this.liveUpdateChartData = [...this.liveUpdateChartData];
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
