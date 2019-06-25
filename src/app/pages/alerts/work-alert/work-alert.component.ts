import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { WorkAlertService } from '../../../@core/data/work-alert.service';
import { IWorkAlert, IWorkAlertProfile,WorkAlert } from '../../../@core/model/work-alert';
import { SocketService } from '../../../@core/socket/socket.service';
import { UtilData, TableSettings } from '../../../@core/data/util.service';
import * as jsonpatch from 'fast-json-patch';
import * as _ from 'lodash';
import { NbDialogService } from '@nebular/theme';
import { WorkAlertInfoComponent } from './work-alert-info/work-alert-info.component';

@Component({
  selector: 'work-alert',
  templateUrl: './work-alert.component.html',
  styleUrls: ['./work-alert.component.scss']
})
export class WorkAlertComponent implements OnInit {
  // workalerts: IWorkAlertProfile[];
  settings = {...TableSettings.basic};
  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  source: LocalDataSource = new LocalDataSource();

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '报警名称',
        type: 'string',
      },
      createdAt: {
        title:'报警时间',
        type: 'string',
        valuePrepareFunction: (createdAt, row) => {
           return row.createdAt ? moment(row.createdAt).format('YYYY-MM-DD HH:mm') : '';
        },
      },
      messageText: {
        title: '报警信息',
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
      person: {
        title: '员工',
        type: 'string',
        valuePrepareFunction: (person, row) => {
          return row.person ? `${row.person.oid} [${row.person.name}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      equipment: {
        title: '设备',
        type: 'string',
        valuePrepareFunction: (equipment, row) => {
          return row.equipment ? `${row.equipment.oid} [${row.equipment.name}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      workAlertDef: {
        title: '报警定义',
        type: 'string',
        valuePrepareFunction: (workAlertDef, row) => {
          return row.workAlertDef ? `${row.workAlertDef.oid}` : '';
        },
        filterFunction: (value, search) => {
          return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
      priority: {
        title: '等级',
        type: 'number',
      },
      category: {
        title: '类型',
        type: 'string',
      },
      state: {
        title: '处理状态',
        type: 'string',
      },

    };
  }


  constructor(private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private service: WorkAlertService,
    private dialogServie: NbDialogService) { 
    this.initSetting();
  }



  ngOnInit() {

        this.init()
  }

    /**
   * [当WorkAlert发生变化时，可能会连带其他的WorkAlert发生变化，
   * 所以每次发生变化时，需要连带所有的WorkAlert都更新]
   */
  init(): void {
    this.loading = true;
    this.service.getWorkAlertsProfile().subscribe(alerts => {
      this.source.load(alerts);
      this.loading = false;
    });
  }

  /**
   * [创建新的WorkAlert]
   * @param {IWorkAlert = undefined} WorkAlert [description]
   */
  create(paras:IWorkAlert= undefined): void {
    this.dialogServie.open(WorkAlertInfoComponent, {
      context: {
        title: "新建 工作报警信息",
        model: paras || new WorkAlert()
      },
    }).onClose.subscribe(rnParas => {
      if(rnParas) {
        this.service.createWorkAlert(rnParas).subscribe(item => {
          this.source.prepend(item);
          this.init();
        })
      }
    });
  }

  /**
   * [修改WorkAlert]
   * @param {IWorkAlert} WorkAlert [description]
   */
  
  //发现用了model:data后从smart-table获取的值中receiveHs的值为空，待解决  
  edit(data): void {
    let modelObserver = jsonpatch.observe(data);
    this.dialogServie.open(WorkAlertInfoComponent, {
      context: {
        title: `更新 [${data.oid}] 信息`,
        model: data
      },
    }).onClose.subscribe(rndata => {
      if(rndata) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchWorkAlert(data._id, patch).subscribe(item => {
          this.source.refresh();
          this.init();
        })
      }
    });
  }

  remove(event): void {
    console.log(event);
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteWorkAlert(event)
        .subscribe(() => {
          this.source.remove(event);
        });
    }
  }

  ngOnDestroy() {

  }

}
