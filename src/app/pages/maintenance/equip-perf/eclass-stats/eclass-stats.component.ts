import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

import { GlobalData } from '../../../../@core/model/global';
import { IDCmpFn } from '../../../../@core/data/util.service';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { IQuantity } from '../../../../@core/model/common';
import { IEclass, IEclassElite } from '../../../../@core/model/eclass';
import { HsService } from '../../../../@core/data/hs.service';
import { EclassService } from '../../../../@core/data/eclass.service';
import { EsubService } from '../../../../@core/data/esub.service';

@Component({
  selector: 'mes-eclass-stats',
  templateUrl: './eclass-stats.component.html',
  styleUrls: ['./eclass-stats.component.scss']
})
export class EclassStatsComponent implements OnInit {
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
   * [选择的设备类型]
   * @type {IProseg}
   */
  eclass: IEclassElite;

  /**
   * [待选的设备类型列表]
   * @type {IProseg[]}
   */
  eclasss: IEclassElite[];

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

   //产量趋势呈现的数据
  qtyData= {oid:[],qty:[]};

  PQ: IQuantity;

  //质量指标呈现的数据
  qrData = {
    oid: [],
    qty: [],
    ratio: []
  };

  GQ: IQuantity;

  //废品率呈现的数据
  srData={
    oid: [],
    qty: [],
    ratio: []
  };

  SQ: IQuantity;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ecService: EclassService,
    private Esub: EsubService,
    ) { }

  ngOnInit() {
    GlobalData.hss$.subscribe(hss => {
      this.hs = hss[0];    
      this.ecService.getEclasss().subscribe(items => {        
          this.eclasss = items;
          this.eclasss = _.sortBy(this.eclasss, 'no');
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
            if (params['eclass.oid']) {
              this.eclass = this.eclasss.find(item => item.oid === params['eclass.oid']);
            }
            this.init();
          })
      });
     
    })


  }

  init(){
    //制成品率和废品率饼图
        this.Esub.aggrClass(
            this.hs,
            this.startTime,
            this.endTime

        ).subscribe(item => {
            let data = _.find(item, ['name', this.eclass.oid]);
            this.PQ = {
                quantity: data?data.qty + data.ngqty:0,
                unit: "个"
            };
            this.GQ = {
                quantity: data?data.qty:0,
                unit: "个"
            };
            this.SQ = {
                quantity: data?data.ngqty:0,
                unit: "个"
            };

        })

         //已生产量、制成品率、废品率趋势柱图
        this.Esub.searchEsubEncode({
            hs: this.hs,
            startTime: this.startTime,
            endTime: this.endTime,
            'eclass.0.oid': this.eclass.oid
        }, "_id oid hs eclass qty ngqty").subscribe(item => {
            let data = _.groupBy(item, d =>
                d.oid.substr(-6, 6)
            );
            let xData = _.keys(data);
            let outputData = _.mapValues(data, (value, key) =>{
                let dayQty = _.reduce(_.map(value, o=> {
                    return o.qty.quantity
                }), (sum, n)=> {
                    return sum + n;
                });

                let dayNgqty = _.reduce(_.map(value, o=> {
                    return o.ngqty.quantity
                }), (sum, n)=> {
                    return sum + n;
                });

                let dayTotal = _.reduce(_.map(value, o=> {
                    return o.qty.quantity + o.ngqty.quantity
                }), (sum, n)=> {
                    return sum + n;
                });

                return {
                    qty:{count:dayQty,ratio:dayQty/dayTotal},
                    dayNgqty:{count:dayNgqty,ratio:dayNgqty/dayTotal},
                    dayTotal:dayTotal,
                }

            })
            console.log(outputData);

            this.qtyData ={
                oid: xData,
                qty: _.map(outputData,d=>{
                    return d.dayTotal
                })
            }
               

            this.qrData ={
                oid: xData,
                qty: _.map(outputData,d=>{
                    return d.qty.count
                }),
                ratio: _.map(outputData,d=>{
                    return d.qty.ratio
                }),

            } 
            this.srData ={
                oid: xData,
                qty: _.map(outputData,d=>{
                    return d.dayNgqty.count
                }),
                ratio: _.map(outputData,d=>{
                    return d.dayNgqty.ratio
                }),

            } 
        })
  }

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

  onEclassChange(event){
    this.eclass = event;
    this.route.queryParams.subscribe((params: Params) => {
      let query = _.cloneDeep(params);
      query['eclass.oid'] = this.eclass.oid;
      this.router.navigate([], { relativeTo: this.route, queryParams: query})
    })
    this.init()
  }
}
