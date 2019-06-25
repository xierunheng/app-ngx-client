import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';

import { IUser } from '../../../../@core/model/user';
import { UtilData, MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IMlot } from '../../../../@core/model/mlot';
import { MlotService } from '../../../../@core/data/mlot.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { Terminal, IBodyOp, IBodyRecord } from '../../../../@core/model/terminal';
import { TestmodalComponent } from './testmodal/testmodal.component';

@Component({
	selector: 'gc',
	templateUrl: './gc.component.html',
	styleUrls: ['./gc.component.scss']
})
export class GCComponent implements OnInit {
	//当前登陆的用户
	user: IUser;

	//当前登陆的工序所执行的坯体操作
	bodyOp: IBodyOp;

	/**
	 * [待检测的物料批次]
	 * @type {IMlot[]}
	 */
	mlots: IMlot[];

	items: string[] = ['配前釉比重', '胶量配比', '比重', '流速', 'PH值', '吸干速度', '吸干厚度', '储釉桶号', '配釉温度', '配釉湿度'];

	constructor(private service: MlotService,
		private modalService: NgbModal,
		private jrService: JobResponseService) {
		this.user = JSON.parse(localStorage.getItem('user'));
		this.bodyOp = MaterialData.BodyOps[this.user.op];
	}

	ngOnInit() {
		this.reload();
	}

	reload(): void {
		this.jrService.getCurrGlazeLot().subscribe(mlots => {
			this.mlots = mlots;
			if (this.mlots && this.mlots.length > 0) {
				this.mlots.forEach(mlot => {
					let propSpec = _.mapValues(_.groupBy(mlot.prop, 'oid'), items => items.length > 0 ? items[0].testResult : undefined);
					Object.defineProperty(mlot, 'propSpec', {
						value: propSpec
					});
					let test = mlot.prop.find(p => p.oid === '胶量配比');
					// if (test && test.testResult.length <= 4) {
						setTimeout(() => this.addTest(mlot), 1000 * 2);
					// }
				})
			}
		})
	}

	/**
	 * [主动弹出新增记录操作]
	 * @param {IMlot} mlot [description]
	 */
	addTest(mlot: IMlot): void {
		const modal = this.modalService.open(TestmodalComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
		modal.componentInstance.mlot = mlot;
		modal.result.then((result) => {
			this.service.updateMlot(result).subscribe(item => {
				let test = mlot.prop.find(p => p.oid === '胶量配比');
				if (test && test.testResult.length <= 4) {
					setTimeout(() => this.addTest(mlot), 1000 * 60 * 60 * 2);
				}
			})
		}, (reason) => {
			console.log(reason);
			return;
		});
	}

}
