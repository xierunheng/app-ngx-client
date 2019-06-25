import * as _ from 'lodash';
import * as moment from 'moment';

import { WorkData, MaterialData } from '../data/util.service';
import { IHierarchyScope } from './hs';
import { IParameter, Parameter } from './parameter';
import {
  IMaterialBase, IMaterialSpec, MaterialSpec,
  IPersonnelOp, PersonnelOp,
  IEquipmentOp, EquipmentOp,
  IMaterialOp, MaterialOp,
  IQuantity, Quantity, IElite
} from './common';
import { IWorkRequestElite } from './work-req';
import { IOpDef, IOpDefElite, OpDefElite,
  IOpseg, IOpsegProfile, OpsegProfile } from './op-def';
import { IOpsegResponse, OpsegResponse,
  IOpsegResponseElite, IOpResponseElite } from './op-res';
import { IOpSchedule, OpScheduleElite } from './op-schedule';
import { IOrderItem, IOrder, IOrderElite, OrderElite } from './order';
import { IMlotElite, MlotElite, IMlot } from './mlot';
import { IEquipmentElite, EquipmentElite, IEquipment } from './equipment';

/**
 * 待布产的物料
 */
export interface IReleasingMReq {
  _id: string;
  items: IMaterialSpec;
  perfQty: number;
  scheduleQty: number;
  priority: number;
  deliveryTime: Date;
  reqState: string;
  oid: string;
  order: IElite;
}

export interface IOpsegRequirement {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  earliestSTime: Date;
  latestETime: Date;
  duration: IQuantity;
  //名义上是opDef，实际上是OpSegment
  //名称继续保留，内容换成IOpsegElite
  opDef: IOpsegProfile;
  segState: string;
  segRes: IOpsegResponseElite;
  jobOrder: any;
  pReq: IPersonnelOp[];
  eReq: IEquipmentOp[];
  mReq: IMaterialOp[];
  para: IParameter[];
}

export class OpsegRequirement {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public earliestSTime: Date;
  public latestETime: Date;
  public duration: IQuantity;
  public opDef: IOpsegProfile;
  public segState: string;
  public segRes: IOpsegResponseElite;
  public jobOrder: any;
  public pReq: IPersonnelOp[];
  public eReq: IEquipmentOp[];
  public mReq: IMaterialOp[];
  public para: IParameter[];

  constructor();
  constructor(osreq: IOpsegRequirement);
  constructor(osreq?: any) {
    this._id = osreq && osreq._id || undefined;
    this.oid = osreq && osreq.oid || '';
    this.desc = osreq && osreq.desc || '';
    this.hs = osreq && osreq.hs || undefined;
    this.opType = osreq && osreq.opType || '';
    this.earliestSTime = osreq && osreq.earliestSTime || moment();
    this.latestETime = osreq && osreq.latestETime || moment().add(1, 'd');
    this.duration = osreq && osreq.duration || new Quantity();
    this.opDef = osreq && osreq.opDef || new OpsegProfile();
    this.segState = osreq && osreq.segState || WorkData.reqStates[0];
    this.segRes = osreq && osreq.segRes || undefined;
    this.jobOrder = osreq && osreq.jobOrder || undefined;
    this.pReq = osreq && osreq.pReq || [];
    this.eReq = osreq && osreq.eReq || [];
    this.mReq = osreq && osreq.mReq || [];
    this.para = osreq && osreq.para || [];
  }

  public DeriveFromOpseg(os: IOpseg, reqID: string) {
    this.oid = reqID + '-' + os.oid;
    this.desc = os.desc;
    this.hs = os.hs;
    this.opType = os.opType;
    this.duration= os.duration;
    this.opDef = new OpsegProfile(os);
    this.pReq = os.pSpec.map(item => {
      let pr = new PersonnelOp(item);
      pr.hs = os.hs;
      return pr;
    });
    this.eReq = os.eSpec.map(item => {
      let er = new EquipmentOp(item);
      er.hs = os.hs;
      return er;
    });
    this.mReq = os.mSpec.map(item => {
      let mr = new MaterialOp(item);
      mr.hs = os.hs;
      return mr;
    });
    this.para = os.para;
  }
}

export interface IOpsegRequirementElite  extends IElite {
}

export class OpsegRequirementElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(osreqe: IOpsegRequirementElite);
  constructor(osreqe?: any) {
    this._id = osreqe && osreqe._id || undefined;
    this.oid = osreqe && osreqe.oid || '';
  }
}

//MongoDB里的 OperationsRequest Schema
export interface IOpRequest {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  startTime: Date;
  endTime: Date;
  priority: number;
  opDef: IOpDefElite;
  reqState: string;
  firstSeg: IElite;
  lastSeg: IElite;
  segReq: IOpsegRequirement[];
  segRes: IOpsegResponse[];
  mlot: IMlotElite;
  order: IOrderElite;
  equip: IEquipmentElite;
  opSchedule: IElite;
  opRes: IOpResponseElite;
  workReq: IWorkRequestElite[];
  //任意的内容，随便扩展
  [key: string]: any;
}

export class OpRequest {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public startTime: Date;
  public endTime: Date;
  public priority: number;
  public opDef: IOpDefElite;
  public reqState: string;
  public firstSeg: IElite;
  public lastSeg: IElite;
  public segReq: IOpsegRequirement[];
  public segRes: IOpsegResponse[];
  public mlot: IMlotElite;
  public order: IOrderElite;
  public equip: IEquipmentElite;
  public opSchedule: IElite;
  public opRes: IOpResponseElite;
  public workReq: IWorkRequestElite[];

