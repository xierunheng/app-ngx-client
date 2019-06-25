import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';

import { GlobalData } from '../../../../@core/model/global';
import { IQuantity } from '../../../../@core/model/common';
import { UtilData, MaterialData, WorkData } from '../../../../@core/data/util.service';
import { IUser } from '../../../../@core/model/user';
import { IMdefElite } from '../../../../@core/model/mdef';
import { Terminal, IBodyOp, IBodyRecord } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { MdefService } from '../../../../@core/data/mdef.service';
import { PersonService } from '../../../../@core/data/person.service';
import { PsubService } from '../../../../@core/data/psub.service';
import { WorkAlertService } from '../../../../@core/data/work-alert.service';
import { WorkAlertDefService } from '../../../../@core/data/work-alert-def.service';
import { IWorkAlert, WorkAlert} from '../../../../@core/model/work-alert';
import { IWorkAlertDef} from '../../../../@core/model/work-alert-def';

@Component({
  selector: 'mes-molding',
  templateUrl: './molding.component.html',
  styleUrls: ['../pda.scss', './molding.component.scss']
})
export class MoldingComponent implements OnInit {
  @Output() update = new EventEmitter<any>();
  @Output() confirm = new EventEmitter<any>();
  @ViewChild('codeInput') codeInput: ElementRef;

  player: HTMLAudioElement = new Audio();

  //logo
  logo = UtilData.logo;
  //是否翻页
  flipped = false;

  //当前登陆的用户
  user: IUser;

  //当前登陆的工序所执行的坯体操作
  bodyOp: IBodyOp;

  //终端生产操作 model
  model: Terminal;

  //当前生产的各款坯体的统计数量
  mActCount: any[];

  //当前生产的总数
  mQty: IQuantity;

  //条码录入的方式，目前有‘扫码', '手动' 两种
  inputType: string = '扫码';

  //可选的录入类型
  inputTypes = {
    scan: {
      text: '扫码',
      desc: '扫码输入'
    },
    hand: {
      text: '手动',
      desc: '手动输入'
    },
    replace: {
      text: '换码',
      desc: '条码替换'
    },
    remold: {
      text: '换型',
      desc: '型号更换'
    },
    // dry: {
    //   text: '补漏',
    //   desc: '条码漏扫'
    // }
  };

  //数组，方便 html 使用
  inputTypesArr = _.values(this.inputTypes);

  priorities: any =  {
    '一般': 1,
    '中等': 2,
    '紧急': 3,
  };

  //缺条码的优先级
  priority: number =  1;

  //坯体型号的可选性
  mdefs: IMdefElite[];

  /**
   * [该成型工领用的模具]
   * @type {string[]}
   */
  molds: string[];

  //当前终端的状态，用于界面的呈现
  tState: string = UtilData.terminalStates[0];

  //上一次扫码的操作记录
  lastBodies: IBodyRecord[] = [];

  get strQty() {
    return `${this.lastBodies.length}/${this.mQty ? this.mQty.quantity : 0}`;
  }

  //新的条形码
  newBarcode: string;

  //扫码枪的扫码内容
  strBody: string;

  valueBuffer: string = '';

  /**
   * [简写]
   * @type {[type]}
   */
  objectKeys = Object.keys;

  @HostListener('document:keypress', ['$event'])
  keyboardInput(e: KeyboardEvent) {
    if (this.model && this.model.msublot && this.model.msublot.mdef) {
      const char = String.fromCharCode(e.which);
      if (char === '\r' || char === '\n' || char === '\r\n') {
        if (this.codeInput) {
          this.codeInput.nativeElement.focus();
        }
        if ((this.inputType === this.inputTypes.scan.text ||
          this.inputType === this.inputTypes.remold.text 
          // || this.inputType === this.inputTypes.dry.text
          ) && this.valueBuffer) {
          this.strBody = this.valueBuffer;
          this.doOP(this.strBody);
          this.valueBuffer = '';
        } else if ((this.inputType === this.inputTypes.hand.text ||
          this.inputType === this.inputTypes.remold.text 
          // || this.inputType === this.inputTypes.dry.text
          ) && this.strBody) {
          this.doOP(this.strBody);
        } else if (this.inputType === this.inputTypes.replace.text) {
          if (this.strBody && this.newBarcode) {
            this.doOP(this.strBody);
          }
        }
      } else {
        this.valueBuffer += char;
      }
    }
  }

