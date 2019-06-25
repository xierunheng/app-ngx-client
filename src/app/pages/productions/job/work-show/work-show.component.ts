import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

import { WorkData, MaterialData } from '../../../../@core/data/util.service';
import { IQuantity } from '../../../../@core/model/common';
import { IWorkResponse, IWork } from '../../../../@core/model/work-res';
import { IWorkRequest } from '../../../../@core/model/work-req';
import {
	JobResponse,
	BarData, EchartBar, EchartData, IJob
} from '../../../../@core/model/job-response';
import { WorkResponseService } from '../../../../@core/data/work-res.service';

@Component({
	selector: 'mes-work-show',
	templateUrl: './work-show.component.html',
	styleUrls: ['./work-show.component.scss']
})
export class WorkShowComponent implements OnInit {

	wres: IWorkResponse;

	wreq: IWorkRequest;

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
	loading: boolean = false;
  /**
   * [当前工单的进度显示状态]
   */
	get showStatus(): string {
		return WorkData.WorkStates[this.wres.state].status;
	}

  /**
   * [每一个 jobOrder 的 进程]
   * @return {number[]} [description]
   */
	processValues: any[];

  /**
   * [作业的进度值]
   */
	processValue: number;

	//首工序生产数量
	firstPQ: IQuantity;
	//尾工序成品数量
	lastGQ: IQuantity;
	//工单计划生产数量
	POQ: IQuantity;
	//作业总缺陷数
	SQ: IQuantity;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private service: WorkResponseService) { }

	ngOnInit() {
		this.loading = true;
		let oid = this.route.snapshot.paramMap.get('oid');
		this.service.getWork({ oid: oid }).subscribe(work => {
			this.wreq = work.wreq;
			this.wres = work.wres;
			this.init();
			this.loading = false;
		})
	}

	init(): void {
		if (this.wres && this.wreq) {
			let firstJr = this.wres.jobResponse.find(item => item.oid === this.wres.firstJob.oid);
			this.firstPQ = {
				quantity: firstJr.qty.quantity + firstJr.ngqty.quantity,
				unit: firstJr.qty.unit,
			};
			let lastJr = this.wres.jobResponse.find(item => item.oid === this.wres.lastJob.oid);
			this.lastGQ = {
				quantity: lastJr.qty.quantity,
				unit: lastJr.qty.unit
			};
			let lastJo = this.wreq.jobOrder.find(item => item.oid === this.wreq.lastJob.oid);
			this.POQ = {
				quantity: lastJo.mReq.map(item => item.qty.quantity).reduce((prev, curr) => prev + curr),
				unit: lastJo.mReq[0].qty.unit
			};
			this.SQ = {
				quantity: this.wres.jobResponse.map(item => item.ngqty.quantity).reduce((prev, curr) => prev + curr),
				unit: lastJo.mReq[0].qty.unit
			};

			this.processValue = this.POQ.quantity === 0 ? 0 : _.round(this.lastGQ.quantity / this.POQ.quantity * 100, 2)

			this.processValues = this.wres.jobResponse
				.filter(jr => jr.directive.proseg.oid !== '成型')
				.sort((a, b) => Number(a.directive.proseg.no) - Number(b.directive.proseg.no))
				.map(jr => {
					let jo = this.wreq.jobOrder.find(jo => jo._id === jr.jobOrder._id);
					let destReq = jo.mReq.filter(item => item.use === MaterialData.useTypes[1]);
					if(!destReq || destReq.length <= 0) {
						destReq = jo.mReq.filter(item => item.use === MaterialData.useTypes[0]);
					}
					return {
						oid: jr.oid,
						qty: {
							quantity: destReq.map(item => item.qty.quantity).reduce((prev, curr) => prev + curr),
							unit: destReq[0].qty.unit
						},
						actQty: jr.qty
					};
				});
			console.log(this.processValues);
		}
	}

	goBack(): void {
		this.location.back();
	}

}
