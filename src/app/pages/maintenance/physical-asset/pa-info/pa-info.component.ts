import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { TreeviewItem } from 'ngx-treeview';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogRef } from '@nebular/theme';
import { GlobalData } from '../../../../@core/model/global';

import { UtilData, IDCmpFn, TableSettings, MaterialData, winSize } from '../../../../@core/data/util.service';
import { ViewConfig } from '../../../../@core/utils/config';
import { IPaclassElite } from '../../../../@core/model/paclass';
import { PaclassService } from '../../../../@core/data/paclass.service';
import { IPhysicalAsset, PhysicalAsset, IPAElite, IPAProfile } from '../../../../@core/model/physical-asset';
import { EquipmentAssetMapping } from '../../../../@core/model/common';
import { PhysicalAssetService } from '../../../../@core/data/physical-asset.service';
import { EquipmentService } from '../../../../@core/data/equipment.service';
//import { PsubService } from '../../../../@core/data/psub.service';
import { treeConfig } from '../../../../@core/utils/config';

@Component({
  selector: 'mes-pa-info',
  templateUrl: './pa-info.component.html',
  styleUrls: ['./pa-info.component.scss']
})
export class PaInfoComponent implements OnInit {

  // array of Pclass, 员工类型
  pacs: IPaclassElite[];

  @Input() title: string;

  @Input() operate: string;
  // this model is nothing but for [(ngModel)]
  // copied from server's PersonnelClassSchema
  @Input() model: IPhysicalAsset;

  //多选的 ngx-treeview
  multiConfig = treeConfig.multi;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;
  ssize: string;

  etree: TreeviewItem[];
  eaMap: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: PhysicalAssetService,
    private eService: EquipmentService,
    private pacService: PaclassService,
    protected ref: NbDialogRef<PaInfoComponent>) { }

   get hstree() {
    return GlobalData.hstree;
  }

  get paras() {
    return GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[1]));
  }

  isUpdate: boolean = false;

  ngOnInit() {
     //根据高度大小确定弹窗的大小
     this.ssize = winSize();

    this.pacService.getPaclasssElite().subscribe(pacs => {
      this.pacs = pacs;
    })

    if(this.model.oid) {
      this.isUpdate = true;
    }


    //初始化赋值
    this.eService.getEquipmentsProfile().subscribe(es => {
      console.log(es);
      if(this.isUpdate === false) {
        this.model.eaMapping = new EquipmentAssetMapping();
      }

      console.log(this.model);
      this.etree = this.eService.newEquipmentTree(es,false,this.model.eaMapping.equipment);

      // this.eaMap =  this.model.eaMapping || [];
    });
  }

  onSelectedChange(selItems): void {
    console.log(selItems);
    this.model.eaMapping.equipment = _.forEach(selItems, function(o) {
      return {
        oid:o.oid,
        _id:o._id
      }
      console.log(this.model);
    });
    // this.model.eaMapping.equipment = _.map(selItems, 'oid');

    // this.model.eaMapping = selItems;
  }

  // onEaMapChange(selItems): void {
  //   console.log(selItems);
  //   this.eaMap = selItems;
  //   this.model.eaMapping = selItems;
  // }

  onPaclassChange(items): void {
    if (items && items.length > 0) {
      let ids = items.map(item => item._id);
      this.pacService.getManyPaclasss(ids).subscribe(pcs => {
        this.model = this.service.deriveFromPaclasss(this.model, pcs);
        // this.model = new Person(this.model);
      })
    } else {
      this.model.paclass = [];
    }
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    console.log(this.model);
    this.ref.close(this.model);
  }



}
