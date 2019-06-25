import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

import { GlobalData } from '../../../../@core/model/global';
import { IDCmpFn } from '../../../../@core/data/util.service';
import { TreeviewItem } from 'ngx-treeview';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { IQuantity } from '../../../../@core/model/common';
import { IEquipmentElite, EquipmentElite } from '../../../../@core/model/equipment';
import { HsService } from '../../../../@core/data/hs.service';
import { EquipmentService } from '../../../../@core/data/equipment.service';
import { EsubService } from '../../../../@core/data/esub.service';

@Component({
  selector: 'mes-equip-stats',
  templateUrl: './equip-stats.component.html',
  styleUrls: ['./equip-stats.component.scss']
})
export class EquipStatsComponent implements OnInit {
  /**
   * [选择的hs]
   * @type {IHierarchyScope}
   */
  hs: IHierarchyScope;

  get hstree() {
    return GlobalData.hstree;
  }

  /**
   * [生产过程的开始时间]
   * @type {Date}
   */
  startTime: Date = moment().subtract(1, 'month').toDate();

  /**
   * [生产过程的结束时间]
   * @type {Date}
   */
  endTime: Date = new Date();

  /**
   * [选择的员工]
   * @type {IEquipmentElite}
   */
  equipment: IEquipmentElite;

  /**
   * [待选的员工列表]
   * @type {IEquipmentElite[]}
   */
  equipments: IEquipmentElite[];

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //产量趋势呈现的数据
  qtyData: any[];

  PQ: IQuantity;

  //质量指标呈现的数据
  qrData: any[];

  GQ: IQuantity;

  //废品率呈现的数据
  srData: any[];

  SQ: IQuantity;

  //成型工下拉可选项
  etree: TreeviewItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private esubService: EsubService,
    private eService: EquipmentService) {
  }

  ngOnInit() {
    this.eService.getEquipmentsBy().subscribe(e => {
      this.etree = this.eService.newEquipmentTree(e);
      this.hs = GlobalData.hss[0];
      this.route.queryParams.subscribe((params: Params) => {
        if (params['hs.name']) {
          this.hs = GlobalData.hss.find(item => item.name === params['hs.name']);
        }
        if (params['startTime']) {
          this.startTime = params['startTime'];
        }
        if (params['endTime']) {
          this.endTime = params['endTime'];
        }
        if (params['equipment.oid']) {
          this.equipment = e.find(item => item.oid === params['equipment.oid']);
        }
        this.init();
      })
    });

  }

  init(): void {
    if (this.hs && this.startTime && this.endTime && this.equipment) {
      this.esubService.searchEsubEncode({
        hs: this.hs,
        startTime: this.startTime,
        endTime: this.endTime,
        'equipment.oid': this.equipment.oid,
      }, '-prop -oplog' ).subscribe(items => {
        this.qtyData = [];
        this.qrData = [];
        this.srData = [];
        this.PQ = this.GQ = this.SQ = {
          quantity: 0,
          unit: '件'
        };
        if (items && items.length > 0){
          this.qtyData = items.map(item => {
            return {
              oid: item.oid,
              qty: item.qty.quantity + item.ngqty.quantity
            }
          });
          this.PQ = {
            quantity: this.qtyData.map(item => item.qty).reduce((prev, curr) => prev + curr),
            unit: items[0].qty.unit
          };

          this.qrData = items.map(item => {
            return {
              oid: item.oid,
              qty: item.qty.quantity,
              ratio: item.qty.quantity + item.ngqty.quantity > 0 ?
                 _.round(item.qty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2) : 0
            }
          });
          this.GQ = {
            quantity:  this.qrData && this.qrData.length > 0 ?
              this.qrData.map(item => item.qty).reduce((prev, curr) => prev + curr) : 0,
            unit: items[0].qty.unit
          };

          this.srData = items.map(item => {
            return {
              oid: item.oid,
              qty: item.ngqty.quantity,
              ratio: item.qty.quantity + item.ngqty.quantity > 0 ?
                _.round(item.ngqty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2) : 0
            }
          });
          this.SQ = {
            quantity: this.srData && this.srData.length > 0 ?
              this.srData.map(item => item.qty).reduce((prev, curr) => prev + curr) : 0,
            unit: items[0].qty.unit
          };
        };
      })
    }
  }

  /**
   * [hs发生变化时，所有的数据都要联动发生变化]
   * @param {[type]} event [description]
   */
  onHsChange(event) {
    this.route.queryParams.subscribe(params => {
      let query = _.cloneDeep(params);
      query['hs.name'] = this.hs.name;
      this.router.navigate([], { relativeTo: this.route, queryParams: query})
    })
  }

  onStartTimeChange(event) {
    this.startTime = event;
    this.route.queryParams.subscribe(params => {
      let query = _.cloneDeep(params);
      query['startTime'] = this.startTime;
      this.router.navigate([], { relativeTo: this.route, queryParams: query})
    })
  }

  onEndTimeChange(event) {
    this.endTime = event;
    this.route.queryParams.subscribe(params => {
      let query = _.cloneDeep(params);
      query['endTime'] = this.endTime;
      this.router.navigate([], { relativeTo: this.route, queryParams: query})
    })
  }

  onEquipmentChange(event) {
    this.equipments = event;
    this.route.queryParams.subscribe((params: Params) => {
      let query = _.cloneDeep(params);
      query['equipment.oid'] = this.equipment.oid;
      this.router.navigate([], { relativeTo: this.route, queryParams: query})
    })
  }
}


