import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeviewItem } from 'ngx-treeview';

import { GlobalData } from '../../../../@core/model/global';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { IQuantity } from '../../../../@core/model/common';
import { IMOpLog } from '../../../../@core/model/base/oplog';
import { UtilData, WorkData, MaterialData, IDCmpFn } from '../../../../@core/data/util.service';
import { IJobOrder, JobOrder } from '.././../../../@core/model/job-order';
import { JobResponse } from '../../../../@core/model/job-response';
import { IParameter } from '../../../../@core/model/parameter';
import { IUser } from '../../../../@core/model/user';
import { IEquipmentElite } from '../../../../@core/model/equipment';
import { IMdefElite } from '../../../../@core/model/mdef';
import { EquipmentService } from '../../../../@core/data/equipment.service';
import { EsubService } from '../../../../@core/data/esub.service';
import { Terminal, IBodyOp, IBodyRecord, IJob } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { MclassService } from '../../../../@core/data/mclass.service';
import { QcimodalComponent } from './qcimodal/qcimodal.component';
import { WGModalComponent } from './wgmodal/wgmodal.component';
import { PsubService } from '../../../../@core/data/psub.service';

@Component({
  selector: 'mes-qc',
  templateUrl: './qc.component.html',
  styleUrls: ['../pad.scss', './qc.component.scss']
})
export class QCComponent implements OnInit {
  @Output() update = new EventEmitter<any>();
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

  //扫码操作的Model
  model: Terminal;

  //条码录入的方式，目前有‘扫码', '手动' 两种
  inputType: string = '扫码';

  inputTypes: string[] = ['扫码', '手动', '换码'];

  //有缺陷后的，修复类型
  repairType: string = '手工';

  //所有的修复类型
  repairTypes: string[] = ['手工', '机修1', '机修2'];

  //当前终端的状态，用于界面的呈现
  tState: string = UtilData.terminalStates[0];

  //上一次扫码的操作记录
  lastBodies: IBodyRecord[] = [];

  //新的条形码
  newBarcode: string;

  //扫码枪的扫码内容
  strBody: string;

  valueBuffer: string = '';

  idCmpFn = IDCmpFn;

  /**
   * [备选的仓库]
   * @param {[type]} item => item.path.includes('仓储部') [description]
   */
  locs: IHierarchyScope[] = GlobalData.hss.filter(item => item.name.includes('仓储部'));

  loc: IHierarchyScope;
  okLoc: IHierarchyScope;
  ngLoc: IHierarchyScope;
  reLoc: IHierarchyScope;

  /**
   * [质检的抽检项的抽检比例]
   * @param {[type]} item => item.tags.includes('检验项') [description]
   */

  checkRates: number[] = _.uniq(GlobalData.paras
    .filter(item => item.tags.includes('检验项') && item.active)
    .map(item => Number(item.value.valueStr))
  );

  /**
   * [窑炉下拉可选项]
   * @return {string[]} [description]
   */
  kilns: IEquipmentElite[];

  // tree of Mdef, with Mclass
  mtree: TreeviewItem[];

  //当前生产的各款坯体的统计数量
  mActCount: any[];

  //当前生产的总数
  mQty: IQuantity;

  //当前质检的各类缺陷数
  qcActCount: any[];

  //当前质检的缺陷总数
  qcQty: IQuantity;

  tabs: any[];
  /**
   * [缺陷分类]
   * @type {any[]}
   */
  tabs1: any[] = [
    {
      id: 'cy',
      title: '原材料',
      reasons: [],
    }, {
      id: 'cx',
      title: '成型',
      reasons: [],
    }, {
      id: 'xp',
      title: '修坯',
      reasons: [],
    }, {
      id: 'py',
      title: '喷釉',
      reasons: [],
    }, {
      id: 'gj',
      title: '刮脚',
      reasons: [],
    }, {
      id: 'dy',
      title: '登窑',
      reasons: [],
    }, {
      id: 'sc',
      title: '烧成',
      reasons: [],
    }, {
      id: 'qt',
      title: '其它',
      reasons: [],
    },
  ];

