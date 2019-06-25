import { IHierarchyScope } from './hs';
import { IElite } from './common';
import { GlobalData } from './global';
import { IParameter } from './parameter';
import { IPersonElite } from './person';
import { IEquipment, IEquipmentElite } from './equipment';
import { MdefElite, IMdefElite } from './mdef';
import { IMsubLotProfile, IMsubLot } from './msublot';
import { IProsegElite } from './proseg';
import { IJobResponseProfile, JobResponse } from './job-response';
import { IJobOrder, JobOrder } from './job-order';
import { IPsubProfile } from './psub';
import { IEsubProfile } from './esub';
import { IUser } from './user';
import { MaterialData, WorkData, UtilData } from '../data/util.service';
import { IOpLog, IMOpLog } from './base/oplog';

/**
 * 生产相关的Oplog,除了 条形码 编号外，还有额外的信息，
 * 根据工序不同需要记录不同的信息
 */
export interface ITerminal {
  //操作定义
  oplog: IOpLog;
  //一次扫码的 oid,
  //修坯和质检，一次扫码一个；
  //成型/喷釉/登窑，一次扫码一个
  // oids: string[];
  msublot: IMsubLot;
  //员工每天的登陆，都作为员工的细分项，员工以天为单位，类似于物料以批次为单位
  //personnel Sub
  psub: IPsubProfile;
  //设备每次运行，作为设备的细分项，设备以次为单位，类似于物料批次为单位
  esub: IEsubProfile;
  //终端的工单信息，当前作业的工单，
  //包括job Order和job Response
  jr: IJobResponseProfile;
  //打托的订单信息，由于打托没有订单/工单信息，用已包装的纸箱的订单作为验证信息
  order?: IElite;
  //包装工序的包装类型
  //包括 装箱/装拖/装柜，和后续要实现的 拆箱/拆拖/拆柜
  packingtype?: string;
  // 选择的喷釉颜色
  color?: string;
  //质检对应的窑炉
  kiln?: IEquipmentElite;
  //质检对应的窑炉的卸窑时间
  drawDate?: Date;
  //质检结果 和 返修结果 和 盘点 对应的loc
  loc?: IHierarchyScope;
  //从server返回的err, 主要是 transit err 和 其他
  err?: ITerminalErr;
  //从server返回的warning, 主要是 质检终端
  warning?: ITerminalWarning;
  //生产相关的 oplog, 针对外购外协产品
  prodLog?: IMOpLog[];
    packingMreq?:string[];
  packingMcount?: number;
}

export class Terminal {
  public oplog: IOpLog;
  // public oids: string[];
  public msublot: IMsubLot;
  public psub: IPsubProfile;
  public esub: IEsubProfile;
  public jr: JobResponse;
  public order?: IElite;
  public packingtype?: string;
  public color?: string;
  public kiln?: IEquipmentElite;
  public drawDate?: Date;
  public loc?: IHierarchyScope;
  public err?: ITerminalErr;
  public warning?: ITerminalWarning;
  public prodLog?: IMOpLog[];
  public packingMreq?: string[];
  public packingMcount?: number;

  constructor();
  constructor(term: ITerminal);
  constructor(term?: any) {
    this.oplog = term && term.oplog || {};
    // this.oids = term && term.oids || [];
    this.msublot = term && term.msublot || {};
    this.psub = term && term.psub || {};
    this.esub = term && term.esub || {};
    this.jr = term && term.jr || undefined;
    this.order = term && term.order || undefined;
    this.packingtype = term && term.packingtype || '';
    this.color = term && term.color || '';
    this.kiln = term && term.kiln || undefined;
    this.drawDate = term && term.drawDate || undefined;
    this.loc = term && term.loc || undefined;
    this.err = term && term.err || undefined;
    this.warning = term && term.warning || undefined;
    this.prodLog = term && term.prodLog || undefined;
    this.packingMreq = term && term.packingMreq || [];
    this.packingMcount = term && term.packingMcount || 1;
  }

  /**
   * [根据工序的不同，向服务器传递不同的内容]
   * @param {string = ''} op [description]
   */
  getElite(op: string = '') {
    let obj: Terminal = new Terminal();
    obj.oplog = this.oplog;
    // obj.oids = this.oids;
    obj.msublot = this.msublot;
    obj.psub = this.psub;
    obj.jr = this.jr;
    obj.kiln = this.kiln;
    obj.prodLog = this.prodLog;
    obj.order = this.order;
    if (op === MaterialData.BodyOps.glaze.text) {
      obj.color = this.color;
    } else if (op === MaterialData.BodyOps.qc.text) {
      obj.kiln = this.kiln;
      obj.drawDate = this.drawDate;
      obj.loc = this.loc;
    } else if (op === MaterialData.BodyOps.pack.text) {
      obj.packingtype = this.packingtype;
      obj.packingMreq = this.packingMreq;
      obj.packingMcount = this.packingMcount;
    }
    return obj;
  }

  public static create(user: IUser, job?: any): Terminal {
    const terminal = new Terminal();
    terminal.oplog.op = user.op;
    terminal.oplog.proseg = user.ps;
    terminal.oplog.hs = user.hs;
    terminal.psub = user.psub;
    if (job && job.jr) {
      terminal.jr = new JobResponse(job.jr);
      if (job.jr.eAct && job.jr.eAct.length > 0) {
        terminal.esub = job.jr.eAct[0];
        terminal.esub.prop = job.jr.eAct[0].opprop;
        console.log(terminal);
      }
    }
    return terminal;
  }

