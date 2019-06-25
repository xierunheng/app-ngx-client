import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { GlobalData } from '../../../../@core/model/global';
import { ISingleEvent, SingleEvent } from '../../../../@core/model/single-event';
import { SingleEventService } from '../../../../@core/data/single-event.service';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { SingleEventInfoComponent } from './single-event-info/single-event-info.component';

@Component({
  selector: 'mes-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.scss']
})
export class SingleEventComponent implements OnInit {


  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  singleEvents: ISingleEvent[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: SingleEventService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: 'ID',
        type: 'string',
      },
      objectType: {
        title: '项目类型',
        type: 'string',
      },
      eventType: {
        title: '事件类型',
        type: 'string',
      },
      eventSubType: {
        title: '子类型',
        type: 'string',
      },
      messageText: {
        title: '消息',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      desc: {
        title: '描述',
        type: 'string',
      },
    };

  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.loading = true;
    this.route.queryParams.subscribe(params => {
      this.service.searchSingleEvents(params).subscribe(ses => {
        this.source.load(ses);
        this.singleEvents = ses;
        this.loading = false;
      })
    });
  }

  /**
   * [创建新的singleEvent]
   * @param {ISingleEvent = undefined} hs [description]
   */
  create(se: ISingleEvent = undefined): void {
    this.dialogServie.open(SingleEventInfoComponent, {
      context: {
        title: `新建 报警事件`,
        model: se || new SingleEvent()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createSingleEvent(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改singleEvent]
   * @param {ISingleEvent} se [description]
   */
  edit(se: ISingleEvent): void {
    let modelObserver = jsonpatch.observe(se);
    this.dialogServie.open(SingleEventInfoComponent, {
      context: {
        title: `更新 [${se.oid}] 信息`,
        model: se,
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchSingleEvent(se._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [删除singleEvent]
   * @param {ISingleEvent} se [description]
   */
  remove(se: ISingleEvent): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteSingleEvent(se).subscribe(() => {
        this.init();
      });
    }
  }

  ngOnDestroy() {
  }

}

