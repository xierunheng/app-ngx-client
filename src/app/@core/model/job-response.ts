import * as _ from 'lodash';
import { IHierarchyScope} from './hs';
import { IParameter} from './parameter';
import { IQuantity, Quantity,
  IPersonnelOp, IEquipmentOp, IMaterialOp, IOpData, IElite } from './common';
import { WorkData } from '../data/util.service';
import { IJobOrder, JobOrder,
  IJobOrderElite, JobOrderElite } from './job-order';
import { IOpsegResponseElite, OpsegResponseElite } from './op-res';
import { IWorkDirectiveElite } from './work-directive';
import { Response } from './base/res';
import { IJOpLog  } from './base/oplog';

/**
 * Echart bar 图表呈现的数据格式
 */
export class BarData {
  //bar series' name, for legend
  name: string;
  //bar series' stack, 表示该bar放在那一摞
  stack: string;
  //real data, key: value
  //like {1016: 10，
  //      1013: 12}, 1016 型号的产品 10 件, 1013产品 12 件
  data: any;
}

/**
 * 待时间轴的数据呈现
 */
export class TimeData {
  name: string;
  data: any[];
}

/**
 * EchartBar传输的数据
 */
export class EchartBar {
  title: string;
  data: BarData[];
}

/**
 * Echart传输的数据
 */
export class EchartData {
  title: string;
  data: any[];
}

export class EchartBarData {
  titleText: string;
  legendData: string[];
  xData: string[];
  series: any[];
}

export class EchartTimelineData {
  titleText: string;
  tooltipFormatter: any;
  legendData: string[];
  series: any[];
}

//MongoDB里的JobOrder Schema
export interface IJobResponse {
  _id: string;
  oid: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  jobOrder: IJobOrderElite;
  workRes: IElite;
  directive: IWorkDirectiveElite;
  qty: IQuantity;
  ngqty: IQuantity;
  startTime: Date;
  endTime: Date;
  state: string;
  segRes: IOpsegResponseElite[];
  pAct: IPersonnelOp[];
  eAct: IEquipmentOp[];
  mAct: IMaterialOp[];
  ngmAct: IMaterialOp[];
  reasons: IParameter[];
  jobData: IOpData[];
  oplog: IJOpLog[];
}

export class JobResponse extends Response {
  public _id: string;
  public oid: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public jobOrder: IJobOrderElite;
  public workRes: IElite;
  public directive: IWorkDirectiveElite;
  public qty: IQuantity;
  public ngqty: IQuantity;
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public segRes: IOpsegResponseElite[];
  public pAct: IPersonnelOp[];
  public eAct: IEquipmentOp[];
  public mAct: IMaterialOp[];
  public ngmAct: IMaterialOp[];
  public reasons: IParameter[];
  public jobData: IOpData[];
  public oplog: IJOpLog[];

  constructor();
  constructor(jr: IJobResponse);
  constructor(jr?: any) {
    super();
    this._id = jr && jr._id || undefined;
    this.oid = jr && jr.oid || '';
    this.desc = jr && jr.desc || '';
    this.workType = jr && jr.workType || '';
    this.hs = jr && jr.hs || undefined;
    this.jobOrder = jr && jr.jobOrder || undefined;
    this.workRes = jr && jr.workRes || undefined;
    this.directive = jr && jr.directive || undefined;
    this.qty = jr && jr.qty || new Quantity();
    this.ngqty = jr && jr.ngqty || new Quantity();
    this.startTime = jr && jr.startTime || undefined;
    this.endTime = jr && jr.endTime || undefined;
    this.state = jr && jr.state || '';
    this.segRes = jr && jr.segRes || [];
    this.pAct = jr && jr.pAct || [];
    this.eAct = jr && jr.eAct || [];
    this.mAct = jr && jr.mAct || [];
    this.ngmAct = jr && jr.ngmAct || [];
    this.reasons = jr && jr.reasons || [];
    this.jobData = jr && jr.jobData || [];
    this.oplog = jr && jr.oplog || [];
  }

  public GetElite() {
    return new JobResponseElite(this);
  }

  /**
   * [获取工单实际的产出
   * like {1016: 10，
   *     1013: 12}, 1016 型号的产品 10 件, 1013产品 12 件]
   * @return {any} [description]
   */
  public get actOutput(): any {
    return this.calcOutput(this.mAct);
  }

  /**
   * [按照成型工区分来获取工单实际的产出]
   * @return {any} [description]
   */
  public get actOutputWithMolder(): any {
    return this.calcOutputWithMolder(this.mAct);
  }

  /**
   * [获取工单的质量缺陷数]
   * @return {any} [description]
   */
  public get actQCI(): any {
    return this.calcJobQCI(this.oplog);
  }

  /**
   * [获取工单带时间戳的产出]
   * @return {any} [description]
   */
  public get actOutputWithTime(): any {
    return {
      name: this.oid,
      // data: this.calcOutputWithTime(this.mAct)
      data: this.calcOpLog(this.oplog)
    };
  }

  /**
   * [获取工单的质量缺陷数，同时获取累计占比，形成pareto图]
   * @return {any} [description]
   */
  public get actQCIPareto(): any {
    return this.calcJobQCIPareto(this.oplog);
  }

  /**
   * [根据工单的执行状态，显示工单的样式]
   * @return {string} [description]
   */
  public get showStatus(): string {
    return WorkData.WorkStates[this.state].status;
  }
}

//Mongodb中其他Schema中可能引用的JobResponse Schema
export interface IJobResponseElite extends IElite{
  state: string;
}

export class JobResponseElite {
  public _id: string;
  public oid: string;
  public state: string;

  constructor();
  constructor(jre:IJobResponseElite);
  constructor(jre?: any) {
    this._id = jre && jre._id || undefined;
    this.oid = jre && jre.oid || '';
    this.state = jre && jre.state || '';
  }
}

//不带具体 人机料的 Job Response数据
export interface IJobResponseProfile extends IJobResponseElite{
  oid: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  jobOrder: IJobOrderElite;
  qty: IQuantity;
  ngqty: IQuantity;
  startTime: Date;
  endTime: Date;
  state: string;
  segRes: IOpsegResponseElite[];
}

export class JobResponseProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public jobOrder: IJobOrderElite;
  public qty: IQuantity;
  public ngqty: IQuantity;
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public segRes: IOpsegResponseElite[];

  constructor();
  constructor(jrp: IJobResponseProfile);
  constructor(jrp?: any) {
    this._id = jrp && jrp._id || undefined;
    this.oid = jrp && jrp.oid || '';
    this.desc = jrp && jrp.desc || '';
    this.hs = jrp && jrp.hs || undefined;
    this.workType = jrp && jrp.workType || '';
    this.state = jrp && jrp.state || '';
    this.jobOrder = jrp && jrp.jobOrder || undefined;
    this.qty = jrp && jrp.qty || new Quantity();
    this.ngqty = jrp && jrp.ngqty || new Quantity();
    this.startTime = jrp && jrp.startTime || undefined;
    this.endTime = jrp && jrp.endTime || undefined;
    this.state = jrp && jrp.state || '';
    this.segRes = jrp && jrp.segRes || [];
  }
}

//从数据库得到的Job接口
export interface IJob {
  jo: IJobOrder;
  jr: IJobResponse;
}

