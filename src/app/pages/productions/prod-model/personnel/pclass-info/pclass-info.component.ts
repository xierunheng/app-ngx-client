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
import { IPclass, Pclass } from '../../../../../@core/model/pclass';
import { PclassService } from '../../../../../@core/data/pclass.service';

@Component({
  selector: 'mes-pclass-info',
  templateUrl: './pclass-info.component.html',
  styleUrls: ['./pclass-info.component.scss'],
})
export class PclassInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IPclass = new Pclass();

   // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: PclassService,
    protected ref: NbDialogRef<PclassInfoComponent>) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit(): void {
        console.log(this.model);
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
