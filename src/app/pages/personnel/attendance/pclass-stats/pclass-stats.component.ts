import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { GlobalData } from '../../../../@core/model/global';
import { OpDefService } from '../../../../@core/data/op-def.service';
import { PsubService } from '../../../../@core/data/psub.service';
import { PclassService } from '../../../../@core/data/pclass.service';
import { IPclass } from '../../../../@core/model/pclass';
import { IQuantity } from '../../../../@core/model/common';

@Component({
    selector: 'mes-pclass-stats',
    templateUrl: './pclass-stats.component.html',
    styleUrls: ['./pclass-stats.component.scss']
})
export class PclassStatsComponent implements OnInit {
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
     * [选择的工序]
     * @type {IProseg}
     */
    pclass: string;

    /**
     * [待选的工种列表]
     * @type {IProseg[]}
     */
    pclasses: string[];

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
        private Psub: PsubService,
        private Pclass: PclassService,
        private odService: OpDefService) { }

    ngOnInit() {

        GlobalData.hss$.subscribe(hss => {
            this.hs = hss[0];
            this.pclasses = [];
            this.Pclass.getPclasssElite().subscribe(item => {
                item.forEach(d => {
                    this.pclasses.push(d.oid);
                });
            })

        });

        // this.route.params.subscribe((params: Params) => this.pclass=params.oid)
        this.route.queryParams.subscribe((params: Params) => {
            console.log(params);
            if (params['hs.name']) {
              this.hs = GlobalData.hss.find(item => item.name === params['hs.name']);
            }
            if (params['startTime']) {
              this.startTime = params['startTime'];
            }
            if (params['endTime']) {
              this.endTime = params['endTime'];
            }
            if (params['pclass.oid']) {
              this.pclass = params['pclass.oid']
               
            }
            this.init();
          })
        // this.init()
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

    onpclassChange(event) {
        this.pclass = event;
        this.route.queryParams.subscribe((params: Params) => {
          let query = _.cloneDeep(params);
          query['pclass.oid'] = this.pclass;
          this.router.navigate([], { relativeTo: this.route, queryParams: query })
        })
        this.init()
    }

    init(): void { 

        //制成品率和废品率饼图
        this.Psub.aggrClass(
            this.hs,
            this.startTime,
            this.endTime

        ).subscribe(item => {       
            let data = _.find(item, ['name', this.pclass]);
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
        this.Psub.searchPsubsEncode({
            hs: this.hs,
            startTime: this.startTime,
            endTime: this.endTime,
            'pclass.0.oid': this.pclass
        }, "_id oid hs pclass qty ngqty").subscribe(item => {
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

}
