import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { GlobalData } from '../../../../../@core/model/global';
import { UtilData, IDCmpFn, TableSettings } from '../../../../../@core/data/util.service';
import { ViewConfig } from '../../../../../@core/utils/config';
import { IEclass, Eclass } from '../../../../../@core/model/eclass';
import { EclassService } from '../../../../../@core/data/eclass.service';
import { EquipmentService } from '../../../../../@core/data/equipment.service';


@Component({
  selector: 'mes-eclass-info',
  templateUrl: './eclass-info.component.html',
  styleUrls: ['./eclass-info.component.scss'],
})
export class EclassInfoComponent implements OnInit {
  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IEclass = new Eclass();

   // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private serivce: EclassService,
    private eService: EquipmentService,
    protected ref: NbDialogRef<EclassInfoComponent>) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  // get paras() {
  //   return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[2]));
  // }

  ngOnInit(): void {

  }


  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
