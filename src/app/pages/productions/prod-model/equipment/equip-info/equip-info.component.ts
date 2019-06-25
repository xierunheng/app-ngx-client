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

import { ViewConfig } from '../../../../../@core/utils/config';
import { UtilData, IDCmpFn, OIDCmpFn, EquipData, TableSettings } from '../../../../../@core/data/util.service';
import { IEclassElite } from '../../../../../@core/model/eclass';
import { EclassService } from '../../../../../@core/data/eclass.service';
import { IEquipment, Equipment } from '../../../../../@core/model/equipment';
import { EquipmentService } from '../../../../../@core/data/equipment.service';
import { EsubService } from '../../../../../@core/data/esub.service';
import { SupplierService } from '../../../../../@core/data/supplier.service';

@Component({
  selector: 'mes-equip-info',
  templateUrl: './equip-info.component.html',
  styleUrls: ['./equip-info.component.scss'],
})
export class EquipInfoComponent implements OnInit {
  // array of Eclass, 设备类型
  ecs: IEclassElite[];

  @Input() title: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IEquipment;


  //供应商编号可选项
  suppliers: any[];

  //设备状态可选项
  statuses: string[] = EquipData.statuses;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  supplierCmpFn = OIDCmpFn;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[2]];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: EquipmentService,
    private ecService: EclassService,
    private esService: EsubService,
    private sService: SupplierService,
    protected ref: NbDialogRef<EquipInfoComponent>) {

  }

  get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[2]));
  }

  isUpdate: boolean = false;

  ngOnInit(): void {
    this.suppliers = this.sService.getData();
    this.ecService.getEclasssElite().subscribe(ecs => {
      this.ecs = ecs;
    })
    if(this.model.oid) {
      this.isUpdate = true;
    }
  }

  onDataImported(event) {
    console.log(event);
  }

  /**
   * 新建设备时，设备ID = 设备类型编号 + 供应商编号 + 00 +（现有设备台数 + 1）
   * 更新设备时，设备ID = 设备类型编号 + 供应商编号 + 原设备ID 后三位（即原设备为 001，默认仍为 001）
   */
  syncEquipmentID(): void {
    if (this.model.eclass && this.model.supplier) {
      let prex = this.model.eclass[0].code + this.model.supplier.code;
      this.service.next(prex).subscribe(oid => {
        this.model.oid = oid;
      });
    }
  }

  onSupplierChange(event): void {
 //  if (!this.isUpdate) {
      this.syncEquipmentID();
//    }
  }

  onEclassChange(items): void {
//    if (!this.isUpdate) {
      if (items && items.length > 0) {
        let ids = items.map(item => item._id);
        this.ecService.getManyEclasss(ids).subscribe(ecs => {
          this.model = this.service.deriveFromEclasss(this.model, ecs);
          // this.model = new Equipment(this.model);
          this.syncEquipmentID();
        })
      } else {
        this.model.eclass = [];
      }
 //   }
  }

  /**
   * [从设备作业列表中，删除设备作业]
   * @param {[type]} event [description]
   */
  onDelete(event): void {
    this.esService.deleteEsub(event).subscribe(() => {
    });
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
  }

}
