import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as moment from 'moment';
import * as jsonpatch from 'fast-json-patch';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { OpScheduleService } from '../../../../@core/data/op-schedule.service';
import { OpRequestService } from '../../../../@core/data/op-req.service';
import { UtilData, TableSettings, WorkData } from '../../../../@core/data/util.service';
import { IOpSchedule, OpSchedule, IOpScheduleProfile } from '../../../../@core/model/op-schedule';
import { IOpRequest, OpRequest } from '../../../../@core/model/op-req';
import { OpScheduleInfoComponent } from '../op-schedule-info/op-schedule-info.component';
import { OpReqInfoComponent } from '../op-req-info/op-req-info.component';
// import { SocketService } from '../../../../@core/socket/socket.service';

@Component({
  selector: 'mes-op-schedule',
  templateUrl: './op-schedule.component.html',
  styleUrls: ['./op-schedule.component.scss']
})
export class OpScheduleComponent implements OnInit, OnDestroy {
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();
  ops: IOpSchedule[];
  opss: IOpScheduleProfile[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  //树状呈现opsched
  schedTree: TreeviewItem[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: OpScheduleService,
    private oprService: OpRequestService,
    private dialogService: NbDialogService) {
    this.initSetting();
  }

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '名称',
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
      opType: {
        title: '操作类型',
        type: 'string',
      },
      startTime: {
        title: '计划起时',
        type: 'string',
        valuePrepareFunction: (startTime, row) => {
          return row.startTime ? moment(row.startTime).format('YYYY-MM-DD') : '';
        },
      },
      endTime: {
        title: '计划终时',
        type: 'string',
        valuePrepareFunction: (endTime, row) => {
          return row.endTime ? moment(row.endTime).format('YYYY-MM-DD') : '';
        },
      },
      scheduleState: {
        title: '计划状态',
        type: 'string',
      },
      pubDate: {
        title: '发布时间',
        type: 'string',
        valuePrepareFunction: (endTime, row) => {
          return row.pubDate ? moment(row.pubDate).format('YYYY-MM-DD') : '';
        },
      },
    };
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    let query = {};
    query = {'opType':'Maintenance'};
    this.loading = true;
    this.service.getOpSchedulesBy(query).subscribe(opscheds => {
      this.source.load(opscheds);
      this.ops = opscheds;
      this.schedTree = this.service.createSchedTree(opscheds);
      this.loading = false;
    });
  }

  onDelete(event: IOpSchedule): void {
    if (event.scheduleState === WorkData.scheduleStates[1]) {
      window.alert('该维护计划已发布，不可删除!');
      // this.opss = Object.assign({}, this.opss);
    } else {
      //TODO：后续可以把删除的逻辑放在Server端做，
      this.service.getOpSchedule(event._id).subscribe(ops => {
        let oprIds = ops.opReq ? ops.opReq.map(item => item._id) : [];
        console.log(oprIds);
        this.oprService.deleteOpRequests(oprIds).subscribe(() => {
          this.service.deleteOpSchedule(ops).subscribe(() => {
          });
        })
      })
    }
  }

  /**
   * [创建新的维护计划]
   * @param {IOpSchedule = undefined} opsched [description]
   */
  createOpSched(opsched: IOpSchedule = undefined): void {
    this.dialogService.open(OpScheduleInfoComponent, {
      context: {
        title: `新建 维护计划`,
        model: opsched || new OpSchedule()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createOpSchedule(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的 维护操作请求]
   * @param {IOpRequest = undefined} req [description]
   */
  createOpreq(req: IOpRequest = undefined): void {
    this.dialogService.open(OpReqInfoComponent, {
      context: {
        title: `新建 维护操作请求`,
        model: req || new OpRequest()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.oprService.createOpRequest(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [更新 OpSchedule ]
   * @param {IOpSchedule} opsched [description]
   */
  editOpSched(opsched: IOpSchedule): void {
    let modelObserver = jsonpatch.observe(opsched);
    this.dialogService.open(OpScheduleInfoComponent, {
      context: {
        title: `更新 维护计划[${opsched.oid}] 信息`,
        model: opsched
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patcheOpSchedule(opsched._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [更新 Opreq]
   * @param {IOpRequest} opr [description]
   */
  editOpreq(opr: IOpRequest): void {
    this.oprService.getOpRequest(opr._id).subscribe(opr => {
      console.log('opr', opr);
      let opreq = new OpRequest(opr);
      let modelObserver = jsonpatch.observe(opreq);
      this.dialogService.open(OpReqInfoComponent, {
        context: {
          title: `更新 维护操作请求[${opreq.oid}] 信息`,
          model: opreq,
        }
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.oprService.patchOpRequest(opreq._id, patch).subscribe(item =>{
            this.init();
          })
        }
      })
    })
  }

  /**
   * [删除 OpSchedule]
   * @param {IOpSchedule} opsched [description]
   */
  removeOpSched(opsched: IOpSchedule): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      if (opsched.scheduleState === WorkData.scheduleStates[1]) {
        window.alert('该维护计划已发布，不可删除!');
        // this.opss = Object.assign({}, this.opss);
      } else {
        //TODO：后续可以把删除的逻辑放在Server端做，
        this.service.getOpSchedule(opsched._id).subscribe(ops => {
          let oprIds = ops.opReq ? ops.opReq.map(item => item._id) : [];
          console.log(oprIds);
          this.oprService.deleteOpRequests(oprIds).subscribe(() => {
            this.service.deleteOpSchedule(ops).subscribe(() => {
            });
          })
          this.init();
        })
      }
    }
    // if (window.confirm(UtilData.txtDeleteRowDes)) {
    //   this.service.deleteEclass(ec).subscribe(() => {
    //     this.init();
    //   });
    // }
  }

  /**
   * [删除 Opreq]
   * @param {IOpRequest} req [description]
   */
  removeOpreq(req: IOpRequest): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.oprService.deleteOpRequest(req).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.sched.name) {
      //增加维护计划
      this.createOpSched();
    } else {

    }
    // let joborder = new JobOrder();
    //  // joborder.DeriveFromPclasss([item]);
    //   //增加员工
    //   this.createJr(joborder);
  }

  editItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.sched.name) {

    } else if (item.reqState) {
      //修改操作请求
      this.editOpreq(item);
    } else {
      //修改维护操作计划
      this.editOpSched(item);
    }
    // if (item.jobOrder) {
    //     this.editWorkReq(item);
    // } else {
    //     //修改joborder
    //     this.editJr(item);
    // }
  }

  removeItem(item): void {
    console.log(item);
    // this.removeWreq(item);
    // // if (item.jobOrder) {
    // //   //删除workreq
    // //   this.removeWreq(item);
    // // } else {
    // //   //删除joborder
    // //   this.removeJr(item);
    // // }
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }
}
