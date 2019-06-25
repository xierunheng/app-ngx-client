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

import { UtilData, IDCmpFn } from '../../../../../@core/data/util.service';
import { IKpiDef, IKpiDefElite } from '../../../../../@core/model/kpi-def';
import { KpiDefinitionService } from '../../../../../@core/data/kpi-def.service';
import { IKpi, Kpi } from '../../../../../@core/model/kpi';
import { KpiService } from '../../../../../@core/data/kpi.service';

@Component({
  selector: 'ngx-kpi-info',
  templateUrl: './kpi-info.component.html',
  styleUrls: ['./kpi-info.component.scss']
})
export class KpiInfoComponent implements OnInit {


  // array of Pclass, 员工类型
  kpids: IKpiDefElite[];

  @Input() title: string;

  @Input() model: IKpi;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[1]];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: KpiService,
    private kpidService: KpiDefinitionService,
    protected ref: NbDialogRef<KpiInfoComponent> ) {
  }

  get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[1]));
  }

  ngOnInit(): void {
    this.kpidService.getKpiDefsElite().subscribe(kpids => {
      this.kpids = kpids;
    })
  }

  onKpiDefChange(item): void {
    console.log(item.target.selectedIndex);
    let id = this.kpids[item.target.selectedIndex]._id;
    console.log(id);
    this.kpidService.getKpiDef(id).subscribe(kpid => {
      this.model = this.service.DeriveFromKpiDef(this.model, kpid);
    });
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
