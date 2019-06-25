import { Component, OnInit, Input } from '@angular/core';
import { IWorkResponse, IWork } from '../../../../../@core/model/work-res';
import { IWorkRequest } from '../../../../../@core/model/work-req';

@Component({
  selector: 'mes-work-show-qty',
  templateUrl: './work-show-qty.component.html',
  styleUrls: ['./work-show-qty.component.scss']
})
export class WorkShowQtyComponent implements OnInit {
	_wreq: IWorkRequest;
	@Input()
	set wreq(wreq: IWorkRequest) {
		this._wreq = wreq;
		this.init();
	}

	_wres: IWorkResponse;
	@Input()
	set wres(wres: IWorkResponse) {
		this._wres = wres;
		this.init();
	}

	jobs: any[];
	selectedOne: any;

	isSingleView = false;

	selectOne(item: any) {
		this.selectedOne = item;
		this.isSingleView = true;
	}
  constructor() { }

  ngOnInit() {
  }

  init(): void {
  	if(this._wres && this._wreq) {
  		this.jobs = this._wres.jobResponse
  			.filter(jr => jr.directive.proseg.oid !== '成型')
				.sort((a, b) => Number(a.directive.proseg.no) - Number(b.directive.proseg.no))
				.map(jr => {
					let jo = this._wreq.jobOrder.find(jo => jo._id === jr.jobOrder._id);
					return {
						jr: jr,
						jo: jo,
					};
				});
			console.log(this.jobs);
  	}

  }

}
