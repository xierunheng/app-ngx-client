import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../@core/model/global';

import { NbDialogRef } from '@nebular/theme';

import { UtilData, WorkData, IDCmpFn, TableSettings, winSize } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';
import { IWorkRequest, WorkRequest } from '../../../../@core/model/work-req';
import { WorkRequestService } from '../../../../@core/data/work-req.service';

@Component({
  selector: 'mes-work-req-info',
  templateUrl: './work-req-info.component.html',
  styleUrls: ['./work-req-info.component.scss']
})
export class WorkReqInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's WorkMasterSchema
  //model: IWorkRequest;
  @Input() model: IWorkRequest = new WorkRequest();
  modelObserver: any;

  //界面配置接口
  //vConfig: ViewConfig;

  // opType 的可选项
  workTypes: string[] = WorkData.opTypes;

  ssize: string;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: WorkRequestService,
    protected ref: NbDialogRef<WorkReqInfoComponent>) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit(): void {
     //根据高度大小确定弹窗的大小
    this.ssize = winSize();
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
