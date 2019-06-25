import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilData, IDCmpFn, TableSettings } from '../../../../../../@core/data/util.service';
import { BarData, EchartBar, EchartBarData } from '../../../../../../@core/model/job-response';
import { IPersonElite } from '../../../../../../@core/model/person';
import { IMdefElite } from '../../../../../../@core/model/mdef';
import { MaterialData } from '../../../../../../@core/data/util.service';
import { MsubLotService } from '../../../../../../@core/data/msublot.service';
import { PsubService } from '../../../../../../@core/data/psub.service';
import { PersonService } from '../../../../../../@core/data/person.service';
import { MclassService } from '../../../../../../@core/data/mclass.service';


@Component({
	selector: 'mes-molder-body-trimable',
	templateUrl: './molder-body-trimable.component.html',
	styleUrls: ['./molder-body-trimable.component.scss']
})
export class MolderBodyTrimableComponent implements OnInit {
	//干燥起时
	startTime = moment().subtract(1, 'month');
	//干燥时间
	endTime: Date = new Date();

	bodys: any[];

	bodycolumns = {
		molder: {
			title: '成型工',
			type: 'string',
		},
		mdef: {
			title: '型号',
			type: 'string',
		},
		count: {
			title: '数量',
			type: 'string',
		}
	};

	// tree-select 的比较函数
	idCmpFn = IDCmpFn;

	constructor(private location: Location,
		private mslService: MsubLotService,
		private mcService: MclassService,
		private pService: PersonService,
		private psubService: PsubService) {

	}

	ngOnInit() {
		this.search();
	}

	onSubmit(value) {
		this.search();
	}

	search() {
		this.mslService.aggrDriedTimely(this.startTime.toString(), this.endTime.toString(), ['molder', 'mdef']).subscribe(items => {
			this.bodys = items;
		})
	}
  /**
   * [回退到上一个页面]
   */
	goBack(): void {
		this.location.back();
	}

}
