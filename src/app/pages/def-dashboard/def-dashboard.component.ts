import { Component, OnInit } from '@angular/core';

import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { GlobalData } from '../../@core/model/global';
import { IDCmpFn } from '../../@core/data/util.service';
import { IHierarchyScope } from '../../@core/model/hs';
import { HsService } from '../../@core/data/hs.service';
import { IProseg } from '../../@core/model/proseg';
import { ProsegService } from '../../@core/data/proseg.service';
import { Router }  from '@angular/router';

@Component({
	selector: 'mes-def-dashboard',
	templateUrl: './def-dashboard.component.html',
	styleUrls: ['./def-dashboard.component.scss']
})
export class DefDashboardComponent implements OnInit {

	/**
	 * [选择的hs]
	 * @type {IHierarchyScope}
	 */
	hs: IHierarchyScope;

	get hstree() {
		return GlobalData.hstree;
	}

  /**
   * [所选hs下的所有工艺段]
   * @type {IProseg}
   */
	pss: IProseg[];

	// tree-select 的比较函数
	idCmpFn = IDCmpFn;

	constructor(private hsService: HsService,
		private psServie: ProsegService,
		private router: Router) { }

	ngOnInit() {
		GlobalData.hss$.subscribe(hss => {
			this.hs = hss[0];
			this.init();
		})
	}

	init(): void {
		if (this.hs) {
			let hsPath = this.hsService.getCurrPath(this.hs);
			this.psServie.searchProsegsEncode({$or: [
				{ 'hs.path': { $regex: hsPath }},
				{ 'hs.name': this.hs.name } ] }).subscribe(items => {
				this.pss = items;
			})
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

	toDetail(ps){
		// ps.oid
		this.router.navigate(['/pages/productions/proseg'],{ queryParams: { oid: `${ps.oid}` } }); 


		console.log(ps.oid);
	}
}
