import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import * as moment from 'moment';

import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';

import { UtilData, TableSettings } from '../../../../@core/data/util.service';
import { OpDefService } from '../../../../@core/data/op-def.service';
import { IOpDef, OpDef } from '../../../../@core/model/op-def';
import { OpDefInfoComponent } from './op-def-info/op-def-info.component';

@Component({
	selector: 'mes-op-def',
	templateUrl: './op-def.component.html',
	styleUrls: ['./op-def.component.scss']
})
export class OpDefComponent implements OnInit {
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

	opdef: IOpDef[];

	optree: TreeviewItem[];

	/**
	 * [当前页面是否在加载数据，
	 *  1. true，显示加载图标；
	 *  2. false，不显示加载图标]
	 * @type {boolean}
	 */
	loading: boolean = false;


	// SocketService;
	constructor(private router: Router,
		private route: ActivatedRoute,
		private service: OpDefService,
		private dialogServie: NbDialogService) {
		this.initSetting();
	}

	initSetting(): void {
		this.settings.mode = TableSettings.exMode;
		this.settings.columns = {
			oid: {
				title: 'ID',
				type: 'string',
			},
			ver: {
				title: '版本',
				type: 'string',
			},
			code: {
				title: '编码',
				type: 'string',
			},
			desc: {
				title: '描述',
				type: 'string',
			},
			opType: {
				title: '操作类型',
				type: 'string',
			},
			hs: {
				title: '层级结构',
				type: 'string',
				valuePrepareFunction: (hs, row) => {
					return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
				},
				filterFunction: (value, search) => {
					return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
						(value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
				}
			},
			pubDate: {
				title: '发布时间',
				type: 'string',
				valuePrepareFunction: (pubDate, row) => {
					return row.pubDate ? moment(row.pubDate).format('YYYY-MM-DD') : '';
				},
			},
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
		this.service.getOpDefinitions().subscribe(items => {
			this.source.load(items);
			this.optree = this.service.createOpTree(items);
			this.loading = false;
		});
	}

	/**
	 * [创建新的hs]
	 * @param {IOpDef = undefined} opd [description]
	 */
	create(opd: IOpDef = undefined): void {
		this.dialogServie.open(OpDefInfoComponent, {
			context: {
				title: `新建 层级结构`,
				model: opd || new OpDef()
			},
		}).onClose.subscribe(rn => {
			if(rn) {
				this.service.createOpDefinition(rn).subscribe(item => {
					// this.source.prepend(item);
					this.init();
				})
			}
		});
	}

	/**
	 * [修改hs]
	 * @param {IOpDef} opd [description]
	 */
	edit(opd: IOpDef): void {
		let modelObserver = jsonpatch.observe(opd);
		this.dialogServie.open(OpDefInfoComponent, {
			context: {
				title: `更新 [${opd.oid}] 信息`,
				model: opd 
			},
		}).onClose.subscribe(rn => {
			if(rn) {
				let patch = jsonpatch.generate(modelObserver);
				this.service.patchOpDefinition(opd._id, patch).subscribe(item => {
					// this.source.refresh();
					this.init();
				})
			}
		});
	}

	/**
	 * [删除hs]
	 * @param {IOpDef} opd [description]
	 */
	remove(opd: IOpDef): void {
		if (window.confirm(UtilData.txtDeleteRowDes)) {
			this.service.deleteOpDefinition(opd).subscribe(() => {
				// this.source.remove(hs);
				// this.source.refresh();
				this.init();
			});
		}
	}

	addItem(): void {
		return this.create();
	}

	onFilterChange(event): void {

	}

	onSelChange(event): void {

	}

	ngOnDestroy() {
	}
}
