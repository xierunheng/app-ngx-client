import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';

import { GlobalData } from '../../../../@core/model/global';
import { IElite, Elite } from '../../../../@core/model/common';
import { IHierarchyScope } from '../../../../@core/model/hs';
import { UtilData, WorkData, MaterialData } from '../../../../@core/data/util.service';
import { IJobOrder, JobOrder } from '../../../../@core/model/job-order';
import { JobResponse } from '../../../../@core/model/job-response';
import { IUser } from '../../../../@core/model/user';
import { IOrder } from '../../../../@core/model/order';
import { OrderService } from '../../../../@core/data/order.service';
import { JobOrderService } from '../../../../@core/data/job-order.service';
import { JobResponseService } from '../../../../@core/data/job-response.service';
import { Terminal, IBodyOp, IBodyRecord, IJob, IJobCmd } from '../../../../@core/model/terminal';
import { MsubLotService } from '../../../../@core/data/msublot.service';
import { MsubLot } from '../../../../@core/model/msublot';

@Component({
  selector: 'mes-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['../pad.scss', './packing.component.scss']
})
export class PackingComponent implements OnInit {
  @Output() update = new EventEmitter<any>();

  //logo
  logo = UtilData.logo;
  //是否翻页
  flipped = false;

  player: HTMLAudioElement = new Audio();

  //当前登陆的用户
  user: IUser;

  //当前登陆的工序所执行的坯体操作
  //可根据 inputType 的变化，转换 bodyOp
  bodyOp: IBodyOp;

