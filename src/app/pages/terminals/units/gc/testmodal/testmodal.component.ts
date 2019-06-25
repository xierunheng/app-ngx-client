import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as moment from 'moment';

import { IMlot } from '../../../../../@core/model/mlot';
import { SmsService } from '../../../../../@core/data/sms.service';
import { PersonService } from '../../../../../@core/data/person.service';
import { ITestResult, IResult, TestResult, Result } from '../../../../../@core/model/common';
import { GCHelpComponent } from '../gc-help/gc-help.component';

@Component({
  selector: 'mes-testmodal',
  templateUrl: './testmodal.component.html',
  styleUrls: ['./testmodal.component.scss']
})
export class TestmodalComponent implements OnInit {

  mlot: IMlot;

  //强制填写
  compulsory: boolean = false;

  //检验的次数
  times: string[] = ['第1次', '第2次', '第3次', '第4次', '巡检'];

  //选择的检验次数
  desc: string;

  //环境录入
  env: any = {
    '配釉温度': {
      result: new Result(),
      range: '',
    },
    '配釉湿度': {
      result: new Result(),
      range: '',
    },
  };

  //参数录入   
  obj: any = {
    '配前釉比重': {
      result: new Result(),
      range: '',
    },
    '胶量配比': {
      result: new Result(),
      range: '',
    },
    '比重': {
      result: new Result(),
      range: '',
    },
    '流速': {
      result: new Result(),
      range: '',
    },
    'PH值': {
      result: new Result(),
      range: '',
    },
    '吸干速度': {
      result: new Result(),
      range: '',
    },
    '吸干厚度': {
      result: new Result(),
      range: '',
    },
    '储釉桶号': {
      result: new Result(),
      range: '',
    }
  };

  /**
   * [短信内容]
   * @type {string}
   */
  smsContent: string = '';

  /**
   * [简写]
   * @type {[type]}
   */
  objectKeys = Object.keys;

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private pService: PersonService,
    private smsService: SmsService) { }

  ngOnInit() {
    _.forOwn(this.env, (value, key) => {
      let prop = this.mlot.prop.find(item => item.oid === key);
      if (prop) {
        value.range = prop.value.valueStr;
        value.result.unit = prop.value.unit;
      }
    });

    _.forOwn(this.obj, (value, key) => {
      let prop = this.mlot.prop.find(item => item.oid === key);
      if (prop) {
        value.range = prop.value.valueStr;
        value.result.unit = prop.value.unit;
      }
    });

    this.compulsory = this.mlot.mdef.oid === '白色釉料';

    let pr = this.mlot.prop.find(item => item.oid === Object.keys(this.obj)[0]);
    if (pr) {
      pr.testResult.forEach(tr => _.pull(this.times, tr.desc));
    }
    console.log(this.obj);
  }

  /**
   * [当环境参数发生变化时]
   * 温度变化后，我们要根据的温度的高低，定义后面参数的范围值
   * @param {[type]} event [description]
   */
  onEnvChange(event) {
    let tempa = this.env['配釉温度'].result.valueStr;
    if (tempa) {
      let numTempa = Number(tempa);
      _.forOwn(this.obj, (value, key) => {
        let ranges = value.range.split(';');
        if (ranges.length > 1) {
          value.range = numTempa >= 28 ? ranges[1] : ranges[0];
        }
      });
    }
  }

  /**
   * [新增属性项，这些属性项都带有测试结果]
   * @param {IResult} result   [检验结果]
   * @param {string}  range    [检验值范围]
   * @param {string}  propName [检验项名称]
   * @param {boolean} send     [是否发送异常]
   */
  insertProp(result: IResult, range: string, propName: string, send: boolean = true): void {
    let ranges: number[] = range.split('-').map(item => Number(item));
    if (send) {
      result.key = ranges && ranges.length > 1 &&
        Number(result.valueStr) >= ranges[0] && Number(result.valueStr) <= ranges[1] ? 'OK' : 'NG';
      if (result.key === 'NG') {
        console.log(range);
        this.smsContent += `配釉${propName}异常:${result.valueStr}${result.unit}[${range}];`;
      }
    }
    let test: ITestResult = new TestResult();
    test.desc = this.desc;
    if (test.desc === '巡检') {
      test.desc += moment().format('YYMMDDHHmmss');
    }
    test.result.push(result);
    let prop = this.mlot.prop.find(p => p.oid === propName);
    if (prop) {
      test.oid = this.mlot.oid + prop.oid + prop.testResult.length.toString();
      prop.testResult.push(test);
    }
  }

  /**
   *  帮助说明
   */
  help() {
    this.modalService.open(GCHelpComponent,
      { size: 'lg', backdrop: 'static', container: 'nb-layout', windowClass: 'fullscreen-modal-dialog' }
    );
  }

  /**
   * [正常关闭Modal，返回对应的结果]
   */
  closeModal() {
    if (window.confirm('确认后，本次记录的数据不能再修改，是否继续？')) {
      _.forEach(this.obj, (value, key) => {
        this.insertProp(value.result, value.range, key);
      });
      _.forEach(this.env, (value, key) => {
        this.insertProp(value.result, value.range, key, false);
        if (this.smsContent) {
          this.smsContent = `${key}:${value.result.valueStr}${value.result.unit};` + this.smsContent;
        }
      });
      if (this.smsContent) {
        let txt = '管理员';
        this.pService.getPersonsEliteBy({name: {$regex: `^${txt}`}}).subscribe(ps => {
          let mobile = ps.map(item => item.mobile).join(',');
          this.smsService.send(mobile, this.smsContent).subscribe(res => {
            console.log(res);
          });
        })
      }
      this.activeModal.close(this.mlot);
    }
  }

  /**
  * [异常关闭Modal, dismiss 该Modal ]
  */
  dismissModal() {
    if (window.confirm('返回后，本次数据不会被记录，是否继续？')) {
      this.activeModal.dismiss();
    }
  }

}
