import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { forkJoin, interval, Subscription } from 'rxjs';
import { takeWhile, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ScadaDataService } from '../../../@core/data/scadaData.service';
import { Contacts, RecentUsers, UserData } from '../../../@core/data/users';

@Component({
  selector: 'mes-emaint-records',
  templateUrl: './emaint-records.component.html',
  styleUrls: ['./emaint-records.component.scss']
})
export class EmaintRecordsComponent implements OnInit, OnDestroy {

  private alive = true;

  //计划维保的内容
  contacts: any[];

  //最近做的维保内容
  recent: any[];
  intervalSubscription: Subscription;
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;

  constructor(private userService: UserData,
    private themeService: NbThemeService,
    private scadaService: ScadaDataService,
    private breakpointService: NbMediaBreakpointsService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
  }

  ngOnInit() {
    this.scadaService.getMaintenacePara().subscribe(data => {
      this.init(data);
      this.startReceivingLiveData();
    })
  }

  init(data) {
    this.recent = _.sortBy(_.values(data), 'time');
    this.contacts = this.recent.map(item => {
      switch (item.name) {
        case "枪针更换":
          item['next'] = moment(item.time).add(4, 'M');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        case "海绵更换":
          item['next'] = moment(item.time).add(2, 'M');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        case "除尘清理":
          item['next'] = moment(item.time).add(15, 'd');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        case "水帘清理":
          item['next'] = moment(item.time).add(15, 'd');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        case "恒力维护":
          item['next'] = moment(item.time).add(15, 'd');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        case "打磨机维护":
          item['next'] = moment(item.time).add(7, 'd');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        case "磨料更换":
          item['next'] = moment(item.time).add(1, 'h');
          item['duration'] = item['next'].diff(moment(), 'days');
          break;
        default:
          break;
      }
      item['deltaUp'] = item['duration'] > 0;
      return item;
    });
    this.contacts = _.sortBy(this.contacts, 'duration');
    console.log(this.recent);
  }

  startReceivingLiveData() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }

    this.intervalSubscription = interval(10 * 60 * 1000)
      .pipe(
        takeWhile(() => this.alive),
        switchMap(() => this.scadaService.getMaintenacePara()),
      )
      .subscribe(data => {
        this.init(data);
      })
  }


  ngOnDestroy() {
    this.alive = false;
  }


}
