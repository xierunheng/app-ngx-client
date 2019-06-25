import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../@core/model/global';
import { TreeviewI18n, TreeviewItem } from 'ngx-treeview';

import { UtilData, IDCmpFn, OIDCmpFn } from '../../../../@core/data/util.service';
import { IPaclass, Paclass } from '../../../../@core/model/paclass';
import { PaclassService } from '../../../../@core/data/paclass.service';
import { treeConfig, ViewConfig } from '../../../../@core/utils/config';
import { SupplierService } from '../../../../@core/data/supplier.service';

@Component({
  selector: 'mes-pa-class-info',
  templateUrl: './pa-class-info.component.html',
  styleUrls: ['./pa-class-info.component.scss']
})
export class PaClassInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IPaclass = new Paclass();

  // manutree: TreeviewItem[];

  //多选的 ngx-treeview
  multiConfig = treeConfig.multi;

   // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //生产厂家编号可选项
  manufactures: any[];
  manufactureCmpFn = OIDCmpFn;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: PaclassService,
    private sService: SupplierService,
    protected ref: NbDialogRef<PaClassInfoComponent>) {
     }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit() {
    this.manufactures = this.sService.getMfactureData();
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    console.log(this.model);
    this.ref.close(this.model);
  }

}
