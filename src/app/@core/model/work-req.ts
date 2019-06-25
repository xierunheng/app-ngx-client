import * as _ from 'lodash';
import * as moment from 'moment';
import { IQuantity, Quantity, IElite, IMaterialOp } from './common';
import { WorkData, MaterialData } from '../data/util.service';
import { IHierarchyScope } from './hs';
import {JobOrder, IJobOrder, IJobOrderElite } from './job-order';
import { IOpRequest, IOpRequestElite } from './op-req';
import {IJobResponse,
  JobResponse, IJobResponseElite } from './job-response';
import { IWorkResponseElite } from './work-res';
import { IOrderItem, IOrder, IOrderElite, OrderElite } from './order';
import { IMlotElite, MlotElite, IMlot } from './mlot';
import { IEquipmentElite, EquipmentElite } from './equipment';

//MongoDB里的WorkRequest Schema
export interface IWorkRequest {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  startTime: Date;
  endTime: Date;
  priority: number;
  res: IWorkResponseElite;
  opReq: IOpRequestElite[];
  firstJob: IElite;
  lastJob: IElite;
  jobOrder: IJobOrder[];
  mlot: IMlotElite;
  order: IOrderElite;
  equip: IEquipmentElite;
}

export class WorkRequest {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public startTime: Date;
  public endTime: Date;
  public priority: number;
  public res: IWorkResponseElite;
  public opReq: IOpRequestElite[];
  public firstJob: IElite;
  public lastJob: IElite;
  public jobOrder: JobOrder[];
  public mlot: IMlotElite;
  public order: IOrderElite;
  public equip: IEquipmentElite;

  constructor();
  constructor(wr: IWorkRequest);
  constructor(wr?: any) {
    this._id = wr && wr._id || undefined;
    this.oid = wr && wr.oid || '';
    this.desc = wr && wr.desc || '';
    this.hs = wr && wr.hs || undefined;
    this.workType = wr && wr.workType || '';
    this.startTime = wr && wr.startTime || undefined;
    this.endTime = wr && wr.endTime || undefined;
    this.priority = wr && wr.priority || 1;
    this.res = wr && wr.res || undefined;
    this.opReq = wr && wr.opReq || undefined;
    this.firstJob = wr && wr.firstJob || undefined;
    this.lastJob = wr && wr.lastJob || undefined;
    this.jobOrder = [];
    if(wr && wr.jobOrder) {
      this.jobOrder = wr.jobOrder.map(jo => new JobOrder(jo));
    }
    this.mlot = wr && wr.mlot || undefined;
    this.order = wr && wr.order || undefined;
    this.equip = wr && wr.equip || undefined;
  }

  public GetElite() {
    return new WorkRequestElite(this);
  }

  /**
   * [获取作业的最终物料需求]
   * 1. 如果有 Produced，获取 Produced 的
   * 2. 没有 Produced， 获取 Consumed 的
   * @return {IMaterialOp[]} [description]
   */
  public get destMReq(): IMaterialOp[] {
    let lastjo = this.jobOrder.find(jo => jo.oid === this.lastJob.oid);
    let destReq = lastjo.mReq.filter(mr => mr.use === MaterialData.useTypes[1]);
    if (!destReq || destReq.length <= 0) {
      destReq = lastjo.mReq.filter(mr => mr.use === MaterialData.useTypes[0]);
    }
    return destReq;
  }

  /**
   * [根据 destMReq 获取作业的计划数量]
   * @return {IQuantity} [description]
   */
  public get qty(): IQuantity {
    let rnQty: IQuantity = new Quantity();
    if (this.destMReq.length > 0) {
      rnQty.unit = this.destMReq[0].qty.unit;
      rnQty.quantity = this.destMReq.map(mr => mr.qty.quantity).reduce((prev, curr) => prev + curr);
    }
    return rnQty;
  }

  /**
  * [数量多字符串表示]
  * @return {string} [description]
  */
  public get qtyStr(): string {
    return this.qty.quantity + this.qty.unit;
  }
  
  /**
   * [获取作业的计划产出]
   * like {1016: 10，
   *     1013: 12}, 1016 型号的产品 10 件, 1013产品 12 件
   * @return {any} [description]
   */
  public get reqOutput(): any {
    return _.mapValues(_.keyBy(this.destMReq, 'mdef.oid'), 'qty.quantity');
  }
}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IWorkRequestElite extends IElite {
}

export class WorkRequestElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(wreqe: IWorkRequestElite);
  constructor(wreqe?: any) {
    this._id = wreqe && wreqe._id || undefined;
    this.oid = wreqe && wreqe.oid || '';
  }
}

export interface IWorkRequestProfile extends IElite {
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  startTime: Date;
  endTime: Date;
  priority: number;
  res: IWorkResponseElite;
  opReq: IOpRequestElite[];
}