    /**
   * [缺陷分类]
   * @type {any[]}
   */
  tabs2: any[] = [
    {
      id: 'cx',
      title: '成型',
      reasons: [],
    }, {
      id: 'xp',
      title: '修坯',
      reasons: [],
    }, {
      id: 'py',
      title: '喷釉',
      reasons: [],
    }, {
      id: 'gj',
      title: '刮脚',
      reasons: [],
    }, {
      id: 'dy',
      title: '登窑',
      reasons: [],
    }, {
      id: 'sc',
      title: '烧成',
      reasons: [],
    }, {
      id: 'ck',
      title: '仓库',
      reasons: [],
    }, {
      id: 'qt',
      title: '其它',
      reasons: [],
    },
  ];

  /**
   * 质检项抽检出的问题
   * @type {IParameter[]}
   */
  checkDefects: IParameter[];

  /**
   * [已选缺陷项]
   */
  get defects() {
    let selDefects: IParameter[] = [];
    if (this.reasons) {
      selDefects = _.concat(selDefects, _.flatten(this.tabs.map(tab => tab.reasons)).filter(item => item.active === false));
    }
    if (this.checkDefects) {
      selDefects = _.concat(selDefects, this.checkDefects);
    }
    return selDefects;
  }

  reasons: IParameter[];

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

  get strQty() {
    return `${this.lastBodies.length}/${this.mQty ? this.mQty.quantity : 0}`;
  }

  /**
   * [手动 -> 扫码的 自动切换]
   * @type {true}
   */
  autoSwitch: boolean = true;

  /**
   * [上一次手动录入的物料信息]
   * @type {IMdefElite}
   */
  lastMdef: IMdefElite;

  @HostListener('document:keypress', ['$event'])
  keyboardInput(e: KeyboardEvent) {
    const char = String.fromCharCode(e.which);
    if (char === '\r' || char === '\n' || char === '\r\n') {
      this.lastMdef = this.model.msublot.mdef;
      //外协、外购的质检，需要沿用上一次使用的mdef
      //常规质检不需要沿用上次的mdef
      if (this.bodyOp.text !== 'wxqc' && this.bodyOp.text !== 'wgqc') {
        this.model.msublot.mdef = undefined;
      }
      this.clearDefects();
      if (this.inputType === '扫码') {
        this.strBody = this.valueBuffer;
        this.doCheck().then((msub) => {
          this.valueBuffer = '';
          this.doOP(this.strBody);
        },
          (reason) => {
            this.valueBuffer = '';
            this.doOP(this.strBody);
          });
      } else if (this.inputType === '手动') {
        this.doCheck().then((msub) => {
          this.valueBuffer = '';
          this.doOP(this.strBody);
        },
          (reason) => {
            this.valueBuffer = '';
            this.doOP(this.strBody);
          });
        if (this.autoSwitch) {
          this.inputType = '扫码';
        }
      } else if (this.inputType === '换码') {
        if (this.newBarcode) {
          this.valueBuffer = '';
          this.doOP(this.strBody);
          if (this.autoSwitch) {
            this.inputType = '扫码';
          }
        }
      }
    } else {
      this.valueBuffer += char;
    }
  }

  constructor(private service: MsubLotService,
    private modalService: NgbModal,
    private eService: EquipmentService,
    private esubService: EsubService,
    private mcService: MclassService,
    private psubService: PsubService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.bodyOp = MaterialData.BodyOps[this.user.op];
    if (this.bodyOp.text === 'pqc') {
        this.tabs = this.tabs2;
    }
    else this.tabs = this.tabs1;
  }

  ngOnInit() {
    this.reasons = GlobalData.paras.filter(item => item.tags.includes(UtilData.txtTags[20]));
    this.tabs.forEach(tab => {
      tab.reasons = this.reasons.filter(para => para.tags.includes(tab.title));
    });
    this.eService.getEquipmentsEliteBy({ 'eclass.oid': '窑炉' }).subscribe(es => {
      this.kilns = es;
      this.mcService.getMclasssBy({ oid: UtilData.txtProduct }).subscribe(mc => {
        this.mtree = this.mcService.newMTree(mc);
        this.model = Terminal.create(this.user);
        this.popupWGModal();
        this.aggrMdef();
      })
    })
  }

