import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { UtilData, TableSettings } from '../../../@core/data/util.service';
import { WorkRequestService } from '../../../@core/data/work-req.service';
import { JobOrderService } from '../../../@core/data/job-order.service';
import { IWorkRequest, WorkRequest, IWorkRequestProfile } from '../../../@core/model/work-req';
import { IJobOrder, JobOrder, IJobOrderElite, JobOrderElite } from '../../../@core/model/job-order';
import { WorkReqInfoComponent } from './work-req-info/work-req-info.component';
import { JobOrderInfoComponent } from './job-order-info/job-order-info.component';

import * as moment from 'moment';

@Component({
  selector: 'mes-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  workReq: IWorkRequest[];

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  wreqTree: TreeviewItem[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: WorkRequestService,
    private jrService: JobOrderService,
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
      desc: {
        title: '描述',
        type: 'html',
        valuePrepareFunction: (desc, row) => {
          return row.desc ? `<div class="bg-success text-white">${row.desc}</div>` : '';
        },
      },
      workType: {
        title: '类型',
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
      startTime: {
        title: '起始时间',
        type: 'string',
        valuePrepareFunction: (startTime, row) => {
          return row.startTime ? moment(row.startTime).format('YYYY-MM-DD') : '';
        },
      },
      endTime: {
        title: '结束时间',
        type: 'string',
        valuePrepareFunction: (endTime, row) => {
          return row.endTime ? moment(row.endTime).format('YYYY-MM-DD') : '';
        },
      },
      priority: {
        title: '优先级',
        type: 'number',
      },
      opReq: {
        title: '操作计划',
        type: 'html',
        valuePrepareFunction: (opReq, row) => {
          return row.opReq && row.opReq.length > 0 ?
            row.opReq.map(item => `<a href="/#/pages/ops/opreq/${item._id}" routerLinkActive="active">${item.oid}</a>`).join(',') : '';
        },
        filterFunction: (value, search) => {
          return value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
        }
      },
    }
  }

  ngOnInit() {
    this.init();
  }

  init(): void {
    this.loading = true;
    this.service.getWorkRequests().subscribe(wreqs => {
      this.source.load(wreqs);
      this.workReq = wreqs;
      this.wreqTree = this.service.createWreqTree(wreqs);
      this.loading = false;
    })
  }

  /**
   * [创建新的工作请求]
   * @param {IWorkRequest = undefined} wreq [description]
   */
  createWorkReq(wreq: IWorkRequest = undefined): void {
    this.dialogServie.open(WorkReqInfoComponent, {
      context: {
        title: `新建 工作请求`,
        model: wreq || new WorkRequest()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createWorkRequest(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的工单]
   * @param {IJobOrder = undefined} jr [description]
   */
  createJr(jr: IJobOrder = undefined): void {
    this.dialogServie.open(JobOrderInfoComponent, {
      context: {
        title: `新建 工单`,
        model: jr || new JobOrder()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.jrService.createJobOrder(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改 workReq]
   * @param {IWorkRequest} wreq [description]
   */
  editWorkReq(wreq: IWorkRequest): void {
    let modelObserver = jsonpatch.observe(wreq);
    this.dialogServie.open(WorkReqInfoComponent, {
      context: {
        title: `更新 工作请求[${wreq.oid}] 信息`,
        model: wreq
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchWorkRequest(wreq._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  editJr(jr: IJobOrder): void {
    this.jrService.getJobOrder(jr._id).subscribe(jr => {
      //  let jr = new JobOrder(jr);
      let modelObserver = jsonpatch.observe(jr);
      this.dialogServie.open(JobOrderInfoComponent, {
        context: {
          title: `更新 工单[${jr.oid}] 信息`,
          model: jr,
        }
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.jrService.patchJobOrder(jr, patch).subscribe(item => {
            this.init();
          })
        }
      })
    })

  }

  /**
   * [删除 workreq]
   * @param {IWorkRequest} wreq [description]
   */
  removeWreq(wreq: IWorkRequest): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteWorkRequest(wreq).subscribe(() => {
        this.init();
      });
    }
  }

  // /**
  //  * [删除 joborder]
  //  * @param {IJobOrder} jr [description]
  //  */
  // removeJr(jr: IJobOrder): void {
  //   if (window.confirm(UtilData.txtDeleteRowDes)) {
  //     this.jrService.deleteJobOrder(jr).subscribe(() => {
  //       this.init();
  //     });
  //   }
  // }

  addItem(item): void {
    let joborder = new JobOrder();
    // joborder.DeriveFromPclasss([item]);
    //增加员工
    this.createJr(joborder);
  }

  editItem(item): void {
    console.log(item);
    if (item.jobOrder) {
      this.editWorkReq(item);
    } else {
      //修改joborder
      this.editJr(item);
    }
  }

  removeItem(item): void {
    this.removeWreq(item);
    // if (item.jobOrder) {
    //   //删除workreq
    //   this.removeWreq(item);
    // } else {
    //   //删除joborder
    //   this.removeJr(item);
    // }
  }

  showItem(item): void {
    console.log(item,"item.value!!!")
    if(item.jobOrder) {
      this.router.navigate(['../jobOrder/work-show/', item.oid], { relativeTo: this.route });
    } else {
      this.router.navigate(['../jobOrder/jobOrder-show/', item.oid], { relativeTo: this.route });
    }
  }

  onDelete(event): void {
    this.service.deleteWorkRequest(event).subscribe(() => { });
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

  ngOnDestroy() {
    // this.SocketService.unsyncUpdates('thing');
  }


}
