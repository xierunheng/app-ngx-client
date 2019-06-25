import { Component, OnInit } from '@angular/core';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { LocalDataSource } from 'ng2-smart-table';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { IJobResponse, IJobResponseProfile } from '../../../../@core/model/job-response';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ngx-job-res',
  templateUrl: './job-res.component.html',
  styleUrls: ['./job-res.component.scss']
})
export class JobResComponent implements OnInit {

  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();
  workRes: IJobResponse[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false; 

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: JobResponseService) { 
      this.initSetting();
  }

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
    qty: {
      title: '数量',
      type: 'string',
      valuePrepareFunction: (qty, row) => {
        return row.qty ? `${row.qty.quantity}${row.qty.unit}` : '';
      },
      filterFunction: (value, search) => {
        return value.quantity && value.unit && `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      },
    },
    ngqty: {
      title: '缺陷数量',
      type: 'string',
      valuePrepareFunction: (ngqty, row) => {
        return row.ngqty ? `${row.ngqty.quantity}${row.ngqty.unit}` : '';
      },
      filterFunction: (value, search) => {
        return value.quantity && value.unit && `${value.quantity}${value.unit}`.toString().toLowerCase().includes(search.toString().toLowerCase());
      },
    },
    startTime: {
      title: '实际起时',
      type: 'string',
      valuePrepareFunction: (startTime, row) => {
        return row.startTime ? moment(row.startTime).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    endTime: {
      title: '实际终时',
      type: 'string',
      valuePrepareFunction: (endTime, row) => {
        return row.endTime ? moment(row.endTime).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    state: {
      title: '工单状态',
      type: 'string',
    },
    jobOrder: {
      title: '工单请求',
      type: 'html',
      valuePrepareFunction: (jobOrder, row) => {
        return row.jobOrder ? `<a href="/#/pages/works/joborder/${row.jobOrder._id}" routerLinkActive="active">${row.jobOrder.oid}</a>` : '';
      },
      filterFunction: (value, search) => {
        return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    // segRes: {
    //   title: '操作段响应',
    //   type: 'html',
    //   valuePrepareFunction: (segRes, row) => {
    //     return row.segRes && row.segRes.length > 0 ? row.segRes.map(item =>
    //       `<a href="/#/pages/ops/segres/${item._id}" routerLinkActive="active">${item.oid}</a>`).join(',') : '';
    //   },
    //   filterFunction: (value, search) => {
    //     return value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
    //   }
    // },
  }
  }

  ngOnInit() {
      this.init();
      
  }

   init(): void{
    this.loading = true;
    // this.service.getJobResponsesProfile().subscribe(wreqs => {
         
    //   this.source.load(wreqs);
    //   this.workRes = wreqs;
    //   this.loading = false;
    // })
    this.route.queryParams.subscribe((params)=>{
         this.service.getJobResponsesProfileBy(params).subscribe(wreqs=>{
             this.source.load(wreqs);
             this.workRes = wreqs; 
             this.loading = false;  
         })
        console.log(params);
      })
  }

}