  constructor();
  constructor(opreq: IOpRequest);
  constructor(opreq?: any) {
    this._id = opreq && opreq._id || undefined;
    this.oid = opreq && opreq.oid || '';
    this.desc = opreq && opreq.desc || '';
    this.hs = opreq && opreq.hs || undefined;
    this.opType = opreq && opreq.opType || '';
    this.startTime = opreq && opreq.startTime || moment();
    this.endTime = opreq && opreq.endTime || moment().add(1, 'd');
    this.priority = opreq && opreq.priority || 1;
    this.opDef = opreq && opreq.opDef || undefined;
    this.reqState = opreq && opreq.reqState || WorkData.reqStates[0];
    this.firstSeg = opreq && opreq.firstSeg || undefined;
    this.lastSeg = opreq && opreq.lastSeg || undefined;
    this.segReq = opreq && opreq.segReq || [];
    this.segRes = opreq && opreq.segRes || [];
    this.mlot = opreq && opreq.mlot || undefined;
    this.equip = opreq && opreq.equip || undefined;
    this.opSchedule = opreq && opreq.opSchedule || undefined;
    this.opRes = opreq && opreq.opRes || undefined;
    this.workReq = opreq && opreq.workReq || [];
  }

  public GetElite() {
    return new OpRequestElite(this);
  }

  /**
   * [从物料批次中选择产品项]
   * @param {IOpSchedule} ops [description]
   * @param {IOrderItem}  oi  [description]
   */
  public DeriveFromMlot(ops: IOpSchedule, ml: IMlot) {
    this.oid = ml.oid;
    this.desc = ml.desc;
    this.hs = ops.hs;
    this.opType = ops.opType;
    this.startTime = ops.startTime;
    this.endTime = ops.endTime;
    this.priority = ml.order.priority;
    this.opDef = ops.opDef;
    this.reqState = WorkData.reqStates[0];
    this.opSchedule = new OpScheduleElite(ops);
    this.mlot = new MlotElite(ml);
  }

  /**
   * [从订单继承并创建OpRequest, 主要用于包装的操作]
   * @param {IOpSchedule} ops   [description]
   * @param {IOrder}      order [description]
   * @param {IMlotElite}  mle   [description]
   */
  public DeriveFromOrder(ops: IOpSchedule, order: IOrder) {
    this.oid = order.oid;
    this.desc = order.desc;
    this.hs = ops.hs;
    this.opType = ops.opType;
    this.startTime = ops.startTime;
    this.endTime = ops.endTime;
    this.priority = order.priority;
    this.opDef = ops.opDef;
    this.reqState = WorkData.reqStates[0];
    this.opSchedule = new OpScheduleElite(ops);
    this.order = new OrderElite(order);
  }

  /**
   * [从订单继承并创建OpRequest, 主要用于包装的操作]
   * @param {IOpSchedule} ops   [description]
   * @param {IOrder}      order [description]
   * @param {IMlotElite}  mle   [description]
   */
  public DeriveFromEquip(ops: IOpSchedule, equip: IEquipment) {
    //暂时用精确到分钟的时间，作为质检请求的oid
    this.oid = equip.oid + moment().format('YYMMDDHHmm');
    this.desc = equip.desc;
    this.hs = ops.hs;
    this.opType = ops.opType;
    this.startTime = ops.startTime;
    this.endTime = ops.endTime;
    this.priority = 1;
    this.opDef = ops.opDef;
    this.reqState = WorkData.reqStates[0];
    this.opSchedule = new OpScheduleElite(ops);
    this.equip = new EquipmentElite(equip);
  }

  /**
   * 从操作定义 OpDefinition 继承相关的属性
   * @param {IOpDef} od [OpDefinition选项]
   * @param {string} reqOid [OpRequest OID]
   */
  public DeriveFromOpDef(od: IOpDef) {
    this.hs = od.hs;
    this.opType = od.opType;
    this.opDef = new OpDefElite(od);

    //段需求继承段属性
    //在创建操作请求时，不创建操作段响应，而是把操作段响应放在布产那里生成
    //段响应继承段需求的属性
    this.segReq = od.opseg.map(item => {
      let sr = new OpsegRequirement();
      sr.DeriveFromOpseg(item, this.oid);
      return sr;
    });
    this.firstSeg = new OpsegRequirementElite(this.segReq.find(sr => sr.opDef.oid === od.firstSeg.oid));
    this.lastSeg = new OpsegRequirementElite(this.segReq.find(sr => sr.opDef.oid === od.lastSeg.oid));
  }
}

//Mongodb中其他Schema中可能引用的 OperationsRequest Schema
export interface IOpRequestElite extends IElite {
  mlot: IMlotElite;
  reqState: string;
}

export class OpRequestElite {
  public _id: string;
  public oid: string;
  public mlot: IMlotElite;
  public reqState: string;

  constructor();
  constructor(opreqe: IOpRequestElite);
  constructor(opreqe?: any) {
    this._id = opreqe && opreqe._id || undefined;
    this.oid = opreqe && opreqe.oid || '';
    this.mlot = opreqe && opreqe.mlot || '';
    this.reqState = opreqe && opreqe.reqState || '';
  }
}

export interface IOpRequestProfile extends IElite {
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  opRes: IOpResponseElite;
  startTime: Date;
  endTime: Date;
  //deliveryTime: Date;
  priority: number;
  opDef: IOpDefElite;
  mlot: IMlotElite;
  reqState: string;
  workReq: IWorkRequestElite[];
}
