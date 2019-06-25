import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { GlobalData } from '../../@core/model/global';
import { IDCmpFn } from '../../@core/data/util.service';
import { IHierarchyScope } from '../../@core/model/hs';
import { HsService } from '../../@core/data/hs.service';

@Component({
  selector: 'mes-realtime-dashboard',
  templateUrl: './realtime-dashboard.component.html',
  styleUrls: ['./realtime-dashboard.component.scss']
})
export class RealtimeDashboardComponent implements OnInit {

	/**
	 * [选择的hs]
	 * @type {IHierarchyScope}
	 */
	hs: IHierarchyScope;

	get hstree() {
		return GlobalData.hstree;
	}

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
		if (this.hs) {
			let hsPath = this.hsService.getCurrPath(this.hs);
		}
	}

  /**
   * [hs发生变化时，所有的数据都要联动发生变化]
   * @param {[type]} event [description]
   */
	onHsChange(event) {
		console.log(this.hs);
		this.init();
	}
}