  /**
   * [为了 虚拟键盘 手动录入的方便，模拟键盘的 enter 事件]
   * @param {[type]} event [description]
   */
  onBodyBlur(event) {
    this.strBody = event.srcElement.value;
    const enterEvent: any = document.createEvent('CustomEvent');
    enterEvent.which = 13;
    enterEvent.initEvent('keypress', true, true);
    document.dispatchEvent(enterEvent);
  }

  /**
   * [根据需要，弹出外购的窗口，用于记录虚拟的 oplog]
   */
  popupWGModal() {
    if (this.bodyOp.text === 'wxqc' || this.bodyOp.text === 'wgqc') {
      const modal = this.modalService.open(WGModalComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      modal.componentInstance.op = this.bodyOp;
      modal.result.then((result) => {
        console.log(result);
        this.model.prodLog = result;
      }, (reason) => {
        console.log(reason);
      });
    }
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
        console.log(item);
        this.mActCount = _.toPairs(item.mCount);
        this.mQty = item.mQty;
        this.qcActCount = _.toPairs(item.qcCount);
        this.qcQty = item.qcQty;
      })
    }
  }

  /**
   * [当仓库位置发生变化时，我们及时做好不同类型loc的定位]
   * @param {[type]} event [description]
   */
  onLocChange(event) {
    event.srcElement.blur();
    this.okLoc = GlobalData.hss.find(item => item.name.includes('优等') && item.path.includes(this.loc.path + this.loc.name));
    this.ngLoc = GlobalData.hss.find(item => item.name.includes('等外') && item.path.includes(this.loc.path + this.loc.name));
    this.reLoc = GlobalData.hss.find(item => item.name.includes('待修复') && item.path.includes(this.loc.path + this.loc.name));
  }

  clearDefects(): void {
    this.reasons.forEach(reason => reason.active = true);
    this.checkDefects = [];
  }

  /**
   * [有缺陷，拒绝]
   * @param {[type]} event [description]
   */
  onQCReject(event): void {
    this.model.oplog.reason = this.defects;
    this.model.reinit(MaterialData.BodyOps.reject.text, this.defects);
    this.model.msublot.repairType = this.repairType;
    this.model.msublot.loc = this.reLoc;
    this.service.op(this.model.getElite(this.bodyOp.text)).subscribe(item => {
      this.model.reinit(this.bodyOp.text, []);
      this.tState = UtilData.terminalStates[0];
      this.clearDefects();
    });
    this.repairType = '手工';
  }

  /**
   * [等外品，通过]
   * @param {[type]} event [description]
   */
  onQCPass(event): void {
    this.model.oplog.reason = this.defects;
    this.model.reinit(MaterialData.BodyOps.pass.text, this.defects);
    //xl.yang 18.11.16 ↓
    console.log(this.repairType);
    if (this.repairType !== '手工') {
      this.model.msublot.repairType = this.repairType;
    }
    //xl.yang 18.11.16 ↑
    this.model.msublot.loc = this.ngLoc;
    this.service.op(this.model.getElite(this.bodyOp.text)).subscribe(item => {
      this.model.reinit(this.bodyOp.text, []);
      this.tState = UtilData.terminalStates[0];
      this.clearDefects();
    });
    this.repairType = '手工';
  }

  /**
   * [直接报废]
   * @param {[type]} event [description]
   */
  onQCScrap(event): void {
    this.model.oplog.reason = this.defects;
    this.model.reinit(MaterialData.BodyOps.scrap.text, this.defects);
    console.log(this.model);
    this.service.op(this.model.getElite(this.bodyOp.text)).subscribe(item => {
      this.model.reinit(this.bodyOp.text, []);
      this.tState = UtilData.terminalStates[0];
      this.clearDefects();
    })
  }

  /**
   * [质检项]
   */
  doCheck(): Promise<any> {
    let check: boolean = false;
    let length = this.lastBodies.length + 1;
    this.checkRates.forEach(rate => {
      if (rate && length % rate === 0) {
        check = true;
        return;
      }
    });
    // check = true;
    if (check) {
      const modal = this.modalService.open(QcimodalComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      modal.componentInstance.msublot = this.model.msublot;
      modal.componentInstance.length = length;
      return modal.result;
    }
    return Promise.resolve();
  }

  /**
   * [从错误跳转回来]
   * @param {[type]} event [description]
   */
  onErrBack(event) {
    this.clearDefects();
  }

  /**
 * [从修复跳转回来]
 * @param {[type]} event [description]
 */
  onRepairBack(event) {
    this.clearDefects();
  }

  /**
   * [从Warning跳转回来]
   * @param {[type]} event [description]
   */
  onWarningBack(event) {
    this.valueBuffer = '';
    this.doOP(this.strBody.trim());
  }

  doOP(oid: string) {
    this.model.msublot.oid = oid.trim();
    if (this.inputType === '换码') {
      //如果 旧条码 存在，启动 换码功能
      //如果 旧条码 不存在，启动 扫码 功能
      if (this.strBody) {
        this.model.msublot.usedOid = [];
        this.model.msublot.usedOid.push(this.newBarcode.trim());
        this.model.reinit(MaterialData.BodyOps.replace.text);
      } else {
        this.model.msublot.oid = this.newBarcode.trim();
      }
      this.service.op(this.model).subscribe(item => {
        this.model.reinit(this.bodyOp.text);
        this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
        if (this.tState === UtilData.terminalStates[0]) {
          this.lastBodies.push({
            str: oid.trim(),
            date: new Date()
          });
        }
      })
    } else {
      this.model.msublot.loc = this.okLoc;
      this.service.op(this.model).subscribe(item => {
        this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
        if (this.tState === UtilData.terminalStates[0]) {
          this.model.msublot = item;
          //用来存储新的prop；
          this.model.msublot.prop = [];
          this.mQty = item.mQty;
          this.lastBodies.push({
            str: oid.trim(),
            date: new Date()
          });
          //对样品做额外处理
          if (item.mdef && item.mdef.code === 'SAMP') {
            window.alert(`${item.oid} 为样品，请检出并额外处理。`);
          }
        } else if (this.tState !== UtilData.terminalStates[4]) {
          //对于有缺陷的成品，呈现已有的缺陷
          this.model.msublot = item.entity;
          if (this.model.msublot.reason && this.model.msublot.reason.length > 0) {
            this.reasons.forEach(reason => {
              reason.active = this.model.msublot.reason.findIndex(r => r._id === reason._id) < 0;
            })
          }
        }
      });
    }
  }

  /**
   * [窑炉内容发生变化]
   * @param {[type]} event [description]
   */
  onKilnModelChange(event): void {
    if (this.model.msublot && this.model.msublot._id) {
      if (window.confirm('是否更新窑炉信息？')) {
        this.model.msublot.kiln = event;
        this.service.updateKiln(this.model.msublot._id, this.model.msublot.kiln).subscribe(() => {
        });
      } else {
        this.model.msublot.kiln = Object.assign({}, this.model.msublot.kiln);
      }
    } else if (this.bodyOp.text === 'wxqc' || this.bodyOp.text === 'wgqc') {
      this.model.msublot.kiln = event;
    }
  }

  /**
   * [物料定义 ]
   * @param {[type]} event [description]
   */
  onMdefChange(event): void {
    console.log(event);
    this.valueBuffer = '';
    if (this.model.msublot && this.model.msublot._id) {
      if (window.confirm('是否更新物料信息？')) {
        this.model.msublot.mdef = event;
        this.service.updateMdef(this.model.msublot._id, this.model.msublot.mdef).subscribe(() => {
        });
      } else {
        this.model.msublot.mdef = Object.assign({}, this.model.msublot.mdef);
      }
    } else if (this.bodyOp.text === 'wxqc' || this.bodyOp.text === 'wgqc') {
      this.model.msublot.mdef = event;
      this.model.msublot.mdef = Object.assign({}, event);

    }
  }

  onRepairTypeChange(event): void {
    event.srcElement.blur();
  }
  /**
   * [当输入类型发生变化时，我们清空所有的内容]
   * @param {[type]} event [description]
   */
  onInputTypeChange(event) {
    this.valueBuffer = '';
    this.strBody = '';
    this.newBarcode = '';
    event.srcElement.blur();
  }

  /**
   * [当用户点击翻页按钮]
   */
  flipClick() {
    this.flipped = !this.flipped;
    this.aggrMdef();
  }
}
