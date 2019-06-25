import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, of, interval, Subscription } from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';

import { NbDialogService } from '@nebular/theme';
import { NbThemeService } from '@nebular/theme';

import * as _ from 'lodash';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
//import { WorkAlert } from '../../../../@core/model/work-alert';
import { UtilData, IDCmpFn, TableSettings } from '../../@core/data/util.service';
import { ScadaDataService } from '../../@core/data/scadaData.service';
import { WorkAlertService } from '../../@core/data/work-alert.service';
import { MyechartBarComponent } from '../charts/echarts/myechart-bar/myechart-bar.component';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  on: boolean;
}

@Component({
  selector: 'mes-emaint-dashboard',
  templateUrl: './emaint-dashboard.component.html',
  styleUrls: ['./emaint-dashboard.component.scss']
})
export class EmaintDashboardComponent implements OnInit, OnDestroy {
  private alive = true;
  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  solarValue: number;

  intervalSubscription: Subscription;

  rollerShadesCard: CardSettings = {
    title: '喷釉机器人',
    iconClass: 'nb-roller-shades',
    type: 'success',
    on: true,
  };
  wirelessAudioCard: CardSettings = {
    title: '打磨机器人',
    iconClass: 'nb-audio',
    type: 'info',
    on: true,
  };

  statusCards: CardSettings[];

  progressData: any[];

  commonStatusCardsSet: CardSettings[] = [
    this.wirelessAudioCard,
    this.rollerShadesCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
      default: this.commonStatusCardsSet,
      cosmic: this.commonStatusCardsSet,
      corporate: [
        {
          ...this.wirelessAudioCard,
          type: 'danger',
        },
        {
          ...this.rollerShadesCard,
          type: 'primary',
        },
      ],
    };

  constructor(private location: Location,
    private themeService: NbThemeService,
    private Service: WorkAlertService,
    private scadaService: ScadaDataService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
      });

  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.scadaService.getProductionLine().subscribe(data => {
      this.progressData = [{
        title: '运行总时间',
        value: data.WorkT
      }, {
        title: '总上料数',
        value: `${data.MCNT.quantity}${data.MCNT.unit}`
      }];
      this.statusCards.map(item => item.on = data.ONOFF);
      this.startReceivingLiveData();
    })
  }

  startReceivingLiveData() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(30 * 1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.scadaService.getProductionLine()),
      )
      .subscribe(data => {
        this.progressData = [{
          title: '运行总时间',
          value: data.WorkT
        }, {
          title: '总上料数',
          value: `${data.MCNT.quantity}${data.MCNT.unit}`
        }];
        this.statusCards.map(item => item.on = data.ONOFF);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
