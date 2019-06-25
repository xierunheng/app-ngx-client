import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

import { LocalDataSource } from 'ng2-smart-table';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { GlobalData } from '../../../@core/model/global';
import { IDCmpFn, TableSettings } from '../../../@core/data/util.service';
import { IHierarchyScope } from '../../../@core/model/hs';
import { PsubService } from '../../../@core/data/psub.service';

@Component({
	selector: 'mes-attendance',
	templateUrl: './attendance.component.html',
	styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  //显示的类型, table or tree, default is tree
  showtype: string = 'tree';

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

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

	// tree-select 的比较函数
	idCmpFn = IDCmpFn;

	psubtree: TreeviewItem[];

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private psubService: PsubService) {
		this.initSetting();
	}

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: 'ID',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return value.name.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
            value.level.toString().toLowerCase().includes(search.toString().toLowerCase());
        }
      },
      pclass: {
        title: '员工类型',
        type: 'string',
        valuePrepareFunction: (pclass, row) => {
          return row.pclass && row.pclass.length > 0 ? row.pclass.map((item) => item.oid).join(',') : '';
        },
        filterFunction: (value, search) => {
          return value.findIndex(v => v.oid.toString().toLowerCase().includes(search.toString().toLowerCase())) >= 0;
        }
      },
      person: {
        title: '员工',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.person ? `${row.person.name} [${row.person.oid}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      qty: {
        title: '生产数量',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.hs ? `${row.qty.quantity} [${row.qty.unit}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.quantity && value.quantity.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.unit && value.unit.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      ngqty: {
        title: '报废数量',
        type: 'string',
        valuePrepareFunction: (hs, row) => {
          return row.hs ? `${row.ngqty.quantity} [${row.ngqty.unit}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.quantity && value.quantity.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
            (value.unit && value.unit.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
    };
  }

	ngOnInit() {
		GlobalData.hss$.subscribe(hss => {
			this.hs = hss[0];
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
				this.init();
			})
		});
	}

	init(): void {
		if(this.hs && this.startTime && this.endTime) {
			this.loading = true;
			this.psubService.searchPsubsEncode({
				hs: this.hs,
				startTime: this.startTime,
				endTime: this.endTime
			}, '_id hs person pclass oid desc qty ngqty', 'oid').subscribe(items => {
				this.source.load(items);
				this.psubtree = this.psubService.createPsubTree(items);
				console.log(this.psubtree);
				this.loading = false;
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

  editItem(item): void {
    console.log(item);
  }

  showItem(item): void {
    console.log(item);
    let queryParams = {
      'hs.name': this.hs.name,
      'startTime': this.startTime,
      'endTime': this.endTime,
    };
    if (item.name) {
      queryParams['person.oid'] = item.oid;
      this.router.navigate(['../person-stats/'], {queryParams: queryParams,  relativeTo: this.route });
    } else if (item.hs) {
      this.router.navigate(['../psub-show/', item.oid], { relativeTo: this.route });
    } else {
      queryParams['pclass.oid'] = item.oid;
      // this.router.navigate(['../pclass-stats/', item.oid], {queryParams: queryParams, relativeTo: this.route });
      this.router.navigate(['../pclass-stats/'], {queryParams: queryParams,  relativeTo: this.route });

    }

  }

  onFilterChange(event): void {

  }

  onSelChange(event): void {

  }

}
