import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { treeConfig, ViewConfig } from '../../../../@core/utils/config';

import { HsService } from '../../../../@core/data/hs.service';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { GlobalData } from '../../../../@core/model/global';
import { IHierarchyScope, HierarchyScope } from '../../../../@core/model/hs';

import { HsInfoComponent } from './hs-info/hs-info.component';
import { HsPopComponent } from './hs-pop/hs-pop.component';


@Component({
	selector: 'mes-hs',
	templateUrl: './hs.component.html',
	styleUrls: ['./hs.component.scss']
})
export class HsComponent implements OnInit {
	//显示的类型, table or tree, default is tree
	showtype: string = 'tree';

	settings = { ...TableSettings.basic };

	source: LocalDataSource = new LocalDataSource();
	//每页显示的行数
	perPage: number = this.settings.pager.perPage;

	//单选的 ngx-treeview
	singleConfig = TreeviewConfig.create({
		hasAllCheckBox: false,
		hasCollapseExpand: false,
		hasFilter: true,
		decoupleChildFromParent: true,
		maxHeight: 1000
	});

	//树状呈现hs
	hstree: TreeviewItem[];

	// get hstree() {
	// 	return GlobalData.hstree;
	// }

	//判断该结点是否为叶子结点
	isLeaf = this.service.isLeaf;

	/**
	 * [当前页面是否在加载数据，
	 *  1. true，显示加载图标；
	 *  2. false，不显示加载图标]
	 * @type {boolean}
	 */
	loading: boolean = false;

	popComponent = HsPopComponent;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private service: HsService,
		private dialogServie: NbDialogService) {
		this.initSetting();
	}

	initSetting(): void {
		this.settings.mode = TableSettings.exMode;
		this.settings.columns = {
			name: {
				title: '名称',
				type: 'string',
			},
			code: {
				title: '编号',
				type: 'string',
			},
			level: {
				title: '层级',
				type: 'string',
			},
			path: {
				title: '层级路径',
				type: 'string',
			},
			remark: {
				title: '备注',
				type: 'string',
			}
		};
	}

	ngOnInit() {
		this.init();
	}

	/**
	 * [当hs发生变化时，可能会连带其他的hs发生变化，
	 * 所以每次发生变化时，需要连带所有的hs都更新]
	 */
	init(): void {
		this.loading = true;
		// this.service.getHss().subscribe(hss => {
			this.service.searchHssEncode({path: { $regex: '传奇陶瓷'}}).subscribe(hss => {
			this.source.load(hss);
		    if (hss.length>0){
				this.hstree = this.service.createTree(hss);
		    }
			this.loading = false;
		});
	}

	/**
	 * [创建新的hs]
	 * @param {IHierarchyScope = undefined} hs [description]
	 */
	create(hs: IHierarchyScope = undefined): void {
		this.dialogServie.open(HsInfoComponent, {
			context: {
				title: `新建 层级结构`,
				model: hs || new HierarchyScope()
			},
		}).onClose.subscribe(rn => {
			if(rn) {
				this.service.createHs(rn).subscribe(item => {
					// this.source.prepend(item);
					this.init();
				})
			}
		});
	}

	/**
	 * [修改hs]
	 * @param {IHierarchyScope} hs [description]
	 */
	edit(hs: IHierarchyScope): void {
		let modelObserver = jsonpatch.observe(hs);
		this.dialogServie.open(HsInfoComponent, {
			context: {
				title: `更新 [${hs.name}] 信息`,
				model: hs
			},
		}).onClose.subscribe(rn => {
			if(rn) {
				let patch = jsonpatch.generate(modelObserver);
				this.service.patchHs(hs._id, patch).subscribe(item => {
					// this.source.refresh();
					this.init();
				})
			}
		});
	}

	/**
	 * [删除hs]
	 * @param {IHierarchyScope} hs [description]
	 */
	remove(hs: IHierarchyScope): void {
		if (window.confirm(UtilData.txtDeleteRowDes)) {
			this.service.deleteHs(hs).subscribe(() => {
				// this.source.remove(hs);
				// this.source.refresh();
				this.init();
			});
		}
	}

	addItem(item): void {
		let model = new HierarchyScope();
		model.path = this.service.getCurrPath(item.value);
		model.level = this.service.getChildLevel(model.path, GlobalData.hss);
		this.create(model);
	}

	onFilterChange(event): void {

	}

	onSelChange(event): void {

	}

  /**
   * [当每页显示数发生变化时，及时响应]
   * @param {[type]} perPage [description]
   */
	onPerPageChange(event) {
		this.perPage = event.target.valueAsNumber;
		this.source.setPaging(1, this.perPage, true);
	}

  /**
   * [是否显示perPage]
   * @return {boolean} [description]
   */
	shouldShow(): boolean {
		return this.source.count() > this.perPage;
	}

	ngOnDestroy() {
		// this.SocketService.unsyncUpdates('thing');
	}

}
