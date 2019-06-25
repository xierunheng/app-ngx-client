import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { GlobalData } from '../../../../../@core/model/global';
import { IHierarchyScope } from '../../../../../@core/model/hs';
import { UtilData, MaterialData, WorkData } from '../../../../../@core/data/util.service';
import { Terminal } from '../../../../../@core/model/terminal';
import { MsubLotService } from '../../../../../@core/data/msublot.service';

@Component({
	selector: 'mes-terminal-repair',
	templateUrl: './terminal-repair.component.html',
	styleUrls: ['./terminal-repair.component.scss']
})
export class TerminalRepairComponent implements OnInit {
	@Input() model: Terminal;
	@Input() op: string;
	@Input() player: HTMLAudioElement;

	@Input()
	set oid(value) {
		this.play();
	}

	@Input() tState: string;
	@Output() tStateChange = new EventEmitter<any>();
	
	//有缺陷后的，修复类型
	repairType: string = '机修1';

	//所有的修复类型
	repairTypes: string[] = ['机修1', '机修2'];

	trackUrl: string = 'assets/audio/alert1.mp3';

	constructor(private service: MsubLotService) { }

	ngOnInit() {
		// this.play();
	}

  /**
   * [播放报警音]
   */
	play(): void {
		if (this.player) {
			if (this.player.src !== this.trackUrl) {
				this.player.src = this.trackUrl;
				this.player.load();
			}
			this.player.play();
		}
	}

	/**
	 * [修复成优等品]
	 */
	onRecovery() {
		this.model.reinit(MaterialData.BodyOps.recovery.text);
		this.service.op(this.model.getElite(this.op)).subscribe(item => {
			this.model.reinit(this.op);
			this.tStateChange.emit(UtilData.terminalStates[0]);
		})
	}

	/**
	 * [修复后仍然不能确定被修好，需要进一步修复]
	 */
	onReject() {
		this.model.reinit(MaterialData.BodyOps.reject.text);
		this.model.msublot.repairType = this.repairType;
		this.service.op(this.model.getElite(this.op)).subscribe(item => {
			this.model.reinit(this.op);
			this.tStateChange.emit(UtilData.terminalStates[0]);
		})
	}

	/**
	 * [修复后，成等外品]
	 */
	onPass() {
		this.model.reinit(MaterialData.BodyOps.pass.text);
		this.service.op(this.model.getElite(this.op)).subscribe(item => {
			this.model.reinit(this.op);
			this.tStateChange.emit(UtilData.terminalStates[0]);
		})
	}

	onScrap() {
		this.model.reinit(MaterialData.BodyOps.scrap.text);
		this.service.op(this.model.getElite(this.op)).subscribe(item => {
			this.model.reinit(this.op);
			this.tStateChange.emit(UtilData.terminalStates[0]);
		})
	}

 //  /**
 //   * [成型工拿回去修]
 //   */
	// onSCRenew() {
	// 	this.model.reinit(MaterialData.BodyOps.renew.text);
	// 	this.service.op(this.model.getElite(this.op))
	// 		.subscribe(item => {
	// 			console.log(this.op);
	// 			this.model.reinit(this.op);
	// 			this.tStateChange.emit(UtilData.terminalStates[0]);
	// 		})
	// }

 //  /**
 //   * [修理工拿过去修]
 //   */
	// onSCRepair() {
	// 	this.model.reinit(MaterialData.BodyOps.repair.text);
	// 	this.service.op(this.model.getElite(this.op))
	// 		.subscribe(item => {
	// 			console.log(this.op);
	// 			this.model.reinit(this.op);
	// 			this.tStateChange.emit(UtilData.terminalStates[0]);
	// 		})
	// }

	onCancel() {
		this.tStateChange.emit(UtilData.terminalStates[0]);
	}

}
