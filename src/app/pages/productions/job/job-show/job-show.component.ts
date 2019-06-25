import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

import { WorkData } from '../../../../@core/data/util.service';
import { IQuantity, Quantity } from '../../../../@core/model/common';
import { IJobResponse, BarData, EchartBar, EchartData, IJob } from '../../../../@core/model/job-response';
import { IJobOrder } from '../../../../@core/model/job-order';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';

@Component({
	selector: 'mes-job-show',
	templateUrl: './job-show.component.html',
	styleUrls: ['./job-show.component.scss']
})
export class JobShowComponent implements OnInit {
	//产出的可选的呈现类型
	qtyTypes: string[] = ['仅物料', '物料+成型工'];

	//产出呈现的类型
	qtyType: string = this.qtyTypes[0];
	
	/**
	 * [jobOrder response]
	 * @type {JobResponse}
	 */
	jr: IJobResponse;

	/**
	 * [jobOrder order]
	 * @type {JobOrder}
	 */
	jo: IJobOrder;

	//工单的产出，方便 echart 呈现, 带Title
	output: EchartBar;

	qciPareto: EchartData;

	outputTime: any[];

	//工单生产的总数，包括合格的和不合格的
	totalQty: IQuantity;

  /**
   * [当前工单的进度显示状态]
   */
	get showStatus(): string {
		return WorkData.WorkStates[this.jr.state].status;
	}

  /**
   * [工单的进度值]
   * @type {number}
   */
	processValue: number;

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
		private joService: JobOrderService,
		private jrService: JobResponseService) { }


	ngOnInit() {
		this.loading = true;
		let oid = this.route.snapshot.paramMap.get('oid');
		this.joService.getJobOrderNo404({ oid: oid }).subscribe(jo => {
			this.jo = jo;
			this.jrService.getJobResponseNo404({ oid: oid }).subscribe(jr => {
				this.jr = jr;
				this.init();
				this.loading = false;
			})
		})
	}

	init(): void {
		if (this.jo && this.jr) {
			this.jo.qty = new Quantity();
			this.jo.qty.quantity = this.jo.mReq.map(mr => mr.qty.quantity).reduce((prev, curr) => prev + curr);
			this.totalQty = {
				quantity: this.jr.ngqty.quantity + this.jr.qty.quantity,
				unit: this.jr.qty.unit
			};
			this.processValue = this.jo.qty.quantity === 0 ? 0 : _.round(this.jr.qty.quantity / this.jo.qty.quantity * 100, 2);
		}
	}

  /**
   * [返回上一级]
   */
	goBack(): void {
		this.location.back();
	}
}