  get stateClass(): string {
    let rnClass: string = '';
    switch (this.tState) {
      case 'run':
        rnClass = 'form-control-info';
        break;
      case 'qc':
        rnClass = 'form-control-warning';
        break;
      case 'sc':
        rnClass = 'form-control-hint';
        break;
      case 'err':
        rnClass = 'form-control-danger';
        break;
      default:
        break;
    }
    return rnClass;
  }

  constructor(private service: MsubLotService,
    private mdService: MdefService,
    private pService: PersonService,
    private waService: WorkAlertService,
    private wadService: WorkAlertDefService,
    private psubService: PsubService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.bodyOp = MaterialData.BodyOps[this.user.op];
  }

  ngOnInit() {
    this.pService.getDistinctMold(this.user.person._id).subscribe(molds => {
      this.mdService.getMdefsEliteBy({ 'mclass.oid': '坯体', 'assDefs.oid': { $in: molds } }).subscribe(mds => {
        this.mdefs = mds;
        this.model = Terminal.create(this.user);
        this.aggrMdef();
      })
    })
  }

  reload(): void {
    this.ngOnInit();
  }

  /**
   * [统计今天的作业数据]
   */
  aggrMdef(): void {
    if (this.model && this.model.psub) {
      this.psubService.aggrMdef(this.model.psub._id).subscribe(item => {
        this.mActCount = _.toPairs(item.mCount);
        this.mQty = item.mQty;
      })
    }
  }

  /**
   * [当成型工选择物料后，把物料属性赋值给物料子批次]
   * @param {[type]} event [description]
   */
  onMdefChange(event) {
    event.srcElement.blur();
    this.mdService.getMdef(this.model.msublot.mdef._id).subscribe(mdef => {
      this.model.msublot.prop = mdef.prop;
    })
  }

  /**
   * [当输入类型发生变化时，我们清空所有的内容]
   * @param {[type]} event [description]
   */
  onInputTypeChange(event) {
    event.srcElement.blur();
    this.valueBuffer = '';
    this.strBody = '';
    this.newBarcode = '';
  }

  doOP(oid: string) {
    this.model.msublot.oid = oid.trim();
    if (this.model.isTheMolder()) {
      switch (this.inputType) {
        case this.inputTypes.replace.text:
          this.model.msublot.usedOid = [];
          this.model.msublot.usedOid.push(this.newBarcode.trim());
          this.model.reinit(MaterialData.BodyOps.replace.text);
          break;
        case this.inputTypes.remold.text:
          this.model.reinit(MaterialData.BodyOps.remold.text);
          break;
        // case this.inputTypes.dry.text:
        //   this.model.reinit(MaterialData.BodyOps.dry.text);
        //   break;
        default:
          break;
      }
      this.service.op(this.model).subscribe(item => {
        this.model.reinit(this.bodyOp.text);
        this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
        if (this.tState === UtilData.terminalStates[0]) {
          this.mQty = item.mQty;
          this.lastBodies.push({
            str: oid.trim(),
            date: new Date()
          });

        }
      });
    } else {
      this.tState = this.model.judgeResult({
        type: UtilData.terminalErrs[2],
        entity: this.model.msublot.oid,
        message: '坯体条码与成型工编码不符!'
      }, this.bodyOp.state, this.bodyOp.text);
    }
  }

  /**
   * [成型工缺条码]
   * @param {[type]} event [description]
   */
  onLack(event): void {
    if(window.confirm('您即将通知系统打印条码，是否继续？')) {
      this.wadService.getWorkAlertDefBy({oid: '缺条码'}).subscribe(wadef => {
        let wa: WorkAlert = new WorkAlert();
        wa.DeriveFromDef(wadef);
        wa.person = this.user.person;
        wa.priority = this.priority;
        wa.messageText = `成型工：${this.user.person.oid}`;
        wa.formatOid();
        this.waService.createWorkAlert(wa).subscribe(a => {
          console.log(a);
        });
      })
    }
  }

  /**
   * [翻页]
   */
  flipClick() {
    this.flipped = !this.flipped;
    if (this.flipped) {
      this.aggrMdef();
    }
  }

}

