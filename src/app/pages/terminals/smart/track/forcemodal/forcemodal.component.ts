import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import { GlobalData } from '../../../../../@core/model/global';
import { IParameter } from '../../../../../@core/model/parameter';
import { UtilData, MaterialData, WorkData } from '../../../../../@core/data/util.service';
import { MsubLotService } from '../../../../../@core/data/msublot.service';

import { IMOpLog } from '../../../../../@core/model/base/oplog';

@Component({
  selector: 'forcemodal',
  templateUrl: './forcemodal.component.html',
  styleUrls: ['./forcemodal.component.scss']
})
export class ForcemodalComponent implements OnInit {
	oplog: IMOpLog;

  reasons: IParameter[];

  isSample: boolean = false;

  constructor(private activeModal: NgbActiveModal,
    private service: MsubLotService) { }

  ngOnInit() {
  	this.reasons = GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[21]));
  }

  //点击 本工序缺陷
  defectIt(): void {
    if(window.confirm(`强制归类为[${MaterialData.BodyOps[this.oplog.op].name}]工序缺陷，是否继续?`)) {
    	let ol: IMOpLog = _.cloneDeep(this.oplog);
    	ol.reason = this.reasons.filter(item => item.oid === '巡检缺陷');
    	console.log(ol.reason);
    	ol.date = undefined;
    	ol.op = MaterialData.BodyOps.track.text;
	  	this.activeModal.close(ol);
    }
  }

  //点击 本工序报废
  scrapIt(): void {
    if(window.confirm(`强制归类为[${MaterialData.BodyOps[this.oplog.op].name}]工序报废，是否继续?`)) {
    	let ol: IMOpLog = _.cloneDeep(this.oplog);
    	ol.reason = this.reasons.filter(item => item.oid === '巡检报废');
    	ol.date = undefined;
    	ol.op = MaterialData.BodyOps.scrap.text;
	  	this.activeModal.close(ol);
    }
  }

  /**
   * [定性该成品为样品,
   * TODO: 这样操作不合适]
   */
  sampleIt(): void {
   if(window.confirm(`强制为样品，是否继续?`)) {
     let ol: IMOpLog = _.cloneDeep(this.oplog);
     ol.op = 'SAMP';
     this.activeModal.close(ol);
    } 

  }

     /**
   * [异常关闭Modal, dismiss 该Modal ]
   */
  dismissModal() {
    this.activeModal.dismiss();
  }

}
