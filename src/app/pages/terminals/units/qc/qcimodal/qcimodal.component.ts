import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';

import { GlobalData } from '../../../../../@core/model/global';
import { IParameter } from '../../../../../@core/model/parameter';

import { IMsubLot } from '../../../../../@core/model/msublot';
import { ITestResult, IResult,
  TestResult, Result, IResProp, ResProp } from '../../../../../@core/model/common';

@Component({
  selector: 'mes-qcimodal',
  templateUrl: './qcimodal.component.html',
  styleUrls: ['./qcimodal.component.scss']
})
export class QcimodalComponent implements OnInit {
  /**
   * [需要显示的质检抽检项]
   * @type {IParameter[]}
   */
  showItems: IParameter[] = GlobalData.paras.filter(item => item.tags.includes('检验项') && item.active === true);

  msublot: IMsubLot;

  length: number = 0;

  //待检验项
  obj: any = {
    '尺寸': {
      result: new Result(),
      range: '长*宽*高，台下盆量内径，其他量内径',
      show: false,
    },
    '边直度': {
      result: new Result(),
      range: '向外，如2；向内，如-2',
      show: false,
    },
    '孔尺寸': {
      result: new Result(),
      range: '直径',
      show: false,
    },
    '孔距离': {
      result: new Result(),
      range: '间距',
      show: false,
    },
    '三孔一线': {
      result: new Result(),
      range: '向左偏，如3；向右偏，如-3',
      show: false,
    },
    '积水': {
      result: new Result(),
      range: '面积*高度',
      show: false,
    },
    '漏水': {
      result: new Result(),
      range: '面积*高度',
      show: false,
    },
    '重量': {
      result: new Result(),
      range: '成品的重量',
      show: false,
    },
    '试平': {
      result: new Result(),
      range: '成品水平度',
      show: false,
    }
  };

  // 三孔一线特殊处理
  spObj:any = {
    key: '',
    value: ''
  }

  /**
   * [简写]
   * @type {[type]}
   */
  objectKeys = Object.keys;

  constructor(private activeModal: NgbActiveModal) {

  }

  ngOnInit() {
    // this.showItems.forEach(item => this.obj[item.oid].show = true);
    this.showItems = this.showItems.filter(item => {
      let rate: number = Number(item.value.valueStr);
      return rate && this.length % rate === 0;
    });
    this.showItems.forEach(item => {
      this.obj[item.oid].show = true;
      this.obj[item.oid].range = item.desc;
      this.obj[item.oid].result.unit = item.value.unit;
    })
    //TODO: 从 mdef 中获取参数的定义值，并以该值作为参考数据，目前还没有这个数据

  }

  /**
   * [正常关闭Modal，返回对应的结果]
   */
  closeModal() {
    this.showItems.forEach(item => {
      if(item.oid === '三孔一线') {
        this.obj[item.oid].result.valueStr = this.spObj.key=='0' ? this.spObj.key : this.spObj.key + this.spObj.value;
      }
      let prop: IResProp = new ResProp(item);
      let test: ITestResult = new TestResult();
      let result: IResult = this.obj[item.oid].result;
      test.result.push(result);
      test.oid = prop.oid;
      prop.testResult.push(test);
      this.msublot.prop.push(prop);
      // this.msublot.reason = ??
    });
    this.activeModal.close(this.msublot);
  }

   /**
   * [异常关闭Modal, dismiss 该Modal ]
   */
  dismissModal() {
    this.activeModal.dismiss();
  }

}
