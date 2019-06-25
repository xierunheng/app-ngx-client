import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../@core/model/global';
import { TreeviewItem } from 'ngx-treeview';

import { UtilData, IDCmpFn, NameCmpFn, winSize } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';
import { WorkAlert, IWorkAlert } from '../../../../@core/model/work-alert';
import { IWorkAlertDefElite } from '../../../../@core/model/work-alert-def';
import { WorkAlertService } from '../../../../@core/data/work-alert.service';
import { WorkAlertDefService } from '../../../../@core/data/work-alert-def.service';
import { PersonService } from '../../../../@core/data/person.service';
import { EquipmentService } from '../../../../@core/data/equipment.service';
import { NbDialogRef } from '@nebular/theme';
import { ParameterService } from '../../../../@core/data/parameter.service';

@Component({
  selector: 'ngx-e-alert-info',
  templateUrl: './e-alert-info.component.html',
  styleUrls: ['./e-alert-info.component.scss']
})
export class EAlertInfoComponent implements OnInit {
  // this model is nothing but for [(ngModel)]
  // copied from server's EnergyClassSchema
  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  //属性项的model
  @Input() model: IWorkAlert = new WorkAlert();

  modelObserver: any;
  //界面配置接口
  vConfig: ViewConfig;

  //tree-select 的比较函数
  idCmpFn = IDCmpFn;
  nameCmpFn = NameCmpFn;

  // tree of Mdef, with Mclass
  ptree: TreeviewItem[];

  // tree of Equipment,
  etree: TreeviewItem[];

  hstree: TreeviewItem[];
  categorys: string[];

  //workalert defs
  workAlertDefs: IWorkAlertDefElite[];

  ssize: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's EnergyDataSchema
  // model: WorkAlert;
  // modelObserver: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: WorkAlertService,
    private wadefService: WorkAlertDefService,
    private eService: EquipmentService,
    private pService: PersonService,
    private paraService: ParameterService,
    protected ref: NbDialogRef<EAlertInfoComponent>) { }

  ngOnInit() {

     //根据高度大小确定弹窗的大小
    this.ssize = winSize();

    let query = {'tags':'维保报警属性'};
    this.paraService.searchParameters(query).subscribe(pa => {
      let eAlert=[];
      for(let i=0; i<pa.length; i++){
         eAlert.push(pa[i].oid);
      }
      this.categorys = eAlert;
    })

    this.hstree = _.cloneDeep(GlobalData.hstree);
    // 通过 route 的 data 区分新建数据和修改数据
    this.wadefService.getWorkAlertDefsElite().subscribe(wadefs => {
      this.workAlertDefs = wadefs;
      this.pService.getPersonsProfile().subscribe(ps => {
        this.ptree = this.pService.newPersonTree(ps);
        this.eService.getEquipmentsProfile().subscribe(es => {
          this.etree = this.eService.newEquipmentTree(es);
          // this.route.data.subscribe(data => {
          //   this.vConfig = ViewConfig.create(data.config);
          //   if (this.vConfig.type === UtilData.txtUpdateType) {
          //     this.route.params.switchMap((params: Params) =>
          //       this.service.getWorkAlert(params['waid'])).subscribe(item => {
          //         this.model = new WorkAlert(item);
          //         this.modelObserver = jsonpatch.observe(this.model);
          //       });
          //   } else {
          //     this.model = new WorkAlert();
          //   }
          // });
        });
      });
    });
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
      this.ref.close(this.model);

  }

  onPersonChange(event): void {
    this.service.formatOid(this.model);
  }

  onEquipmentChange(event): void {
    this.service.formatOid(this.model);
  }

  onEAlertDefChange(event): void {
    // this.wadefService.getWorkAlertDef(this.model.workAlertDef._id).subscribe(wadef => {
    //   this.model.DeriveFromDef(wadef);
    //   this.model.formatOid();
    //   console.log(this.model);
    // })
  }

}
