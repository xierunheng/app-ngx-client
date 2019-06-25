import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { GlobalData } from '../../@core/model/global';
import { IDCmpFn } from '../../@core/data/util.service';
import { IHierarchyScope } from '../../@core/model/hs';
import { HsService } from '../../@core/data/hs.service';

@Component({
	selector: 'mes-process-dashboard',
	templateUrl: './process-dashboard.component.html',
	styleUrls: ['./process-dashboard.component.scss']
})
export class ProcessDashboardComponent implements OnInit {

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
	 * [选中的员工类型]
	 * @type {string}
	 */
	pclass: string = '';

	/**
	 * [选中的设备类型]
	 * @type {string}
	 */
	eclass: string = '';

	/**
	 * [选中的物料类型]
	 * @type {string}
	 */
	mclass: string = '';

	// tree-select 的比较函数
	idCmpFn = IDCmpFn;

	constructor(private hsService: HsService) { }

	ngOnInit() {
		GlobalData.hss$.subscribe(hss => {
			this.hs = hss[0];
			this.init();
		})
	}

	init(): void {
		if (this.hs && this.startTime && this.endTime) {
			let hsPath = this.hsService.getCurrPath(this.hs);
		}
	}

  /**
   * [hs发生变化时，所有的数据都要联动发生变化]
   * @param {[type]} event [description]
   */
	onHsChange(event) {
	//	console.log(this.hs);
		this.init();
	}

	onStartTimeChange(event) {
		this.startTime = event;
		console.log(this.startTime);
		this.init();
	}

	onEndTimeChange(event) {
		this.endTime = event;
		console.log(this.endTime);
		this.init();
	}
}
