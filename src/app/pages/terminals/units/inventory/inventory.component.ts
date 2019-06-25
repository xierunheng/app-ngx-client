import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';

import { GlobalData } from '../../../../@core/model/global';
import { IQuantity } from '../../../../@core/model/common';
import { IParameter } from '../../../../@core/model/parameter';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { UtilData, MaterialData, WorkData, IDCmpFn } from '../../../../@core/data/util.service';
import { IUser } from '../../../../@core/model/user';
import { IMdefElite } from '../../../../@core/model/mdef';
import { Terminal, IBodyOp, IBodyRecord } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { MdefService } from '../../../../@core/data/mdef.service';
import { MclassService } from '../../../../@core/data/mclass.service';
import { PersonService } from '../../../../@core/data/person.service';
import { PsubService } from '../../../../@core/data/psub.service';
import { WorkAlertService } from '../../../../@core/data/work-alert.service';
import { WorkAlertDefService } from '../../../../@core/data/work-alert-def.service';
import { IWorkAlert, WorkAlert } from '../../../../@core/model/work-alert';
import { IWorkAlertDef } from '../../../../@core/model/work-alert-def';

@Component({
	selector: 'mes-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['../pda.scss', './inventory.component.scss']
})
export class InventoryComponent implements OnInit {
	@Output() update = new EventEmitter<any>();
	@Output() confirm = new EventEmitter<any>();
	@ViewChild('codeInput') codeInput: ElementRef;

	player: HTMLAudioElement = new Audio();

	//logo
	logo = UtilData.logo;
	//是否翻页
	flipped = false;

	//当前登陆的用户
	user: IUser;

	//当前登陆的工序所执行的坯体操作
	bodyOp: IBodyOp;

	//终端生产操作 model
	model: Terminal;

	//当前生产的各款坯体的统计数量
	mActCount: any[];

	//当前盘点的总数
	mTotal: number = 0;

	//条码录入的方式，目前有‘扫码', '手动' 两种
	inputType: string = '优等盘';

	//可选的录入类型
	inputTypes = {
		inventory: {
			text: '盘点',
			desc: '普通盘点'
		},
		invqc: {
			text: '优等盘',
			desc: '优等品盘点'
		},
		invpass: {
			text: '等外盘',
			desc: '等外品盘点',
		},
		invscrap: {
			text: '报废盘',
			desc: '报废盘点',
		},
		hand: {
			text: '手动',
			desc: '手动输入'
		},
		replace: {
			text: '换码',
			desc: '条码替换'
		},
	};

	//当前终端的状态，用于界面的呈现
	tState: string = UtilData.terminalStates[0];

	//上一次扫码的操作记录
	lastBodies: IBodyRecord[] = [];

	get strQty() {
		return `${this.lastBodies.length}/${this.mTotal}`;
	}

	//新的条形码
	newBarcode: string;

	//扫码枪的扫码内容
	strBody: string;

	valueBuffer: string = '';

	idCmpFn = IDCmpFn;

	/**
		 * [备选的仓库]
		 * @param {[type]} item => item.path.includes('仓储部') [description]
		 */
	locs: IHierarchyScope[] = GlobalData.hss.filter(item => item.name.includes('仓储部'));

	// tree of Mdef, with Mclass
	mtree: TreeviewItem[];

	//盘点缺陷
	defectReason: IParameter = GlobalData.paras.find(item => item.oid === '盘点缺陷');

	//盘点报废
	scrapReason: IParameter = GlobalData.paras.find(item => item.oid === '盘点报废');

	/**
		* [手动 -> 扫码的 自动切换]
		* @type {true}
		*/
	autoSwitch: boolean = true;

  /**
   * [简写]
   * @type {[type]}
   */
	objectKeys = Object.keys;
	objectValues = Object.values;

	@HostListener('document:keypress', ['$event'])
	keyboardInput(e: KeyboardEvent) {
		// console.log(this.model);
		if (this.model && this.model.msublot) {
			const char = String.fromCharCode(e.which);
			if (char === '\r' || char === '\n' || char === '\r\n') {
				//没有效果
				if (this.codeInput) {
					this.codeInput.nativeElement.focus();
				}
				// if ((this.inputType === this.inputTypes.inventory.text ||
				// 	this.inputType === this.inputTypes.invqc.text ||
				// 	this.inputType === this.inputTypes.invpass.text ||
				// 	this.inputType === this.inputTypes.invscrap.text) && this.valueBuffer) {
				// 	this.strBody = this.valueBuffer;
				if ((this.inputType === this.inputTypes.inventory.text ||
					this.inputType === this.inputTypes.invqc.text ||
					this.inputType === this.inputTypes.invpass.text ||
					this.inputType === this.inputTypes.invscrap.text) && this.valueBuffer) {
					this.strBody = this.valueBuffer;
					this.doOP(this.strBody);
					this.valueBuffer = '';
				} else if (this.inputType === this.inputTypes.hand.text && this.strBody) {
					this.doOP(this.strBody);
				} else if (this.inputType === this.inputTypes.replace.text) {
					if (this.strBody && this.newBarcode) {
						this.doOP(this.strBody);
						this.valueBuffer = '';
						if (this.autoSwitch) {
							this.inputType = this.inputTypes.invqc.text;
							this.strBody = '';
						}
					}
				}
			} else {
				this.valueBuffer += char;
			}
		}
	}

	get stateClass(): string {
		let rnClass: string = '';
		switch (this.tState) {
			case 'run':
				rnClass = 'form-control-info';
				break;
			case 'qc':
				rnClass = 'form-control-warning';
				break;
			case 'sc':
				rnClass = 'form-control-hint';
				break;
			case 'err':
				rnClass = 'form-control-danger';
				break;
			default:
				break;
		}
		return rnClass;
	}

