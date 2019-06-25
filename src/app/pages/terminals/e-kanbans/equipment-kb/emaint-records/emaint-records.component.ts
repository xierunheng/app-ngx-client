import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ScadaDataService } from '../../../../../@core/data/scadaData.service';
import { Contacts, RecentUsers, UserData } from '../../../../../@core/data/users';

@Component({
  selector: 'mes-emaint-records',
  templateUrl: './emaint-records.component.html',
  styleUrls: ['../equipment-kb.component.scss','./emaint-records.component.scss']
})
export class EmaintRecordsComponent implements OnInit, OnDestroy, AfterViewInit {

  private alive = true;

  //计划维保的内容
  contacts: any[];

  //最近做的维保内容
  recent: any[];

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

      this.init();
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.init();
    }, 10 * 60  * 1000);  //10分钟更新一次
  }

  init() {
    this.scadaService.getMaintenacePara().subscribe(data => {
      this.recent = _.sortBy(_.values(data), 'time');
      // console.log("设备当前",this.recent);
      this.contacts = this.recent.map(item => {
        switch (item.name) {
          case "枪针更换":
            item['next'] = moment(item.time).add(4, 'M');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "执行";
            item['level'] = '设备';
            break;
          case "海绵更换":            
            item['next'] = moment(item.time).add(2, 'M');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "执行";
            item['level'] = '车间';
            break;
          case "除尘清理":
            item['next'] = moment(item.time).add(15, 'd');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "未执行";
            item['level'] = '车间';
            break;
          case "水帘清理":
            item['next'] = moment(item.time).add(15, 'd');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "未执行";
            item['level'] = '车间';
            break;
          case "恒力维护":
            item['next'] = moment(item.time).add(15, 'd');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "执行";
            item['level'] = '设备';
            break;
          case "打磨机维护":
            item['next'] = moment(item.time).add(7, 'd');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "未执行";
            item['level'] = '设备';
            break;
          case "磨料更换":
            item['next'] = moment(item.time).add(1, 'h');
            item['duration'] = item['next'].diff(moment(), 'days');
            item['status'] = "执行";
            item['level'] = '车间';
            break;
          default:
            break;
        }
        item['deltaUp'] = item['duration'] > 0;
        return item;
      });
      this.contacts = _.sortBy(this.contacts, 'duration');
      // this.
      // console.log("genggai",this.recent);
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }


}
