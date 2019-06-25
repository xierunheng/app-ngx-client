import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { MaterialData, WorkData } from '../data/util.service';
import { IQuantity, Quantity,
  IPersonnelOp, IEquipmentOp, IMaterialOp, IElite } from './common';
import { IWorkMaster, IWorkMasterElite, WorkMasterElite } from './work-master';
import { IOpsegRequirement,
  IOpsegRequirementElite, OpsegRequirementElite } from './op-req';
import { IJobResponseElite } from './job-response';


//MongoDB里的JobOrder Schema
export interface IJobOrder {
  _id: string;
  oid: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  jobResponse: IJobResponseElite;
  workReq: IElite;
  master: IWorkMasterElite;
  startTime: Date;
  endTime: Date;
  priority: number;
  command: string;
  rule: string;
  dispatchStatus: string;
  segReq: IOpsegRequirementElite;
  pReq: IPersonnelOp[];
  eReq: IEquipmentOp[];
  mReq: IMaterialOp[];
  para: IParameter[];
  order: IElite;
  qty?: IQuantity;
  availableCmd?: any;
}

export class JobOrder {
  public _id: string;
  public oid: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public jobResponse: IJobResponseElite;
  public workReq: IElite;
  public master: IWorkMasterElite;
  public startTime: Date;
  public endTime: Date;
  public priority: number;
  public command: string;
  public rule: string;
  public dispatchStatus: string;
  public segReq: IOpsegRequirementElite;
  public pReq: IPersonnelOp[];
  public eReq: IEquipmentOp[];
  public mReq: IMaterialOp[];
  public para: IParameter[];
  public order: IElite;
  public availableCmd?: any;

  constructor();
  constructor(jo: IJobOrder);
  constructor(jo?: any) {
    this._id = jo && jo._id || undefined;
    this.oid = jo && jo.oid || '';
    this.desc = jo && jo.desc || '';
    this.workType = jo && jo.workType || '';
    this.hs = jo && jo.hs || undefined;
    this.jobResponse = jo && jo.jobResponse || undefined;
    this.workReq = jo && jo.workReq || undefined;
    this.master = jo && jo.master || undefined;
    this.startTime = jo && jo.startTime || undefined;
    this.endTime = jo && jo.endTime || undefined;
    this.priority = jo && jo.priority || 1;
    this.command = jo && jo.command || '';
    this.rule = jo && jo.rule || '';
    this.dispatchStatus = jo && jo.dispatchStatus || '';
    this.segReq = jo && jo.segReq || undefined;
    this.pReq = jo && jo.pReq || [];
    this.eReq = jo && jo.eReq || [];
    this.mReq = jo && jo.mReq || [];
    this.para = jo && jo.para || [];
    this.order = jo && jo.order || undefined;
    this.availableCmd = jo && jo.availableCmd || undefined;
  }

  public GetElite() {
    return new JobOrderElite(this);
  }

  /**
   * [获取工单的最终物料需求]
   * 1. 如果有 Produced，获取 Produced 的
   * 2. 没有 Produced， 获取 Consumed 的
   * @return {IMaterialOp[]} [description]
   */
  public get destMReq(): IMaterialOp[] {
    let destReq = this.mReq.filter(mr => mr.use === MaterialData.useTypes[1]);
    if (!destReq || destReq.length <= 0) {
      destReq = this.mReq.filter(mr => mr.use === MaterialData.useTypes[0]);
    }
    return destReq;
  }

  /**
   * [根据 destMReq 获取工单的计划数量]
   * @return {IQuantity} [description]
   */
  public get qty(): IQuantity {
    let rnQty: IQuantity = new Quantity({
      quantity: 0,
      unit: '件'
    });
    if (this.destMReq.length > 0) {
      rnQty.unit = this.destMReq[0].qty.unit;
      rnQty.quantity = this.destMReq.map(mr => mr.qty.quantity).reduce((prev, curr) => prev + curr);
    }
    return rnQty;
  }

  /**
   * [获取工单的计划产出]
   * like {1016: 10，
   *     1013: 12}, 1016 型号的产品 10 件, 1013产品 12 件
   * @return {any} [description]
   */
  public get reqOutput(): any {
    return _.mapValues(_.keyBy(this.destMReq, 'mdef.oid'), 'qty.quantity');
  }

  /**
   * [根据工单中工单执行的状态，给出本工单的文本显示样式]
   * @return {string} [description]
   */
  public get txtClass(): string {
    let rnClass = '';
    if(this.jobResponse && this.jobResponse.state) {
      rnClass = WorkData.WorkStates[this.jobResponse.state].txtClass;
    }
    return rnClass;
  }
}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IJobOrderElite extends IElite {
}

export class JobOrderElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(joe: IJobOrderElite);
  constructor(joe?: any) {
    this._id = joe && joe._id || undefined;
    this.oid = joe && joe.oid || '';
  }
}

export interface IJobOrderProfile {
  _id: string;
  oid: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  jobResponse: IJobResponseElite;
  workReq: IElite;
  master: IWorkMasterElite;
  startTime: Date;
  endTime: Date;
  priority: number;
  command: string;
  rule: string;
  dispatchStatus: string;
  segReq: IOpsegRequirementElite;
}

export class JobOrderProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public jobResponse: IJobResponseElite;
  public workReq: IElite;
  public master: IWorkMasterElite;
  public startTime: Date;
  public endTime: Date;
  public priority: number;
  public command: string;
  public rule: string;
  public dispatchStatus: string;
  public segReq: IOpsegRequirementElite;

  constructor();
  constructor(jop: IJobOrderProfile);
  constructor(jop?: any) {
    this._id = jop && jop._id || undefined;
    this.oid = jop && jop.oid || '';
    this.desc = jop && jop.desc || '';
    this.workType = jop && jop.workType || '';
    this.hs = jop && jop.hs || undefined;
    this.jobResponse = jop && jop.jobResponse || undefined;
    this.workReq = jop && jop.workReq || undefined;
    this.master = jop && jop.master || undefined;
    this.startTime = jop && jop.startTime || new Date();
    this.endTime = jop && jop.endTime || new Date();
    this.priority = jop && jop.priority || 1;
    this.command = jop && jop.command || '';
    this.rule = jop && jop.rule || '';
    this.dispatchStatus = jop && jop.dispatchStatus || '';
    this.segReq = jop && jop.segReq || undefined;
  }
}
