import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
// import * as _ from 'lodash';
import { UtilData, TableSettings,WorkData } from '../../../../@core/data/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { WorkResponseService } from '../../../../@core/data/work-res.service';
import { IWorkResponse, IWorkResponseProfile,WorkResponse } from '../../../../@core/model/work-res';
import * as moment from 'moment';
import { NbDialogService } from '@nebular/theme';
import {WorkResInfoComponent} from '../work-res-info/work-res-info.component';
import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'ngx-work-res',
  templateUrl: './work-res.component.html',
  styleUrls: ['./work-res.component.scss']
})
export class WorkResComponent implements OnInit {
   workres: IWorkResponseProfile[];
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';
  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();
  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  wresTree: TreeviewItem[];

  initSetting(): void{
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: 'ID',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
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
          return row.startTime ? moment(row.startTime).format('YYYY-MM-DD HH:mm') : '';
        },
      },
      endTime: {
        title: '结束时间',
        type: 'string',
        valuePrepareFunction: (endTime, row) => {
          return row.endTime ? moment(row.endTime).format('YYYY-MM-DD HH:mm') : '';
        },
      },
      state: {
        title: '状态',
        type: 'string',
      },
      req: {
        title: '作业请求',
        type: 'html',
        valuePrepareFunction: (req, row) => {
          return row.req ? `<a href="/#/pages/works/workreq/${row.req._id}" routerLinkActive="active">${row.req.oid}</a>` : '';
        },
        filterFunction: (value, search) => {
          return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
   }
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: WorkResponseService,
    private dialogServie: NbDialogService) { 
      this.initSetting();
  }

  ngOnInit() {
      this.init();
  }

  init(): void{
    this.loading = true;
    this.service.getWorkResponsesProfile()
      .subscribe(wres => {
          console.log(wres);
        this.source.load(wres)  
        this.workres = wres;
        this.wresTree = this.service.createWresTree(wres);

      });

      this.loading = false;
  }

  /**
   * [创建新的工作响应]
   * @param {IWorkResponse = undefined} wreq [description]
   */
  createWorkRes(wreq: IWorkResponse = undefined): void {
    this.dialogServie.open(WorkResInfoComponent, {
      context: {
        title: `新建 工作响应`,
        model: wreq || new WorkResponse()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createWorkResponse(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改 workRes]
   * @param {IWorkResponse} wres [description]
   */
  editWorkRes(wres: IWorkResponse): void {
    let modelObserver = jsonpatch.observe(wres);
    this.dialogServie.open(WorkResInfoComponent, {
      context: {
        title: `查看作业响应 信息`,
        model: wres
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchWorkResponse(wres._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  // editJr(jr: IJobOrder): void {
  //   let modelObserver = jsonpatch.observe(jr);
  //   this.dialogServie.open(JobOrderInfoComponent, {
  //     context: {
  //       title: `更新 工单[${jr.oid}] 信息`,
  //       model: jr,
  //     }
  //   }).onClose.subscribe(rn => {
  //     if (rn) {
  //       let patch = jsonpatch.generate(modelObserver);
  //       this.jrService.patchJobOrder(jr, patch).subscribe(item =>{
  //         this.init();
  //       })
  //     }
  //   })
  // }

  editItem(item): void {
    if (item.jobResponse) {
        this.editWorkRes(item);
    } else {
        //修改jobresponse
        // this.editJr(item);
    }
  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

}
