import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { LocalDataSource } from 'ng2-smart-table';

import { GlobalData } from '../../../@core/model/global';
import { IResProp, ResProp, IQuantity } from '../../../@core/model/common';
import { IParameter } from '../../../@core/model/parameter';
import { UtilData, IDCmpFn } from '../../../@core/data/util.service';

@Component({
  selector: 'mes-prop',
  templateUrl: './prop.component.html',
  styleUrls: ['./prop.component.scss']
})
export class PropComponent implements OnInit {
  _para: any;
  _model: any;
  //prop model
  @Input()
  set model(value) {
    this._model = value;
    if(this._model.oid) {
      let para = _.cloneDeep(this.paras.find(item => item.oid === this._model.oid));
      if(para) {
        this.vs = para.value.valueStr.split(',');
      }
    }
  }

  @Input() tags: string[];
  @Input() pop: any;
  @Input() source: LocalDataSource;
  @Input() resource: any;
  @Input() buttonText: string;
  @Input() showQty: boolean;

  vs: string[];
  //显示重复的属性
  showSame: boolean = GlobalData.showSamePara;

  get paras(): IParameter[] {
    //两个tags 相减，长度为0， 不一定是一模一样的，但是第二个tags 完全 包含第一个tags
    //在完成了上述的过滤后，我们再把已经加入的属性过滤掉，不重复加入相同的属性
    let rnParas = GlobalData.paras.filter(item => _.difference(this.tags, item.tags).length === 0 );
    if(!this.showSame && this.resource && this.buttonText === UtilData.txtNew) {
      return rnParas.filter(item => this.resource.findIndex(p => p._id === item._id) < 0);
    }
    return rnParas;
  }

  cmpFn(w1: any, w2: any): boolean {
    return IDCmpFn(w1, w2);
  }

  constructor() { }

  ngOnInit() {
  }

  onOidChange(event): void {
    let para = _.cloneDeep(this.paras.find(item => item.oid === this._model.oid));
    this._model = Object.assign(this._model, para);
    this.vs = para.value.valueStr.split(',');
    if(this.vs.length > 0) {
      this._model.value.valueStr = '';
    }
  }

  onConfirm(): void {
    if(this.buttonText === UtilData.txtNew) {
      this.resource.push(this._model);
      this.source.load(this.resource);
      this.pop.toggle();;
    } else {
      this.source.update(this._model, this._model)
        .then(value => this.pop.toggle());
    }
  }

  /**
   * [当 显示已选属性 改变时，我们修改全局的 showSamePara ]
   * @param {[type]} event [description]
   */
  onShowSameChange(event): void {
    this.showSame = event;
    GlobalData.showSamePara = event;
  }

  onCancel(event): void {
    this.pop.hide();
  }
}
