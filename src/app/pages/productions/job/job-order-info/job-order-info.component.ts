import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../@core/model/global';

import { NbDialogRef } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';
import { IQuantity, Quantity } from '../../../../@core/model/common';
import { UtilData, IDCmpFn, WorkData, MaterialData, TableSettings, winSize } from '../../../../@core/data/util.service';
import { treeConfig, ViewConfig } from '../../../../@core/utils/config';
import { IWorkMasterElite } from '../../../../@core/model/work-master';
import { WorkMasterService } from '../../../../@core/data/work-master.service';
import { IJobOrder, JobOrder } from '../../../../@core/model/job-order';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { PersonService } from '../../../../@core/data/person.service';
import { SmsService } from '../../../../@core/data/sms.service';

@Component({
  selector: 'mes-job-order-info',
  templateUrl: './job-order-info.component.html',
  styleUrls: ['./job-order-info.component.scss']
})
export class JobOrderInfoComponent implements OnInit {

  // array of WorkMaster
  wms: IWorkMasterElite[];

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's WorkMasterSchema
  //model: IJobOrder;
  @Input() model: IJobOrder;

  //modelObserver: any;

  //在model中的get方法，不能直接在界面上用，必须要一个中转
  qty: IQuantity = new Quantity({
      quantity: 0,
      unit: '件'
    });

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  ssize: string;

  //界面配置接口
 // vConfig: ViewConfig;

  // opType 的可选项
  workTypes: string[] = WorkData.opTypes;

  tags: string[] = [UtilData.txtTags[3]];

  /**
   * [是否为成型工单，成型工单实际做的是坯体选择的操作，
   * 不是真正的生产，所以要特别对待]
   * @return {boolean} [description]
   */
  get isMolding(): boolean {
    return this.model && this.model.master && this.model.master.oid.includes(MaterialData.BodyOps.mold.name);
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: JobOrderService,
    private pService: PersonService,
    private smsService: SmsService,
    private wmService: WorkMasterService,
    protected ref: NbDialogRef<JobOrderInfoComponent>) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit(): void {

     //根据高度大小确定弹窗的大小
    this.ssize = winSize();

   // console.log(this.model);

   for(let i=0; i<this.model.mReq.length; i++) {
     this.qty.quantity = this.qty.quantity + this.model.mReq[i].qty.quantity;
   }

    this.wmService.getWorkMastersElite()
      .subscribe(wms => {
        this.wms = wms;
      });
  }


  onHsChange(event) {
    // TODO:需要给用户一个提示
    if (window.confirm('工单层级结构改变，员工、设备、物料需求的层级结构是否跟随改变？')) {
      this.service.changeHs(this.model);
    }
  }


  cancel(): void {
    this.ref.close();
  }

  /**
   * [跳去 搬坯计划]
   */
  bodySelect(): void {
    this.router.navigate(['./bodyselect'], { relativeTo: this.route });
  }

  /**
   * [短信通知成型工交坯]
   */
  sendSms(): void {
    if(window.confirm(`即将发送[${this.model.pReq.length}条]短信通知成型工，是否继续？`)) {
      this.model.pReq.forEach(pr => {
        let content = '交坯:';
        pr.opprop.forEach(opp => {
          content += `${opp.oid}[${opp.qty.quantity}${opp.qty.unit}];`;
        });
        this.pService.getPerson(pr.person._id).subscribe(person => {
          console.log(person.mobile);
          console.log(content);
          this.smsService.send(person.mobile, content).subscribe(item => {
            console.log(item);
          })
        })
      })
    }
  }

  onDelete(event): void {
    console.log(event);
    this.service.deleteJobOrder(event).subscribe(() => {
    });
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
