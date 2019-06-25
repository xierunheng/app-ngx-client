import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

import * as _ from 'lodash';

import { ScadaDataService } from '../../../../@core/data/scadaData.service';

interface IDelta {
  up: boolean;
  value: number;
}

interface IOutputData {
  name: string;
  value: number;
}

interface IOutputDatas {
  name: string;
  data: IOutputData[];
}

@Component({
  selector: 'mes-output-front-side',
  templateUrl: './output-front-side.component.html',
  styleUrls: ['./output-front-side.component.scss']
})
export class OutputFrontSideComponent implements OnInit, OnDestroy {
  private alive = true;

  @Input() selectedCurrency: string = '整线';

  intervalSubscription: Subscription;
  currencies: string[] = ['整线', '打磨', '喷釉'];
  currentTheme: string;
  liveUpdateChartData: IOutputDatas[];

  currentValue: number = 0;

  delta: IDelta = {
    up: true,
    value: 4,
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
    this.scadaService.getCountDatas().subscribe(data => {
      this.liveUpdateChartData = [{
        name: '喷釉',
        data: data.PCNT
      }, {
        name: '打磨',
        data: data.PolCNT
      }];
      if (data.PCNT && data.PCNT > 0) {
        this.currentValue = _.last<IOutputData>(data.PCNT).value;
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
        switchMap(() => this.scadaService.getCountData()),
      )
      .subscribe(data => {
        this.currentValue = data.PCNT.quantity;
        this.liveUpdateChartData.forEach(item => {
          if (item.data.length >= 100) {
            item.data.shift();
          }
          item.data.push({
            value: item.name === '喷釉' ? data.PCNT.quantity : data.PolCNT.quantity,
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
