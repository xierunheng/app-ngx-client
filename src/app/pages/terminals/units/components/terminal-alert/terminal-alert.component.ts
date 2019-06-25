import { Component, OnInit, Input } from '@angular/core';

import { UtilData, IDCmpFn } from '../../../../../@core/data/util.service';
import { Terminal, IBodyOp } from '../../../../../@core/model/terminal';
import { IUser } from '../../../../../@core/model/user';
import { WorkAlertService } from '../../../../../@core/data/work-alert.service';
import { WorkAlertDefService } from '../../../../../@core/data/work-alert-def.service';
import { IWorkAlert, WorkAlert } from '../../../../../@core/model/work-alert';
import { IWorkAlertDefElite } from '../../../../../@core/model/work-alert-def';

@Component({
	selector: 'mes-terminal-alert',
	templateUrl: './terminal-alert.component.html',
	styleUrls: ['./terminal-alert.component.scss']
})
export class TerminalAlertComponent implements OnInit {
	//当前登陆的用户
	user: IUser;

	alert: WorkAlert = new WorkAlert();

	//workalert defs 
	workAlertDefs: IWorkAlertDefElite[];

	priorities: any = {
		'一般': 1,
		'中等': 2,
		'紧急': 3,
	};

	states: any = {
		'Forecast': '已发送',
		'Released': '已应答',
	};

  /**
   * [简写]
   * @type {[type]}
   */
	objectKeys = Object.keys;

  /**
   * [历史报警信息]
   * @type {WorkAlert[]}
   */
	alerts: IWorkAlert[];

	idCmpFn = IDCmpFn;

	constructor(private service: WorkAlertService,
		private wadefService: WorkAlertDefService) {
		this.user = JSON.parse(localStorage.getItem('user'));
	}

	ngOnInit() {
		this.wadefService.getWorkAlertDefsElite().subscribe(wadefs => {
			this.workAlertDefs = wadefs;
			this.service.searchWorkAlert({ 'person._id': this.user.person._id }, '', 'oid', 5).subscribe(alerts => {
				this.alerts = alerts;
			})
		});
	}

	onWorkAlertDefChange(event): void {
		this.wadefService.getWorkAlertDef(this.alert.workAlertDef._id).subscribe(wadef => {
			this.alert.DeriveFromDef(wadef);
			this.alert.person = this.user.person;
			this.alert.hs = this.user.hs;
			this.alert.formatOid();
			console.log(this.alert);
		})
	}

	/**
	 * [用户提交]
	 * @param {[type]} event [description]
	 */
	onRelease(event): void {
		this.service.createWorkAlert(this.alert).subscribe(item => {
			this.service.searchWorkAlert({ 'person._id': this.user.person._id }, '', 'oid', 5).subscribe(alerts => {
				this.alerts = alerts;
			})
		});

	}
}