  /**
   * [用user来初始化oplog]
   * @param {any} user [description]
   */
  initByUser(user: IUser) {
    this.oplog.op = user.op;
    this.oplog.proseg = user.ps;
    this.oplog.hs = user.hs;
    // this.oplog.person = user.person;
    this.psub = user.psub;
    console.log(this.psub);
  }

  /**
   * [当前终端的工单是否开工]
   * @return {boolean} [description]
   */
  get isRunning(): boolean {
    return this.jr && this.jr.state === WorkData.WorkStates.Running.text;
  }

  /**
   * [对server返回的结果做判断，如果有错误，我们需要对错误进行划分，
   * 不同的错误，有不同的terminalState与之对应;
   * 如果没有错误，我们把jr更新了;
   * 最终返回终端状态]
   * @param  {[type]} result [description]
   * @return {string}        [description]
   */
  judgeResult(result, bodyState: string, op: string = ''): string {
    let rnState = UtilData.terminalStates[0];
    if (result.type) {
      switch (result.type) {
        case UtilData.terminalErrs[0]:
          //要使反扫码能报缺陷，需要在这里加上，也可以做成配置项
          if (result.entity.opState === bodyState) {
            if (op === MaterialData.BodyOps.mold.text ||
              op === MaterialData.BodyOps.trim.text ||
              op === MaterialData.BodyOps.mgtrim.text ||
              op === MaterialData.BodyOps.glaze.text ||
              op === MaterialData.BodyOps.grind.text ||
              op === MaterialData.BodyOps.load.text ||
              op === MaterialData.BodyOps.pack.text) {
              rnState = UtilData.terminalStates[1];
            } else {
              this.err = result;
              rnState = UtilData.terminalStates[3];
            }
          } else if (result.entity.opState === MaterialData.BodyOps.reject.state) {
            rnState = UtilData.terminalStates[2];
            this.oplog.reason = result.entity.reason;
          } else {
            rnState = UtilData.terminalStates[3];
            this.err = result;
          }
          break;
        case UtilData.terminalErrs[1]:
        case UtilData.terminalErrs[2]:
        case UtilData.terminalErrs[3]:
        case UtilData.terminalErrs[4]:
        case UtilData.terminalErrs[5]:
        case UtilData.terminalErrs[6]:
        case UtilData.terminalErrs[7]:
        case UtilData.terminalErrs[8]:
          this.err = result;
          rnState = UtilData.terminalStates[3];
          break;
        case UtilData.terminalWarnings[0]:
        case UtilData.terminalWarnings[1]:
        case UtilData.terminalWarnings[2]:
          this.warning = result;
          rnState = UtilData.terminalStates[4];
          break;
        default:
          break;
      }
    } else if (result.jr) {
      this.jr = result.jr;
    }
    return rnState;
  }


  /**
   * [新扫描的物料子批次，是否属于该成型工的,
   * 通过第2-4字节与 code 比较]
   * 由于客户打印条码错误，暂时放开4-6字节与code的匹配
   * TODO：后续要关闭这个判断，否则影响 年份号 员工的使用
   * @return {boolean} [description]
   */
  isTheMolder(): boolean {
    if (this.psub && this.psub.person && this.msublot && this.msublot.oid) {
      return this.msublot.oid.slice(2, 4) === this.psub.person.code ||
        this.msublot.oid.slice(4, 6) === this.psub.person.code;
    }
    return false;
  }

  /**
   * [重新初始化 op]
   * 同时要初始化缺陷想，为空的缺陷项，就是空
   * @param {string} op     [description]
   * @param {[type]} reason =             [description]
   */
  reinit(op: string, reason = []) {
    this.oplog.op = op;
    this.oplog.reason = reason;
  }
}

/**
 * 从服务器传过来的job,
 * 如果有在运行工单，返回jo,jr
 * 如果没有在运行工单，返回jos,供终端选择
 */
export interface IJob {
  jo: IJobOrder;
  jr: IJobResponseProfile;
  mCount: any;
  jos: IJobOrder[];
}

/**
 * 终端操作时，产生错误的interface
 */
export interface ITerminalErr {
  //错误类型
  type: string;
  //错误产生的源，一般是msublot
  entity: any;
  //错误信息
  message: string;
  //状态机异常
  transition?: string;
  from?: string;
  to?: string;
  current?: string;
  transitions?: string[];
}

/**
 * 终端操作时，产生警告的interface
 */
export interface ITerminalWarning {
  //警告类型
  type: string;
  //警告产生的源，一般是msublot
  entity: any;
  //警告信息
  message: string;
}

/**
 * util.service 中 BodyOps 的数据结构定义
 */
export interface IBodyOp {
  text: string;
  name: string;
  pre?: string;
  oper?: string;
  state: string;
  desc: string;
  url: string;
}

/**
 * util.service 中 JobCmds 的数据结构定义
 */
export interface IJobCmd {
  text: string;
  name: string;
  state: string;
  post: string;
  desc: string;
}

/**
 * 上一次扫码的记录
 */
export interface IBodyRecord {
  str: string;
  date: Date;
}
