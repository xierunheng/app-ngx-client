import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import * as _ from 'lodash';
import { SingleEventService } from '../../../../../@core/data/single-event.service';
import { ISingleEvent, IAlarmData} from '../../../../../@core/model/single-event';
import { ScadaDataService } from '../../../../../@core/data/scadaData.service';

@Component({
  selector: 'mes-emaint-events',
  templateUrl: './emaint-events.component.html',
  styleUrls: ['./emaint-events.component.scss']
})
export class EmaintEventsComponent implements OnInit, OnDestroy {
  @Input() 
    set eventOid(eventOid: string) {
      let se: ISingleEvent;
      this.singleEvents.splice(0, 0, se);
    }

  private alive = true;

  currentTheme: string;

  breakpoint: NbMediaBreakpoint;
  breakpoints: any;

  singleEvents: any[] = [{
    oid: 'ea201904210003',
    createdAt: new Date('2019-04-21 11:34:19'),
    eventType: 'Equipment',
    eventSubType: 'Process Data',
    alarmData: [{
      alarmEvent: 'Detected',
      alarmType: 'Deviation',
      priority: 1,
    }],
    hs: {
      name: '示范线',
    },
    deltaUp: false,
  },{
    oid: 'ea201904210002',
    createdAt: new Date('2019-04-21 10:21:52'),
    eventType: 'Material',
    eventSubType: 'Deallocation',
    alarmData: [{
      alarmEvent: 'Detected',
      alarmType: 'Deviation',
      priority: 2,
    }],
    hs: {
      name: '打磨1#',
    },
    deltaUp: true,
  }, {
    oid: 'ea201904210001',
    createdAt: new Date('2019-04-21 08:32:15'),
    eventType: 'Material',
    eventSubType: 'Modification',
    alarmData: [{
      alarmEvent: 'Detected',
      alarmType: 'Deviation',
      priority: 1,
    }],
    hs: {
      name: '喷釉1#',
    },
    deltaUp: true,
  }];

  paras: any[];


  constructor(private themeService: NbThemeService,
              private seService: SingleEventService,
              private scadaService: ScadaDataService,
              private breakpointService: NbMediaBreakpointsService) {
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });

    this.themeService.getJsTheme().pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.scadaService.getSupervision().subscribe(data => {
      console.log('data',data);
      this.paras = _.values(data).filter(item => item.name !== undefined);
      console.log('paras', this.paras);
    })
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
