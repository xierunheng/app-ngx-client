import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

import { GlobalData } from '../../../../@core/model/global';
import { IDCmpFn } from '../../../../@core/data/util.service';
import { TreeviewItem } from 'ngx-treeview';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { IQuantity } from '../../../../@core/model/common';
import { IPersonElite, PersonElite } from '../../../../@core/model/person';
import { HsService } from '../../../../@core/data/hs.service';
import { PersonService } from '../../../../@core/data/person.service';
import { PsubService } from '../../../../@core/data/psub.service';

@Component({
  selector: 'mes-person-stats',
  templateUrl: './person-stats.component.html',
  styleUrls: ['./person-stats.component.scss']
})
export class PersonStatsComponent implements OnInit {

  /**
   * [选择的hs]
   * @type {IHierarchyScope}
   */
  hs: IHierarchyScope;

  get hstree() {
    return GlobalData.hstree;
  }

  //员工下拉可选项
  ptree: TreeviewItem[];

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
   * @type {IPersonElite}
   */
  person: IPersonElite;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  //产量趋势呈现的数据
  qtyData: any[];

  //已生产量
  PQ: IQuantity;

  //质量指标呈现的数据
  qrData: any[];

  //合格数量
  GQ: IQuantity;

  //废品率呈现的数据
  srData: any[];

  //废品数量
  SQ: IQuantity;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private psubService: PsubService,
    private pService: PersonService) {
  }

  ngOnInit() {
    this.pService.getPersonsProfileBy().subscribe(p => {
      this.ptree = this.pService.newPersonTree(p);
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
        if (params['person.oid']) {
          this.person = p.find(item => item.oid === params['person.oid']);
        }
        this.init();
      })
    });

    // let oid = this.route.snapshot.paramMap.get('oid');
    // this.pService.getPersonBy({oid: oid}).subscribe(p => {
    //   this.hs = p.hs;
    //   this.person = new PersonElite;
    //   this.person._id = p._id;
    //   this.person.oid = p.oid;
    //   this.person.name = p.name;
    //   this.init();
    // })
  }

  init(): void {
    if (this.hs && this.startTime && this.endTime && this.person) {

      this.psubService.searchPsubsEncode({
        hs: this.hs,
        startTime: this.startTime,
        endTime: this.endTime,
        'person.oid': this.person.oid,
      }, '-prop -oplog -mAct -ngmAct -reasons', 'oid').subscribe(items => {
        this.qtyData = [];
        this.qrData = [];
        this.srData = [];
        this.PQ = this.GQ = this.SQ = {
          quantity: 0,
          unit: '件'
        };
        if (items && items.length > 0) {
          this.qtyData = items.map(item => {
            return {
              oid: item.oid,
              qty: item.qty.quantity + item.ngqty.quantity
            }
          });
          this.PQ = {
            quantity: this.qtyData && this.qtyData.length > 0 ?
              this.qtyData.map(item => item.qty).reduce((prev, curr) => prev + curr) : 0,
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
            quantity: this.qrData && this.qrData.length > 0 ?
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
    console.log(this.hs);
    this.route.queryParams.subscribe(params => {
      let query = _.cloneDeep(params);
      query['hs.name'] = this.hs.name;
      this.router.navigate([], { relativeTo: this.route, queryParams: query })
    })
  }

  onStartTimeChange(event) {
    this.startTime = event;
    this.route.queryParams.subscribe(params => {
      let query = _.cloneDeep(params);
      query['startTime'] = this.startTime;
      this.router.navigate([], { relativeTo: this.route, queryParams: query })
    })
  }

  onEndTimeChange(event) {
    this.endTime = event;
    this.route.queryParams.subscribe(params => {
      let query = _.cloneDeep(params);
      query['endTime'] = this.endTime;
      this.router.navigate([], { relativeTo: this.route, queryParams: query })
    })
  }

  onPersonChange(event) {
    console.log(event);
    this.route.queryParams.subscribe((params: Params) => {
      let query = _.cloneDeep(params);
      query['person.oid'] = this.person.oid;
      this.router.navigate([], { relativeTo: this.route, queryParams: query })
    })
  }
}

