import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

import { IEsub, Esub } from '../../../../@core/model/esub';
import { EsubService } from '../../../../@core/data/esub.service';
import { IQuantity } from '../../../../@core/model/common';

@Component({
  selector: 'mes-esub-show',
  templateUrl: './esub-show.component.html',
  styleUrls: ['./esub-show.component.scss']
})
export class EsubShowComponent implements OnInit {
  //产出的可选的呈现类型
  qtyTypes: string[] = ['仅物料'];
 // qtyTypes: string[] = ['仅物料', '物料+成型工'];

  //产出呈现的类型
  qtyType: string = this.qtyTypes[0];

  /**
   * [待呈现的设备作业项]
   * @type {IEsub}
   */
  esub: IEsub;
  total: IQuantity;

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private esubService: EsubService) { }

  ngOnInit() {
    this.loading = true;
    let oid = this.route.snapshot.paramMap.get('oid');
    this.esubService.getEsubs404({oid: oid}).subscribe(esub => {
      this.esub = esub;
      this.total = {
        quantity: this.esub.qty.quantity + this.esub.ngqty.quantity,
        unit: "个"
      };
      console.log(this.esub);
      this.init();
      this.loading = false;
    })
  }

  init(): void {

  }

}
