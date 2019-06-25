import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogRef } from '@nebular/theme';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

import { GlobalData } from '../../../../@core/model/global';
import { ViewConfig } from '../../../../@core/utils/config';
import { UtilData, IDCmpFn, NameCmpFn, TableSettings, WorkData } from '../../../../@core/data/util.service';
import { PersonService } from '../../../../@core/data/person.service';
import { HsService } from '../../../../@core/data/hs.service';
import { IWorkAlertDef, WorkAlertDef } from '../../../../@core/model/work-alert-def';
import { WorkAlertDefService } from '../../../../@core/data/work-alert-def.service';


@Component({
  selector: 'work-alert-def-info',
  templateUrl: './work-alert-def-info.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
    form{
        min-width: 500px;
    }
  `],
})
export class WorkAlertDefInfoComponent implements OnInit {
  // this model is nothing but for [(ngModel)]
  // copied from server's WorkAlertDefSchema
  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  //属性项的model
  @Input() model: IWorkAlertDef = new WorkAlertDef();
  modelObserver: any;

  //可选的category
  opTypes: string[] = WorkData.opTypes;

  //可选的优先级
  priorities: number[] = [1, 2, 3, 4, 5];

  //tree-select 的比较函数
  idCmpFn = IDCmpFn;
  nameCmpFn = NameCmpFn;

  //界面配置接口
  vConfig: ViewConfig;

  // propcolumns: any = TableSettings.resPropColumns;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[2]];

  // tree of Mdef, with Mclass
  ptree: TreeviewItem[];

  hstree: TreeviewItem[];

  config: TreeviewConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 300
  });

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private pService: PersonService,
    private hsService: HsService,
    private service: WorkAlertDefService,
    protected ref: NbDialogRef<WorkAlertDefInfoComponent>) { }

  ngOnInit(): void {
    this.pService.getPersonsProfile().subscribe(ps => {
      this.ptree = this.pService.newPersonTree(ps);
    });
    //这里非要用异步的方式获取，奇怪
    GlobalData.hss$.subscribe(hss => {
      this.hstree = _.cloneDeep(GlobalData.hstree);
    });

  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}

