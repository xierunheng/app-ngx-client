import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../../@core/model/global';
import { NbDialogRef } from '@nebular/theme';

import { TreeviewItem } from 'ngx-treeview';
import { UtilData, IDCmpFn} from '../../../../../@core/data/util.service';
import { IEnclassElite } from '../../../../../@core/model/enclass';
import { EnclassService } from '../../../../../@core/data/enclass.service';
import { IEnergyDefinition, EnergyDefinition } from '../../../../../@core/model/endef';
import { EnDefService } from '../../../../../@core/data/endef.service';

@Component({
  selector: 'mes-endef-info',
  templateUrl: './endef-info.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class EndefInfoComponent implements OnInit {

  // array of Eclass, 能源类型
  encs: IEnclassElite[];

  @Input() title: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IEnergyDefinition;


  //tree-select 的比较函数
  idCmpFn = IDCmpFn;


  //属性项的标签
  tags: string[] = [UtilData.txtTags[2]];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: EnDefService,
    private encService: EnclassService,
    protected ref: NbDialogRef<EndefInfoComponent>) { }


  get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[2]));
  }

  ngOnInit(): void {
    this.encService.getEnclasssElite().subscribe(encs => {
      this.encs = encs;
    })
  }


  onEnclassChange(items): void {
    if (items && items.length > 0) {
      let ids = items.map(item => item._id);
      this.encService.getManyEnclasss(ids).subscribe(encs => {
        this.model = this.service.deriveFromEnClass(this.model, encs);
        console.log(this.model);
      })
    } else {
      this.model.enclass = [];
    }
  }

  /**
   * [从能源设备列表中，删除能源设备信息]
   * @param {[type]} event [description]
   */
  onDelete(event): void {

  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
