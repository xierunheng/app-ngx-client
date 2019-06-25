import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../../@core/model/global';

import { UtilData, IDCmpFn, WorkData } from '../../../../../@core/data/util.service';
import { IKpiDef, KpiDef } from '../../../../../@core/model/kpi-def';
import { KpiDefinitionService } from '../../../../../@core/data/kpi-def.service';

@Component({
  selector: 'ngx-kpi-def-info',
  templateUrl: './kpi-def-info.component.html',
  styleUrls: ['./kpi-def-info.component.scss']
})
export class KpiDefInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IKpiDef;

  height : number;
  ssize : string;

   // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: KpiDefinitionService,
    protected ref: NbDialogRef<KpiDefInfoComponent>) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit(): void {
    //获取浏览器窗口的可视区域的高度
    this.height = document.body.clientHeight;
     //根据高度大小确定弹窗的大小
    if ( this.height > 816 ) {
      this.ssize = 'xxlarge';
    } else if ( this.height > 696 ) {
      this.ssize = 'xlarge';
    } else if (this.height > 576 ) {
      this.ssize = 'large';
    } else {
      this.ssize = 'medium';
    }
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
