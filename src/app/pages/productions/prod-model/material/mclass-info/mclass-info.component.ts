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

import { UtilData, IDCmpFn } from '../../../../../@core/data/util.service';
import { IMclass, Mclass } from '../../../../../@core/model/mclass';
import { MclassService } from '../../../../../@core/data/mclass.service';

@Component({
  selector: 'ngx-mclass-info',
  templateUrl: './mclass-info.component.html',
  styleUrls: ['./mclass-info.component.scss']
})
export class MclassInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IMclass = new Mclass();

   // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: MclassService,
    protected ref: NbDialogRef<MclassInfoComponent>) { }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit() {
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
