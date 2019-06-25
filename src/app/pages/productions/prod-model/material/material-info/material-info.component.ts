import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogRef } from '@nebular/theme';
import { GlobalData } from '../../../../../@core/model/global';

import { UtilData, IDCmpFn, TableSettings, MaterialData } from '../../../../../@core/data/util.service';
import { ViewConfig } from '../../../../../@core/utils/config';
import { IMclassElite } from '../../../../../@core/model/mclass';
import { MclassService } from '../../../../../@core/data/mclass.service';
import { IMdef, Mdef } from '../../../../../@core/model/mdef';
import { MdefService } from '../../../../../@core/data/mdef.service';

@Component({
  selector: 'ngx-material-info',
  templateUrl: './material-info.component.html',
  styleUrls: ['./material-info.component.scss']
})
export class MaterialInfoComponent implements OnInit {

  // array of Pclass, 员工类型
  mcs: IMclassElite[];

  @Input() title: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IMdef;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[3]];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: MdefService,
    private mcService: MclassService,
    protected ref: NbDialogRef<MaterialInfoComponent>) { }


  get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[3]));
  }

  ngOnInit(): void {
    this.mcService.getMclasssElite().subscribe(mcs => {
      this.mcs = mcs;
    })
  }

  onMclassChange(items): void {
    if (items && items.length > 0) {
      let ids = items.map(item => item._id);
      console.log(ids);
      this.mcService.getManyMclasses(ids).subscribe(mcs => {
        console.log(mcs);
        this.service.deriveFromMclasses(this.model, mcs);
      })
    } else {
      this.model.mclass = [];
    }
  }

  onOidChange(event): void {
    if (this.model.oid.length > 2) {
      this.model.code = this.model.oid.substr(-2);
    }
  }

  onDelete(event): void {
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }



}
