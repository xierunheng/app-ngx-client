import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';

import { GlobalData } from '../../../../@core/model/global';
import { UtilData, MaterialData, WorkData, IDCmpFn } from '../../../../@core/data/util.service';
import { IJobOrder, JobOrder } from '../../../../@core/model/job-order';
import { JobResponse } from '../../../../@core/model/job-response';
import { IUser } from '../../../../@core/model/user';
import { IEquipmentProfile, IEquipmentElite } from '../../../../@core/model/equipment';
import { EquipmentService } from '../../../../@core/data/equipment.service';
import { EsubService } from '../../../../@core/data/esub.service';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { Terminal, IBodyOp, IBodyRecord, IJob } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';

@Component({
  selector: 'terminal-job',
  templateUrl: './terminal-job.component.html',
  styleUrls: ['../pda.scss', './terminal-job.component.scss']
})
export class TerminalJobComponent implements OnInit {
  @Output() update = new EventEmitter<any>();
  @ViewChild('codeInput') codeInput: ElementRef;
  @ViewChild('f') form: ElementRef;

  //logo
  logo = UtilData.logo;
  //是否翻页
  flipped = false;

  player: HTMLAudioElement = new Audio();

  //当前登陆的用户
  user: IUser;

  //当前登陆的工序所执行的坯体操作
  bodyOp: IBodyOp;

