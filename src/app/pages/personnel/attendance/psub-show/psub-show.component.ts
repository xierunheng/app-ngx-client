import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';

import { IPsub, Psub } from '../../../../@core/model/psub';
import { PsubService } from '../../../../@core/data/psub.service';

@Component({
  selector: 'mes-psub-show',
  templateUrl: './psub-show.component.html',
  styleUrls: ['./psub-show.component.scss']
})
export class PsubShowComponent implements OnInit {
	//产出的可选的呈现类型
	qtyTypes: string[] = ['仅物料', '物料+成型工'];

	//产出呈现的类型
	qtyType: string = this.qtyTypes[0];

	/**
	 * [待呈现的员工作业项]
	 * @type {IPsub}
	 */
  psub: IPsub;

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  constructor(private router: Router,
		private route: ActivatedRoute,
		private location: Location,
    private psubService: PsubService) { }

  ngOnInit() {
  	this.loading = true;
		let oid = this.route.snapshot.paramMap.get('oid');
		this.psubService.getPsubNo404({oid: oid}).subscribe(psub => {
			this.psub = psub;
      console.log(this.psub);
			this.init();
			this.loading = false;
		})
  }

  init(): void {

  }


}