  //当前选择的工单的可执行操作
  jobCmd: IJobCmd = WorkData.JobCmds.start;

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
    unpack: {
      text: '退包',
      desc: '退出包装'
    },
    unpalletize: {
      text: '退托',
      desc: '退出打托'
    }
  };

  /**
    * [不同的终端类型，有不同的inputTypes]
    */
  get inputTypesArr() {
    let arr = _.values(this.inputTypes);
    if (this.user.op === MaterialData.BodyOps.pack.text) {
      arr = arr.slice(0, 4);
    } else if (this.user.op === MaterialData.BodyOps.palletize.text) {
      arr.splice(3, 1);
    } else {
      arr = arr.slice(0, 3);
    }
    return arr;
  }

  //当前终端的状态，用于界面的呈现
  tState: string = UtilData.terminalStates[0];

  //提示信息
  tips: string = '';

  //待开工工单列表
  jos: IJobOrder[];

  //选择的工单
  jo: JobOrder;

  /**
   * [订单信息]
   * @type {IOrder}
   */
  order: IOrder;

  //上一次扫码的操作记录
  lastBodies: IBodyRecord[] = [];

  //上一次扫码的包材记录
  lastCarriers: IBodyRecord[] = [];

  //手动录入的包装件内容
  strBody: string = '';

  //手动录入的待包装件内容
  strItem: string = '';

  assSubLot: IElite[] = [];

  valueBuffer: string = '';

  //新的条形码
  newBarcode: string;

  //出货的loc，由于暂时没有客户信息，只能创建一个假的
  //后续有客户信息后，创建真实的虚拟仓
  truckLoc: IHierarchyScope = GlobalData.hss.find(item => item.name === '999#虚拟仓');

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = { 
    singleSelection: false, 
    text:"选择成品型号",
    selectAllText:'全选',
    unSelectAllText:'反选',
    enableSearchFilter: false,
    classes:"myclass custom-class",
    labelKey:'id',
    maxHeight:150,
    position:'top'
  };

  /**
   * [获取待包装项的显示字符串]
   * @return {string} [description]
   */
  get strItems(): string {
    return this.assSubLot && this.assSubLot.length > 0 ?
      this.assSubLot.map(item => item.oid).join('\r\n') : '';
  }

  /**
   * [获取正在包装的数量呈现]
   */
  get strCount() {
    if (this.bodyOp.name === '包装' || this.bodyOp.name === '退包') {
      return this.assSubLot.length || 0;
    } else if (this.bodyOp.name === '打托' || this.bodyOp.name === '退托' || this.bodyOp.name === '装车') {
      let packCount = 0;
      let bodyCount = 0;
      if (this.assSubLot && this.assSubLot.length > 0) {
        this.assSubLot.forEach(item => {
          if (item.oid.startsWith('98')) {
            packCount += 1;
          } else {
            bodyCount += 1;
          }
        });
      }
      return bodyCount + '/' + packCount;
    }
  }

  @HostListener('document:keypress', ['$event'])
  keyboardInput(e: KeyboardEvent) {
    // if (this.model.jr) {
    const char = String.fromCharCode(e.which);
    if (char === '\r' || char === '\n' || char === '\r\n') {
      if (this.inputType === this.inputTypes.scan.text ||
        this.inputType === this.inputTypes.unpack.text ||
        this.inputType === this.inputTypes.unpalletize.text) {
        this.doOP(this.valueBuffer);
        this.valueBuffer = '';
      } else if (this.inputType === this.inputTypes.hand.text) {
        if (this.strBody) {
          this.doOP(this.strBody);
        } else if (this.strItem) {
          this.doOP(this.strItem);
        }
      } else if (this.inputType === this.inputTypes.replace.text) {
        if (this.strItem && this.strBody) {
          this.doOP(this.strItem);
        }
      }
    } else {
      this.valueBuffer += char;
    }
    // }
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

  //包装工序的类型
  packingtypes: string[] = ['装箱', '装拖', '装柜', '拆箱', '拆拖', '拆柜'];

  //当前包装类型
  packingtype: string;

  /**
   * [当前工单的进度显示状态]
   */
  get showStatus(): string {
    return WorkData.WorkStates['Running'].status;
  }

  /**
   * [工单执行的每一款物料具体的进度]
   * @return {any[]} [description]
   {
    oid: **
    acount: **
    count: **
   }
   */
  pvs: any[];

  currPv: any;

  /**
  * [通过获取的job，计算 当前各个物料 的进度]
  * @param {any} job [description]
  */
  calcPvs(job: any): void {
    if (job && job.jom) {
      //只获取Produced，如果 没有 Produced，获取全部
      let destMReq = job.jom.filter(m => m.use === MaterialData.useTypes[1]);
      if (destMReq.length < 1) {
        destMReq = job.jom;
      }
      this.dropdownList = _.map(destMReq,i => {
        return {id: i.oid};
      });
      let destMAct = job.jrm.filter(m => m.use === MaterialData.useTypes[1]);
      if(destMAct.length < 1) {
        destMAct = job.jrm;
      }
      //判断包装是否已完成
      let isCompleted = (destMReq.length > 0) && (destMAct.length > 0);
      //以mreq为主，基本上mact有的，mreq都应该有，
      this.pvs = destMReq.map(mr => {
        let ma = destMAct.find(m => m.oid === mr.oid);
        mr.acount = ma ? ma.acount : 0;
        //如果每一款成品都满足要求，该工单可以完工
        isCompleted = isCompleted && (mr.acount >= mr.count);
        return mr;
      });
      //如果工单已包装完成，主动提示完工
      if(isCompleted && this.bodyOp.text === MaterialData.BodyOps.pack.text) {
        this.jobCmd = WorkData.JobCmds['complete'];
        this.onJOClick(null);
      }
      //在某些特殊情况下，例如：登窑时不是以mreq为依据的；包装时，有可能名称不同，也不以mreq为主
      //以mact为主
      destMAct.forEach(m => {
        if(destMReq.findIndex(item => item.oid === m.oid) < 0) {
          m.count = 0;
          this.pvs.push(m);
        }
      });
      let mrCount = destMReq.map(item => item.count).reduce((prev, curr) => prev + curr);
      let maCount = destMAct.map(item => item.acount).reduce((prev, curr) => prev + curr);
      if(maCount > mrCount) {
        this.jobCmd = WorkData.JobCmds['complete'];
      }
    }
  }

  /**
   * [当前工单是否在运行]
   * @return {boolean} [description]
   */
  get isRunning(): boolean {
    return this.jo && this.jo.jobResponse && this.jo.jobResponse.state === WorkData.WorkStates.Running.text;
  }


  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: MsubLotService,
    private oService: OrderService,
    private joService: JobOrderService,
    private jrService: JobResponseService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.bodyOp = MaterialData.BodyOps[this.user.op];
  }

  /**
   * [通过barcode的前两位是否存在相应的hs‘code，
   * 判断该barcode是否合理]
   * @param  {string}  bc [description]
   * @return {boolean}    [description]
   */
  isValidBarcode(bc: string): boolean {
    return true;
  }

  ngOnInit() {
    this.initModel();
  }

  /**
   * [重新初始化界面]
   */
  reinitUI(): void {
    this.valueBuffer = '';
    this.strBody = '';
    this.strItem = '';
  }

  /**
   * [从新加载界面]
   */
  reloadUI(): void {
    this.reinitUI();
    this.initModel();
  }
  /**
   * [当输入类型发生变化时，我们清空所有的内容]
   * @param {[type]} event [description]
   */
  onInputTypeChange(event) {
    if (this.inputType === MaterialData.BodyOps.unpack.name) {
      this.bodyOp = MaterialData.BodyOps.unpack;
    } else if (this.inputType === MaterialData.BodyOps.unpalletize.name) {
      this.bodyOp = MaterialData.BodyOps.unpalletize;
    } else {
      this.bodyOp = MaterialData.BodyOps[this.user.op];
    }
    this.model.reinit(this.bodyOp.text);
    event.srcElement.blur();
    this.reinitUI();
  }

  /**
   * [从数据库中获取在运行的工单，如果没有在运行的工单，把所有待开工的工单都获取过来，
   * 供终端选择待开工的工单]
   */
  initModel(): void {
    this.joService.getJobOrdersBy({
      'hs.name': this.user.hs.name,
      'master.proseg.oid': MaterialData.BodyOps.pack.name,
      'jobResponse.state': { $in: [WorkData.WorkStates.Ready.text, WorkData.WorkStates.Held.text, WorkData.WorkStates.Running.text] }
    }).subscribe(jos => {
      this.jos = jos;
      this.model = Terminal.create(this.user);
      console.log(this.model.packingMcount, this.model.packingMreq);
      //如果有正在运行的工单，就用这个工单直接赋值初始化，
      //否则，不用工单初始化
      // let rJo = jos.find(jo => jo.jobResponse.state === WorkData.WorkStates.Running.text);
      // if (rJo) {
      //   this.jo = new JobOrder(rJo);
      //   this.jrService.getJobProfileBy({ oid: this.jo.oid }).subscribe((jobOrder: IJob) => {
      //     if (jobOrder.jo && jobOrder.jo.command) {
      //       let post = WorkData.JobCmds[jobOrder.jo.command].post;
      //       this.jobCmd = WorkData.JobCmds[post];
      //     }
      //     this.model = Terminal.create(this.user, jobOrder);
      //     this.model.msublot.order = this.jo.order;
      //     this.oService.getOrder(this.jo.order._id).subscribe(order => {
      //       this.order = order;
      //     });
      //     this.jrService.getJobMCount(this.model.jr.oid).subscribe(jobOrder => {
      //       this.calcPvs(jobOrder);
      //     });
      //   });
      // } else {
      //   this.model = Terminal.create(this.user);
      // }
    });
  }

  doOP(oid: string) {
    this.model.msublot.oid = oid.trim();
    switch (this.inputType) {
      case this.inputTypes.replace.text:
        this.model.msublot.usedOid = [];
        this.model.msublot.usedOid.push(this.strBody.trim());
        this.model.reinit(MaterialData.BodyOps.replace.text);
        break;
      default:
        break;
    }
    switch (this.bodyOp.name) {
      case "包装":
        //纸箱和成品条码都可以换  有个问题是：纸箱换码后其里面的成品的carton是否要更新？
        if (this.inputType === '换码') {
          this.service.op(this.model).subscribe(item => {
            this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
            if (this.tState === UtilData.terminalStates[0]) {
              this.strItem = '';
              this.strBody = '';
              this.inputType = '扫码';
              // this.lastBodies.push({
              //   str: oid.trim(),
              //   date: new Date()
              // });
            }
          });
        } else {
          if (oid.startsWith('98')) {
            this.strBody = oid;
            this.model.msublot.assSubLot = this.assSubLot;
            this.service.op(this.model).subscribe(item => {
              this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
              if (this.tState === UtilData.terminalStates[0]) {
                this.jrService.getJobMCount(this.model.jr.oid).subscribe(job => {
                  this.calcPvs(job);
                  this.strItem = '';
                  this.assSubLot = [];
                  this.model.msublot.assSubLot = [];
                  this.strBody = '';
                  this.lastCarriers.push({
                    str: oid.trim(),
                    date: new Date()
                  });
                });
              }
            });
          } else if (!oid.startsWith('99')) {
            this.strItem = oid;
            this.model.msublot.assSubLot = this.assSubLot;
            this.service.op(this.model).subscribe(item => {
              this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
              if (this.tState === UtilData.terminalStates[0]) {
                // console.log(this.pvs);
                let pv = this.pvs.find(pv => pv.oid === item.mdef.oid);
                if (pv) {
                  pv.acount = Number(pv.acount) + 1;
                  this.currPv = pv;
                  // console.log(this.currPv);
                }
                this.assSubLot.push(new Elite(item));
                this.lastBodies.push({
                  str: oid.trim(),
                  date: new Date()
                });
              }
            })
          } else {
            window.alert('包装工序只允许扫描成品、纸箱条码！');
          }
        }
        break;
      case "退包":
        if (oid.startsWith('98') && oid.startsWith('99')) {
          window.alert('退包只允许扫码 成品条码！');
        } else {
          this.strItem = oid;
          this.service.op(this.model).subscribe(item => {
            this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
            if (this.tState === UtilData.terminalStates[0]) {
              console.log(this.model.jr.oid);
              this.jrService.getJobMCount(this.model.jr.oid).subscribe(job => {
                let pv = this.pvs.find(pv => pv.oid === item.mdef.oid);
                if (pv) {
                  pv.acount = Number(pv.acount) - 1;
                  this.currPv = pv;
                }
                if (item.assSubLot && item.assSubLot.length > 0) {
                  item.assSubLot.forEach(ass => _.remove(this.assSubLot, item => item.oid === ass.oid));
                }
                _.remove(this.assSubLot, i => item.oid === i.oid);
              })
            }
          })
        }
        break;
      case "打托":
        //纸箱和托盘条码都可以换  有个问题是：纸箱换码后其里面的成品的carton是否要更新？托盘换码后其里面的纸箱的pallet是否要更新?
        if (this.inputType === '换码') {
          this.service.op(this.model).subscribe(item => {
            this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
            if (this.tState === UtilData.terminalStates[0]) {
              this.strItem = '';
              this.strBody = '';
              this.inputType = '扫码';
              // this.lastBodies.push({
              //   str: oid.trim(),
              //   date: new Date()
              // });
            }
          });
        } else {
          if (oid.startsWith('99')) {
            this.strBody = oid;
            this.model.msublot.assSubLot = this.assSubLot;
            this.service.op(this.model).subscribe(item => {
              this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
              if (this.tState === UtilData.terminalStates[0]) {
                this.strItem = '';
                this.assSubLot = [];
                this.model.msublot.assSubLot = [];
                this.strBody = '';
                this.lastBodies.push({
                  str: oid.trim(),
                  date: new Date()
                });
              }
            });
          } else if (oid.startsWith('98')) {
            this.strItem = oid;
            if (this.assSubLot.length > 0) {
              //如果已经扫了纸箱的条码，之前扫码的纸箱作为后续扫码纸箱的验证。
              //需要保证后续扫码的纸箱与之前扫码的纸箱是同一个的工单或者同一个订单的
              this.service.op(this.model).subscribe(item => {
                // if (condition) {
                //   // code...
                // }
                this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
                if (this.tState === UtilData.terminalStates[0]) {
                  this.assSubLot.push(new Elite(item));
                  if (item.assSubLot && item.assSubLot.length > 0) {
                    item.assSubLot.forEach(ass => this.assSubLot.push(ass));
                  }
                  this.lastBodies.push({
                    str: oid.trim(),
                    date: new Date()
                  });
                }
              })

            } else {
              //如果之前没有扫纸箱条码，或者之前的已完成打托，
              //需要从server中获取当前纸箱的工单信息和订单信息
              this.model.order = undefined;
              this.service.op(this.model).subscribe(item => {
                if (item && item.type === 'orderConfirm') {
                  if(confirm('是否开始订单：' +  _.last(_.filter(item.entity.oplog, i => i.op === 'pack')).jr.oid + '的打托？')) {
                    let jrOid = _.last(_.filter(item.entity.oplog, i => i.op === 'pack')).jr.oid;
                    this.jrService.getJobProfileBy({ oid: jrOid }).subscribe((job: IJob) => {
                      this.jo = new JobOrder(job.jo);
                      this.model = Terminal.create(this.user, job);
                      this.model.msublot.order = this.jo.order;
                      //打托第一次扫纸箱条码时，赋值验证订单信息
                      this.model.order = this.jo.order;
                      this.oService.getOrder(job.jo.order._id).subscribe(order => {
                        this.order = order;
                      });
                      this.jrService.getJobMCount(this.model.jr.oid).subscribe(jobm => {
                        this.calcPvs(jobm);
                      });
                      this.model.msublot.oid = oid.trim();
                      this.service.op(this.model).subscribe(m => {
                        this.assSubLot.push(new Elite(m));
                        if (m.assSubLot && m.assSubLot.length > 0) {
                          m.assSubLot.forEach(ass => this.assSubLot.push(ass));
                        }
                        this.lastBodies.push({
                          str: oid.trim(),
                          date: new Date()
                        });
                      });
                    });
                  }
                } else {
                  this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
                }

                // console.log(item);
                // let msublot = new MsubLot(item);
                // // let oid = _.last(_.filter(msublot.oplog, item => item.op === 'pack')).jr.oid;
                // this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
                // if (this.tState === UtilData.terminalStates[0]) {
                //   let oid = _.last(_.filter(msublot.oplog, item => item.op === 'pack')).jr.oid;
                //   if (!this.order || (oid && oid !== this.order.oid)) {
                //     this.jrService.getJobProfileBy({ oid: oid }).subscribe((jobOrder: IJob) => {
                //       this.jo = new JobOrder(jobOrder.jo);
                //       this.model = Terminal.create(this.user, jobOrder);
                //       this.model.msublot.order = this.jo.order;
                //       //打托第一次扫纸箱条码时，赋值验证订单信息
                //       this.model.order = this.jo.order;
                //       this.oService.getOrder(jobOrder.jo.order._id).subscribe(order => {
                //         this.order = order;
                //       });
                //       this.jrService.getJobMCount(this.model.jr.oid).subscribe(jobm => {
                //         this.calcPvs(jobm);
                //       });
                //     })
                //   }
                //   this.assSubLot.push(new Elite(item));
                //   if (item.assSubLot && item.assSubLot.length > 0) {
                //     item.assSubLot.forEach(ass => this.assSubLot.push(ass));
                //   }
                //   this.lastBodies.push({
                //     str: oid.trim(),
                //     date: new Date()
                //   });
                // }
              })
            }
          } else {
            window.alert("打托工序只允许扫描纸箱条码和托盘条码！");
          }
        }
        break;
      case "退托":
        if (oid.startsWith('98')) {
          this.strItem = oid;
          this.service.op(this.model).subscribe(item => {
            this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
            if (this.tState === UtilData.terminalStates[0]) {
              this.jrService.getJobMCount(this.model.jr.oid).subscribe(job => {
                this.calcPvs(job);
                if (item.assSubLot && item.assSubLot.length > 0) {
                  item.assSubLot.forEach(ass => _.remove(this.assSubLot, item => item.oid === ass.oid));
                }
                _.remove(this.assSubLot, i => item.oid === i.oid);
              });
            }
          })
        } else {
          window.alert('退托只允许扫描纸箱条码！');
        }
        break;
      case "装车":
        this.model.msublot.loc = this.truckLoc;
        this.strItem = oid;
        this.service.op(this.model).subscribe(item => {
          this.tState = this.model.judgeResult(item, this.bodyOp.state, this.bodyOp.text);
          if (this.tState === UtilData.terminalStates[0]) {
            this.assSubLot.push(new Elite(item));
            if (item.assSubLot && item.assSubLot.length > 0) {
              item.assSubLot.forEach(ass => this.assSubLot.push(ass));
            }
            this.lastBodies.push({
              str: oid.trim(),
              date: new Date()
            });
          }
          if (oid.trim().startsWith('99')) {
            this.router.navigate(['/prints/tplabel/', item._id], { relativeTo: this.route });
          }
        })
        break;
      default:
        // code...
        break;
    }
  }

  /**
   * [当工单选择发生变化后，执行相关的操作]
   * @param {[type]} jo [description]
   */
  onJOSelect(item): void {
    this.reinitUI();
    this.jo = new JobOrder(item);
    this.dropdownList = [];
    this.selectedItems = [];
    this.jrService.getJobProfileBy({ oid: this.jo.oid }).subscribe((job: IJob) => {
      if (job.jo && job.jo.command) {
        let post = WorkData.JobCmds[job.jo.command].post;
        this.jobCmd = WorkData.JobCmds[post];
      }
      this.model = Terminal.create(this.user, job);
      this.model.msublot.order = this.jo.order;
      this.oService.getOrder(this.jo.order._id).subscribe(order => {
        this.order = order;
      });
      this.jrService.getJobMCount(this.model.jr.oid).subscribe(job => {
        this.calcPvs(job);
      });
    });
  }

  /**
   * [工单操作 ]
   * @param {[type]} event [description]
   */
  onJOClick(event): void {
    //开工按钮按下后，立即失去焦点
    event.srcElement.blur();
    if (window.confirm(`即将${this.jobCmd.name}[${this.jo.oid}], 是否继续?`)) {
      switch (this.jobCmd.text) {
        case WorkData.JobCmds.start.text:
          this.model.jr = new JobResponse();
          this.model.jr.jobOrder = this.jo;
          this.joService.do(this.model, this.jobCmd.text).subscribe(job => {
            this.model.jr = job.jr;
            // console.log(jobOrder.jr);
            this.jo = new JobOrder(job.jo);
            let post = WorkData.JobCmds[job.jo.command].post;
            this.jobCmd = WorkData.JobCmds[post];
          });
          break;
        case WorkData.JobCmds.hold.text:
          this.joService.do(this.model, this.jobCmd.text).subscribe(job => {
            this.model.jr = undefined;
            this.jo = undefined;
            this.initModel();
            this.jobCmd = WorkData.JobCmds.start;
            this.dropdownList = [];
            this.selectedItems = [];
          });
          break;
        case WorkData.JobCmds.restart.text:
          this.joService.do(this.model, this.jobCmd.text).subscribe(job => {
            this.model.jr = job.jr;
            this.jo = new JobOrder(job.jo);
            let post = WorkData.JobCmds[job.jo.command].post;
            this.jobCmd = WorkData.JobCmds[post];
          });
          break;
        case WorkData.JobCmds.complete.text:
          this.joService.do(this.model, this.jobCmd.text).subscribe(job => {
            this.model.jr = undefined;
            this.jo = undefined;
            this.initModel();
            this.jobCmd = WorkData.JobCmds.start;
            this.dropdownList = [];
            this.selectedItems = [];
          })
          break;
        default:
          break;
      }
    }
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

  // onPackingMreqChange(items): void {
  //   if (items && items.length > 0) {
  //     this.model.packingMreq = items.map(item => item.oid);
  //   }
  // }

  onItemSelect(item:any){
    this.model.packingMreq = this.selectedItems.map(item => item.id);
  }
  OnItemDeSelect(item:any){
    this.model.packingMreq = this.selectedItems.map(item => item.id);
  }
  onSelectAll(items: any){
    this.model.packingMreq = items.map(item => item.id);
  }
  onDeSelectAll(items: any){
    this.model.packingMreq = items.map(item => item.id);
  }
}
