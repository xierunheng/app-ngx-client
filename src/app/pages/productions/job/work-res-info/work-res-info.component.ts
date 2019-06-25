import { Component, OnInit ,Input} from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../@core/model/global';

import { NbDialogRef } from '@nebular/theme';

import { UtilData, WorkData, IDCmpFn, TableSettings, winSize } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';
import { WorkResponseService } from '../../../../@core/data/work-res.service';
import { IWorkResponse, IWorkResponseProfile,WorkResponse } from '../../../../@core/model/work-res';

@Component({
  selector: 'ngx-work-res-info',
  templateUrl: './work-res-info.component.html',
  styleUrls: ['./work-res-info.component.scss']
})
export class WorkResInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's WorkMasterSchema
  //model: IWorkResponse;
  @Input() model: IWorkResponse = new WorkResponse();
  modelObserver: any;
  // tree-select 的比较函数
  idCmpFn = IDCmpFn;
  ssize: string;

  constructor(protected ref: NbDialogRef<WorkResInfoComponent>) { }


  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit() {
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
