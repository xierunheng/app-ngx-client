import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { WorkAlertDefService } from '../../../@core/data/work-alert-def.service';
import { IWorkAlertDef, IWorkAlertDefProfile,WorkAlertDef } from '../../../@core/model/work-alert-def';
import { SocketService } from '../../../@core/socket/socket.service';
import { UtilData, TableSettings } from '../../../@core/data/util.service';
import * as jsonpatch from 'fast-json-patch';
import * as _ from 'lodash';
import { NbDialogService } from '@nebular/theme';
import { WorkAlertDefInfoComponent } from './work-alert-def-info/work-alert-def-info.component';



@Component({
  selector: 'work-alert-def',
  templateUrl: './work-alert-def.component.html',
  styleUrls: ['./work-alert-def.component.scss']
})
export class WorkAlertDefComponent implements OnInit {
  // workaldefs: IWorkAlertDefProfile[];
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
        title: '能源名称',
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
      receiveHs: {
        title: '接受部门',
        type: 'string',
        valuePrepareFunction: (receiveHs, row) => {
          return row.receiveHs ? row.receiveHs.map(item => item.name).join(',') : '';
        },
      },
      receivers: {
        title: '接受人',
        type: 'string',
        valuePrepareFunction: (receivers, row) => {
          return row.receivers ? row.receivers.map(item => item.name).join(',') : '';
        },
      },
      priority: {
        title: '等级',
        type: 'string',
      },
      category: {
        title: '类型',
        type: 'string',
      },
    };
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private service: WorkAlertDefService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  ngOnInit() {
    this.init()
  }

  /**
   * [当WorkAlertDef发生变化时，可能会连带其他的WorkAlertDef发生变化，
   * 所以每次发生变化时，需要连带所有的WorkAlertDef都更新]
   */
  init(): void {
    this.loading = true;
    this.service.getWorkAlertDefsProfile().subscribe(paras => {
      this.source.load(paras);
      this.loading = false;
    });
  }

  /**
   * [创建新的WorkAlertDef]
   * @param {IWorkAlertDef = undefined} WorkAlertDef [description]
   */
  create(paras:IWorkAlertDef= undefined): void {
    this.dialogServie.open(WorkAlertDefInfoComponent, {
      context: {
        title: "新建 工作报警定义",
        model: paras || new WorkAlertDef()
      },
    }).onClose.subscribe(rnParas => {
      if(rnParas) {
        this.service.createWorkAlertDef(rnParas).subscribe(item => {
          this.source.prepend(item);
          this.init();
        })
      }
    });
  }

  /**
   * [修改WorkAlertDef]
   * @param {IWorkAlertDef} WorkAlertDef [description]
   */
  
  //发现用了model:data后从smart-table获取的值中receiveHs的值为空，待解决  
  edit(data): void {
    // let olddata: IWorkAlertDef = _.cloneDeep(data);
    let modelObserver = jsonpatch.observe(data);
    this.dialogServie.open(WorkAlertDefInfoComponent, {
      context: {
        title: `更新 [${data.oid}] 信息`,
        model: data
      },
    }).onClose.subscribe(rndata => {
      if(rndata) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchWorkAlertDef(data._id, patch).subscribe(item => {
          this.source.refresh();
          this.init();
        })
      }
    });
  }

  remove(event): void {
    console.log(event);
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteWorkAlertDef(event)
        .subscribe(() => {
          this.source.remove(event);
        });
    }
  }

  ngOnDestroy() {

  }

}
