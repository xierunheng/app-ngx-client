import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

import { GlobalData } from '../../../../@core/model/global';
import { IDCmpFn } from '../../../../@core/data/util.service';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { IQuantity } from '../../../../@core/model/common';
import { IProsegElite } from '../../../../@core/model/proseg';
import { HsService } from '../../../../@core/data/hs.service';
import { OpDefService } from '../../../../@core/data/op-def.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';

@Component({
	selector: 'mes-jobs-stats',
	templateUrl: './jobs-stats.component.html',
	styleUrls: ['./jobs-stats.component.scss']
})
export class JobsStatsComponent implements OnInit {

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
	ps: IProsegElite;

	/**
	 * [待选的工序列表]
	 * @type {IProseg[]}
	 */
	pss: IProsegElite[];

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

	constructor(private router: Router,
		private route: ActivatedRoute,
		private odService: OpDefService,
		private jrService: JobResponseService) {
	}

	ngOnInit() {
		GlobalData.hss$.subscribe(hss => {
			this.hs = hss[0];
			this.odService.getOpDefinitions().subscribe(items => {
				this.pss = [];
				items.forEach(item => {
					item.opseg.forEach(os => {
						this.pss.push(os.proseg);
					});
				});
				this.pss = _.sortBy(this.pss, 'no');
				this.route.queryParams.subscribe((params: Params) => {
					if (params['hs.name']) {
						this.hs = hss.find(item => item.name === params['hs.name']);
					}
					if (params['startTime']) {
						this.startTime = params['startTime'];
					}
					if (params['endTime']) {
						this.endTime = params['endTime'];
					}
					if (params['ps.oid']) {
						this.ps = this.pss.find(item => item.oid === params['ps.oid']);
					}
					this.init();
				})
			})

		});
	}

	init(): void {
		if (this.hs && this.startTime && this.endTime && this.ps) {
			this.jrService.searchJobResponsesEncode({
				hs: this.hs,
				startTime: this.startTime,
				endTime: this.endTime,
				'directive.proseg.oid': this.ps.oid
			}, '-mAct -oplog', 'oid').subscribe(items => {
				console.log(items);
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
						ratio: _.round(item.qty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2)
					}
				});
				this.GQ = {
					quantity: this.qrData.map(item => item.qty).reduce((prev, curr) => prev + curr),
					unit: items[0].qty.unit
				};

				this.srData = items.map(item => {
					return {
						oid: item.oid,
						qty: item.ngqty.quantity,
						ratio: _.round(item.ngqty.quantity / (item.qty.quantity + item.ngqty.quantity) * 100, 2)
					}
				});
				this.SQ = {
					quantity: this.srData.map(item => item.qty).reduce((prev, curr) => prev + curr),
					unit: items[0].qty.unit
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

	onPsChange(event) {
		this.ps = event;
		this.route.queryParams.subscribe((params: Params) => {
			let query = _.cloneDeep(params);
			query['ps.oid'] = this.ps.oid;
			this.router.navigate([], { relativeTo: this.route, queryParams: query})
		})
	}
}