	constructor(private service: MsubLotService,
		private mdService: MdefService,
		private mcService: MclassService,
		private pService: PersonService,
		private waService: WorkAlertService,
		private wadService: WorkAlertDefService,
		private psubService: PsubService) {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.bodyOp = MaterialData.BodyOps[this.user.op];
	}

	ngOnInit() {
		this.player.src = 'assets/audio/alert1.mp3';
		this.player.load();
		this.mcService.getMclasssBy({ oid: { $in: [UtilData.txtProduct, UtilData.txtPT] } }).subscribe(mc => {
			this.mtree = this.mcService.newMTree(mc);
			this.model = Terminal.create(this.user);
			if (this.inputType === this.inputTypes.invqc.text) {
				this.bodyOp = MaterialData.BodyOps.invqc;
				this.model.reinit(this.bodyOp.text);
			}
			this.aggrMdef();
		})
		console.log(this.user);
	}

	reload(): void {
		this.ngOnInit();
	}

  /**
   * [统计所有物料的盘点信息]
   */
	aggrMdef(): void {
		// if (this.model && this.model.psub) {
		// 	this.psubService.aggrMdef(this.model.psub._id).subscribe(item => {
		// 		this.mActCount = _.toPairs(item.mCount);
		// 		this.mQty = item.mQty;
		// 	})
		// }
		let query = {};
		if (this.inputType === this.inputTypes.inventory.text) {
			query = {
				'inver.oid': this.user.person.oid,
				qcState: { $ne: MaterialData.BodyOps.scrap.state }
			};
		} else {
			query = {
				'inver.oid': this.user.person.oid,
				qcState: MaterialData.BodyOps.qc.state,
			};
		}

		if (this.model) {
			this.service.aggrInventoryTimely(moment().startOf('day').format(),
				moment().endOf('day').format(), ['mdef'], query)
				.subscribe(items => {
					this.mTotal = items.length > 0 ? items.map(item => item.count).reduce((prev, curr) => prev + curr) : 0;
					this.mActCount = items;
				});
		}
	}

  /**
   * [当成型工选择物料后，把物料属性赋值给物料子批次]
   * @param {[type]} event [description]
   */
	onMdefChange(event) {
		console.log(event);
		this.valueBuffer = '';
		console.log(this.model.msublot);
		// if(this.model.msublot.mdef && this.model.msublot.mdef._id !== event._id) {
		if (window.confirm('是否更新物料信息？')) {
			this.model.msublot.mdef = event;
			this.service.updateMdef(this.model.msublot._id, this.model.msublot.mdef).subscribe(() => {
			});
		} else {
			this.model.msublot.mdef = Object.assign({}, this.model.msublot.mdef);
		}
		// }
	}

  /**
   * [当输入类型发生变化时，我们清空所有的内容]
   * @param {[type]} event [description]
   */
	onInputTypeChange(event) {
		if (this.inputType === this.inputTypes.invqc.text) {
			this.bodyOp = MaterialData.BodyOps.invqc;
			this.model.reinit(this.bodyOp.text);
		} else if (this.inputType === this.inputTypes.invpass.text) {
			this.bodyOp = MaterialData.BodyOps.invpass;
			this.model.reinit(this.bodyOp.text, [this.defectReason]);
		} else if (this.inputType === this.inputTypes.invscrap.text) {
			this.bodyOp = MaterialData.BodyOps.invscrap;
			this.model.reinit(this.bodyOp.text, [this.scrapReason]);
		} else if (this.inputType === this.inputTypes.inventory.text) {
			this.bodyOp = MaterialData.BodyOps.inventory;
			this.model.reinit(this.bodyOp.text);
		}
		event.srcElement.blur();
		this.valueBuffer = '';
		this.strBody = '';
		this.newBarcode = '';
	}

	doOP(oid: string) {
		this.model.msublot.oid = oid.trim();
		switch (this.inputType) {
			case this.inputTypes.replace.text:
				this.model.msublot.usedOid = [];
				this.model.msublot.usedOid.push(this.newBarcode.trim());
				this.model.reinit(MaterialData.BodyOps.replace.text);
				break;
			default:
				break;
		}
		this.service.op(this.model).subscribe(item => {
			console.log('item', item);
			this.model.reinit(this.bodyOp.text);
			this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
			if (this.tState === UtilData.terminalStates[0]) {
				this.model.msublot._id = item._id;
				if (item.mdef.oid !== 'DUMMY') {
					this.model.msublot.mdef = item.mdef;
					if (this.inputType === this.inputTypes.invqc.text ||
						this.inputType === this.inputTypes.invpass.text) {
						//if(item.mclass && item.mclass.length > 0 && item.mclass[0].oid !== UtilData.txtProduct) {
						if (!(item.mdef.oid.endsWith('WH') ||
							item.mdef.oid.endsWith('BT') ||
							item.mdef.oid.endsWith('BK') ||
							item.mdef.oid.endsWith('LB') ||
							item.mdef.oid.endsWith('W2') ||
							item.mdef.oid.endsWith('B2') ||
							item.mdef.oid.endsWith('K2') ||
							item.mdef.oid.endsWith('L2'))) {
							this.player.play();
							window.alert('物料类型不是成品，请重新选择！');
						}
					}
				}
				if (item.mQty) {
					this.mTotal = item.mQty.quantity;
				}
				if (this.lastBodies.findIndex(item => item.str === oid.trim()) < 0) {
					this.lastBodies.push({
						str: oid.trim(),
						date: new Date()
					});
				}
			}
		});
	}

  /**
   * [翻页]
   */
	flipClick() {
		this.flipped = !this.flipped;
		if (this.flipped) {
			this.aggrMdef();
		}
	}

}
