import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';

import { GlobalData } from '../../../../@core/model/global';
import { IQuantity } from '../../../../@core/model/common';
import { UtilData, MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IUser } from '../../../../@core/model/user';
import { IMdefElite } from '../../../../@core/model/mdef';
import { Terminal, IBodyOp, IBodyRecord } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { MdefService } from '../../../../@core/data/mdef.service';
import { PersonService } from '../../../../@core/data/person.service';
import { PsubService } from '../../../../@core/data/psub.service';

@Component({
	selector: 'mes-repair',
	templateUrl: './repair.component.html',
	styleUrls: ['../pda.scss','./repair.component.scss']
})
export class RepairComponent implements OnInit {
	@ViewChild('codeInput') codeInput: ElementRef;

	player: HTMLAudioElement = new Audio();

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

	//当前生产的总数
	mQty: IQuantity;

	//条码录入的方式，目前有‘扫码', '手动' 两种
	inputType: string = '扫码';

	//可选的录入类型
	inputTypes = {
		scan: {
			text: '扫码',
			desc: '扫码输入'
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

	//数组，方便 html 使用
	inputTypesArr = _.values(this.inputTypes);

	//有缺陷后的，修复类型
	repairType: string = '机修1';

	//所有的修复类型
	repairTypes: string[] = ['机修1', '机修2'];


	//当前终端的状态，用于界面的呈现
	tState: string = UtilData.terminalStates[0];

	//上一次扫码的操作记录
	lastBodies: IBodyRecord[] = [];

	get strQty() {
		return `${this.lastBodies.length}/${this.mQty ? this.mQty.quantity : 0}`;
	}

	//新的条形码
	newBarcode: string;

	//扫码枪的扫码内容
	strBody: string;

	valueBuffer: string = '';

	/**
   * [缺陷分类]
   * @type {any[]}
   */
  productStates: any[] = [
    {
      qcState: '',
      desc: '',
    }, {
      qcState: 'Defective',
      desc: '优等品',
    }, {
      qcState: 'NG',
      desc: '次等品',
    }
  ];

  product: any;

	@HostListener('document:keypress', ['$event'])
	keyboardInput(e: KeyboardEvent) {
		if (this.model) {
			const char = String.fromCharCode(e.which);
			if (char === '\r' || char === '\n' || char === '\r\n') {
				if (this.codeInput) {
					this.codeInput.nativeElement.focus();
				}
				if (this.inputType === this.inputTypes.scan.text && this.valueBuffer) {
					this.strBody = this.valueBuffer;
					this.doOP(this.strBody);
					this.valueBuffer = '';
				} else if (this.inputType === this.inputTypes.hand.text && this.strBody) {
					this.doOP(this.strBody);
				} else if (this.inputType === this.inputTypes.replace.text) {
					if (this.strBody && this.newBarcode) {
						this.doOP(this.strBody);
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
		private pService: PersonService,
		private psubService: PsubService) {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.bodyOp = MaterialData.BodyOps[this.user.op];
	}

	ngOnInit() {
		this.model = Terminal.create(this.user);
		this.aggrMdef();
		// this.product = this.productStates[0];
	}

	reload(): void {
		this.ngOnInit();
	}

  /**
   * [统计今天的作业数据]
   */
	aggrMdef(): void {
		if (this.model && this.model.psub) {
			this.psubService.aggrMdef(this.model.psub._id).subscribe(item => {
				this.mActCount = _.toPairs(item.mCount);
				this.mQty = item.mQty;
			})
		}
	}

  /**
   * [当输入类型发生变化时，我们清空所有的内容]
   * @param {[type]} event [description]
   */
	onInputTypeChange(event) {
		event.srcElement.blur();
		this.valueBuffer = '';
		this.strBody = '';
		this.newBarcode = '';
	}

	doOP(oid: string) {
		this.model.msublot.oid = oid.trim();
		this.service.getMsubLotsProfileBy({oid:oid.trim()}).subscribe(msub => {
			// this.model.msublot = msub[0];
			// this.product = this.productStates.find(i => i.qcState == msub[0].qcState);
			if (msub[0].repairType !== undefined && msub[0].repairType !== this.user.hs.name){
				this.tState = this.model.judgeResult({
					type: UtilData.terminalErrs[7],
					entity: this.model.msublot.oid,
					message: '只能使用' + msub[0].repairType + '来修复！',
				}, this.bodyOp.state, this.bodyOp.text);
				// this.product = this.productStates[0];
				this.model.msublot.reason = [];
			}
			else {
				this.service.op(this.model).subscribe(item => {
					this.model.reinit(this.bodyOp.text);
					this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
					if (this.tState === UtilData.terminalStates[0]) {
						this.model.msublot = item;
						// this.product = this.productStates.find(i => i.qcState == item.qcState);
						this.mQty = item.mQty;
						this.lastBodies.push({
							str: oid.trim(),
							date: new Date()
						});

					}
				});
			}
		});

		// if (this.model.msublot.repairType !== this.repairType) {
		// 	switch (this.inputType) {
		// 		case this.inputTypes.replace.text:
		// 			this.model.msublot.usedOid = [];
		// 			this.model.msublot.usedOid.push(this.newBarcode.trim());
		// 			this.model.reinit(MaterialData.BodyOps.replace.text);
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	this.service.op(this.model).subscribe(item => {
		// 		this.model.reinit(this.bodyOp.text);
		// 		this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
		// 		if (this.tState === UtilData.terminalStates[0]) {
		// 			this.mQty = item.mQty;
		// 			this.lastBodies.push({
		// 				str: oid.trim(),
		// 				date: new Date()
		// 			});

		// 		}
		// 	});
		// } else {
		// 	this.tState = this.model.judgeResult({
		// 		type: UtilData.terminalErrs[7],
		// 		entity: this.model.msublot.oid,
		// 		message: '修复方式不一致!'
		// 	}, this.bodyOp.state, this.bodyOp.text);
		// }
	}

	// onRepair() {
	// 	this.doOP(this.strBody.trim());
	// }

	onScrap() {
		this.model.msublot.oid = this.strBody.trim();
		this.model.reinit(MaterialData.BodyOps.scrap.text);
		this.service.op(this.model)
      .subscribe(item => {
        this.model.reinit(this.bodyOp.text);
        this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
		if (this.tState === UtilData.terminalStates[0]) {
			this.mQty = item.mQty;
		}
      })
	}

	flipClick() {
		this.flipped = !this.flipped;
		if (this.flipped) {
			this.aggrMdef();
		}
	}


}
