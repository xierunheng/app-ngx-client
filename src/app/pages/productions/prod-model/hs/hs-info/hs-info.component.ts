import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';

import { TreeviewItem } from 'ngx-treeview';
import { IHierarchyScope, HierarchyScope } from '../../../../../@core/model/hs';
import { HsService } from '../../../../../@core/data/hs.service';
import { GlobalData } from '../../../../../@core/model/global';
import { UtilData, IDCmpFn } from '../../../../../@core/data/util.service';

@Component({
  selector: 'mes-hs-info',
  templateUrl: './hs-info.component.html',
  styleUrls: ['./hs-info.component.scss']
})
export class HsInfoComponent implements OnInit {
  hss: IHierarchyScope[] = GlobalData.hss;

  /**
   * [路径树，value 只是 路径]
   * @type {TreeviewItem[]}
   */
  pathtree: TreeviewItem[];

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's HierarchyScopeSchema
  // model: IHierarchyScope = new HierarchyScope();
  @Input() model: HierarchyScope = new HierarchyScope();

  // hs 的比较函数
  idCmpFn = IDCmpFn;

  leveltree: TreeviewItem[] = [new TreeviewItem(UtilData.hsLevelTree)];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: HsService,
    protected ref: NbDialogRef<HsInfoComponent>) {
  }

  ngOnInit(): void {
    let root = this.service.newPathItem(this.hss[0]);
    for (const hs of this.hss) {
      this.service.insertPathItem(root, hs);
    }
    this.pathtree = [new TreeviewItem(root)];
  }


  /**
   * [父层级发生变化]
   * @param {[type]} value [description]
   */
  onPathChange(item): void {
    console.log(item);
    if (this.hss) {
      this.model.level = this.service.getChildLevel(item, this.hss);
    }
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }
}
