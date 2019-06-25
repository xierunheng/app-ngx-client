import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { LocalDataSource } from 'ng2-smart-table';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { TerminalDefService } from '../../../@core/data/terminal-def.service';
import { ITerminalDef, TerminalDef } from '../../../@core/model/terminal-def';
import { UtilData, TableSettings } from '../../../@core/data/util.service';

import { TerminalDefInfoComponent } from './terminal-def-info/terminal-def-info.component';

@Component({
  selector: 'mes-terminal-def',
  templateUrl: './terminal-def.component.html',
  styleUrls: ['./terminal-def.component.scss']
})
export class TerminalDefComponent implements OnInit {

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  tds: ITerminalDef[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: TerminalDefService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '终端定义名称',
        type: 'string',
      },
      desc: {
        title: '描述',
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
      prop: {
        title: '终端列',
        type: 'html',
        valuePrepareFunction: (prop, row) => {
          return `<a href="#/pages/productions/personnel/person/?pclass.oid=${row.oid}">${row.prop ? row.prop.length : 0}个</a>`;
        }
      },

    };
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.loading = true;
    this.service.getTerminalDefs().subscribe(tds => {
      console.log(tds);
      this.source.load(tds);
      this.loading = false;
    });
  }

  /**
   * [创建新的TerminalDef]
   * @param {ITerminalDef = undefined} td [description]
   */
  createTD(td: ITerminalDef = undefined): void {
    this.dialogServie.open(TerminalDefInfoComponent, {
      context: {
        title: `新建 终端定义`,
        model: td || new TerminalDef()
      },
    }).onClose.subscribe(rn => {
      console.log(rn);
      if (rn) {
        this.service.createTerminalDef(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改hs]
   * @param {ITerminalDef} td [description]
   */
  editTD(td: ITerminalDef): void {
    console.log(td);
    let modelObserver = jsonpatch.observe(td);
    this.dialogServie.open(TerminalDefInfoComponent, {
      context: {
        title: `更新 [${td.oid}] 信息`,
        model: td
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchTerminalDef(td._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [删除pclass]
   * @param {ITerminalDef} td [description]
   */
  removeTD(td: ITerminalDef): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteTerminalDef(td).subscribe(() => {
        this.init();
      });
    }
  }

  onDelete(event): void {
    this.service.getTerminalDef(event).subscribe(() => { });
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }


}