  //终端生产操作 model
  model: Terminal;

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
    reglaze: {
      text: '换色',
      desc: '颜色更换'
    },
    unload: {
      text: '退出',
      desc: '退出登窑'
    }
  };

  /**
   * [不同的终端类型，有不同的inputTypes]
   */
  get inputTypesArr() {
    let arr = _.values(this.inputTypes);
    if (this.isPY) {
      arr = arr.slice(0, 4);
    } else if (this.isDY) {
      arr.splice(3, 1);
    } else {
      arr = arr.slice(0, 3);
    }
    return arr;
  }

  /**
   * [判断登录用户是否为 生产管理员，生产管理员可以对工单进行开工和完工等特殊操作]
   * @return {boolean} [description]
   */
  isManager: boolean;

  /**
   * [是否为组长,及以上权利]
   * @return {boolean} [description]
   */
  isTeamLeader: boolean;

  //当前终端的状态，用于界面的呈现
  tState: string = UtilData.terminalStates[0];

  buttonText: string = '开工';

  //提示信息
  tips: string = '';

  //待开工工单列表
  jos: IJobOrder[];

  //选择的工单
  jo: JobOrder;

  /**
   * [窑炉下拉可选项]
   * @return {string[]} [description]
   */
  kilns: IEquipmentProfile[];

  //上一次扫码的操作记录
  lastBodies: IBodyRecord[] = [];

  get strQty() {
    return `${this.lastBodies.length}/${this.model.jr ? this.model.jr.qty.quantity : 0}`;
  }

  //新的条形码
  newBarcode: string;

  //扫码枪的扫码内容
  strBody: string;

  //扫码枪录入的缓存
  valueBuffer: string = '';

  idCmpFn = IDCmpFn;

  @HostListener('document:keypress', ['$event'])
  keyboardInput(e: KeyboardEvent) {
    if (this.model.jr) {
      const char = String.fromCharCode(e.which);
      if (char === '\r' || char === '\n' || char === '\r\n') {
        if (this.codeInput) {
          this.codeInput.nativeElement.focus();
        }
        if ((this.inputType === this.inputTypes.scan.text ||
          this.inputType === this.inputTypes.unload.text ||
          this.inputType === this.inputTypes.reglaze.text) && this.valueBuffer) {
          this.strBody = this.valueBuffer;
          this.doOP(this.strBody);
          this.valueBuffer = '';
        } else if (this.inputType === this.inputTypes.hand.text && this.strBody) {
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

  /**
   * [喷釉工序]
   * @return {boolean} [description]
   */
  get isPY(): boolean {
    return this.user && this.user.op === MaterialData.BodyOps.glaze.text;
  }

  /**
   * [登窑工序]
   * @return {boolean} [description]
   */
  get isDY(): boolean {
    return this.user && this.user.op === MaterialData.BodyOps.load.text;
  }

  /**
   * [颜色可选项]
   */
  get colors(): string[] {
    return GlobalData.paras.find(para => para.oid === '颜色').value.valueStr.split(',').map(item => item.trim());
  }

  /**
   * [工单执行的每一款物料具体的进度]
   * @return {any[]} [description]
   */
  pvs: any[];

  constructor(private service: MsubLotService,
    private joService: JobOrderService,
    private jrService: JobResponseService,
    private eService: EquipmentService,
    private esubService: EsubService,
    private elementRef: ElementRef) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.bodyOp = MaterialData.BodyOps[this.user.op];
    this.isManager = this.user.role === UtilData.txtSuper || (this.user.role === UtilData.txtManager &&
      (this.user.person.name.startsWith(this.bodyOp.name) || this.user.person.name.startsWith('管理员')));
    this.isTeamLeader = this.isManager || this.user.role.includes(UtilData.txtTeamLeader);
    //如果时生产管理员登陆了交坯的终端，表示要执行管理员交坯的操作
    console.log(this.isManager);
    if(this.isManager && this.user.op === MaterialData.BodyOps.trim.text) {
      this.bodyOp = MaterialData.BodyOps['mgtrim'];
    }
    console.log(this.bodyOp);
  }

  ngOnInit() {
    if (this.isDY) {
      this.eService.getEquipmentsProfileBy({ 'eclass.oid': '窑炉', 'hs._id': this.user.hs._id }).subscribe(es => {
        this.kilns = es;
        this.initModel();
      })
    } else {
      this.initModel();
    }
  }

  /**
   * [重新加载页面数据，不是刷新页面]
   */
  reload(): void {
    let preColor = this.model.color;
    let preEquip = this.model.esub ? this.model.esub.equipment : undefined;
    this.initModel(preColor, preEquip);
  }

  /**
   * [通过获取的job，分析当前各个物料 的进度]
   * @param {any} job [description]
   */
  calcPvs(job: any): void {
    if (job && job.jom) {
      //只获取Produced，如果 没有 Produced，获取全部
      let destMReq = job.jom.filter(m => m.use === MaterialData.useTypes[1]);
      if(destMReq.length < 1) {
        destMReq = job.jom;
      }
      this.pvs = destMReq.map(mr => {
        let ma = job.jrm && job.jrm.find(m => m.oid === mr.oid);
        mr.acount = ma ? ma.acount : 0;
        return mr;
      });
      //在某些特殊情况下，例如：登窑时不是以mreq为依据的；包装时，有可能名称不同，也不以mreq为主
      //以mact为主
      job.jrm.forEach(m => {
        if(destMReq.findIndex(item => item.oid === m.oid) < 0) {
          m.count = 0;
          this.pvs.push(m);
        }
      });
    }
  }

  /**
   * [从数据库中获取在运行的工单，如果没有在运行的工单，把所有待开工的工单都获取过来，
   * 供终端选择待开工的工单]
   */
  initModel(color: string = '', equip: IEquipmentElite = undefined): void {
    //可以执行本工位工单，也可以执行父层级工位的工单
    let parentHs = _.last(this.user.hs.path.split(',').filter(item => item));
    this.jrService.getJobProfileBy({
      $or: [{ 'hs.name': this.user.hs.name },
      { 'hs.name': parentHs }],
      // 'directive.proseg.oid': this.bodyOp.name,
      'directive.proseg.oid': MaterialData.BodyOps[this.user.op].name,
      'state': WorkData.WorkStates.Running.text
    }).subscribe((job: IJob) => {
      this.model = Terminal.create(this.user, job);
      //喷釉，默认赋予它白色
      if (this.isPY) {
        if (color) {
          this.model.color = color;
        } else {
          this.model.color = this.colors && this.colors.length > 0 ? this.colors[0] : '';
        }
      } else if (this.isDY) {
        //通过hs得知窑炉的信息，自动赋值到model.kiln
        //通过model.kiln，获取对应esub
        //esub 是真正有意义的object
        this.model.kiln = this.kilns.find(kiln => kiln.hs.name === this.user.hs.name);
        if (this.model.kiln) {
          this.esubService.createEsubBy(this.model.kiln).subscribe(esub => {
            this.model.esub = esub;
          });
        }
      }
      if (job.jr) {
        this.jo = new JobOrder(job.jo);
        this.buttonText = '完工';
        this.tips = '';
      } else if (job.jos && job.jos.length > 0) {
        this.jos = job.jos;
        let selJo = this.jos.find(jo => moment().isSame(jo.startTime, 'day'));
        if (!selJo) {
          this.tips = '该工位今日没有待开工工单!';
          selJo = this.jos[0];
        }
        this.jo = new JobOrder(selJo);
      } else {
        this.tips = '该工位没有待开工工单, 请核实!';
      }
    });
  }

  /**
   * [执行条码的扫码操作]
   * @param {string} oid [description]
   */
  doOP(oid: string) {
    this.model.msublot.oid = oid.trim();
    switch (this.inputType) {
      case this.inputTypes.replace.text:
        this.model.msublot.usedOid = [];
        this.model.msublot.usedOid.push(this.newBarcode.trim());
        this.model.reinit(MaterialData.BodyOps.replace.text);
        break;
      case this.inputTypes.unload.text:
        this.model.reinit(MaterialData.BodyOps.unload.text);
        break;
      case this.inputTypes.reglaze.text:
        this.model.reinit(MaterialData.BodyOps.reglaze.text);
        break;
      default:
        break;
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

  /**
   * [登窑完毕]
   * @param {[type]} event [description]
   */
  onLoadComplete(event) {
    event.srcElement.blur();
    if(this.form) {
      if (window.confirm(`[${this.model.esub.equipment.name}]登窑即将完毕，是否继续？`)) {
        this.esubService.setupEsub(this.model.esub._id).subscribe(esub => {
          this.reload();
          window.confirm(`[${this.model.esub.equipment.name}]登窑完毕！`);
        })
      }
    }
  }

  /**
   * [当工单选择发生变化后，执行相关的操作]
   * @param {[type]} jo [description]
   */
  onJOSelect(item): void {
    this.jo = new JobOrder(item);
  }

  /**
   * [工单操作]
   * @param {[type]} event [description]
   */
  onJOClick(event): void {
    //开工按钮按下后，立即失去焦点
    event.srcElement.blur();
    if (this.buttonText === '开工') {
      if (window.confirm(`即将开工 '${this.jo.oid}', 是否继续?`)) {
        //仅仅是 为了传递 jo
        this.model.jr = new JobResponse();
        this.model.jr.jobOrder = this.jo;
        this.joService.do(this.model, WorkData.commands[0]).subscribe(job => {
          this.model.jr = job.jr;
          this.buttonText = '完工';
          this.tips = '';
        });
      }
    } else if (this.buttonText === '完工') {
      if (window.confirm(`即将完工 '${this.jo.oid}', 是否继续?`)) {
        if (this.model.jr.qty.quantity > this.jo.qty.quantity) {
          this.joService.do(this.model, WorkData.commands[1]).subscribe(item => {
            this.model.jr = undefined;
            this.jo = undefined;
            this.initModel();
            this.buttonText = '开工';
          })
        } else {
          if (window.confirm(`本工单计划完成数量：${this.jo.qty.quantity}${this.jo.qty.unit};
本工单实际完成数量：${this.model.jr.qty.quantity}${this.model.jr.qty.unit},
未满足计划数量，是否继续？`)) {
            this.joService.do(this.model, WorkData.commands[1]).subscribe(item => {
              this.model.jr = undefined;
              this.jo = undefined;
              this.initModel();
              this.buttonText = '开工';
            })
          }
        }
      }
    }
  }

  /**
   * [颜色选中后，连失去焦点，激活扫码设备]
   * @param {[type]} event [description]
   */
  colorChange(event): void {
    event.srcElement.blur();
  }

  /**
   * [窑炉选中后，连失去焦点，激活扫码设备]
   * 当用户主动选择窑炉后，要立即切换esub，这个esub是关键
   * @param {[type]} event [description]
   */
  equipChange(event): void {
    event.srcElement.blur();
    this.esubService.createEsubBy(this.model.kiln).subscribe(esub => {
      this.model.esub = esub;
    });
  }

  /**
   * [当用户点击翻页按钮]
   */
  flipClick() {
    this.flipped = !this.flipped;
    if (this.flipped && this.model.jr) {
      this.jrService.getJobMCount(this.model.jr.oid).subscribe(job => {
        this.calcPvs(job);
      });

    }
  }
}
