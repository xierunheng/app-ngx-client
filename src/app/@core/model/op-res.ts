import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import {
  IPersonnelOp,
  IEquipmentOp,
  IMaterialOp,
  IOpData,
  IQuantity, Quantity, IElite
} from './common';
import { WorkData } from '../data/util.service';
import {IOpDefElite, OpDefElite, IOpsegProfile } from './op-def';
import {
  IOpsegRequirement, IOpsegRequirementElite,
  IOpRequest, OpRequest
} from './op-req';
import { IJobResponseElite, JobResponseElite } from './job-response';

export interface IOpsegResponse {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  qty: IQuantity;
  actSTime: Date;
  actETime: Date;
  opDef: IOpsegProfile;
  state: string;
  jobResponse: IJobResponseElite;
  pAct: IPersonnelOp[];
  eAct: IEquipmentOp[];
  mAct: IMaterialOp[];
  segData: IOpData[];
}

export class OpsegResponse {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public qty: IQuantity;
  public actSTime: Date;
  public actETime: Date;
  public opDef: IOpsegProfile;
  public state: string;
  public jobResponse: IJobResponseElite;
  public pAct: IPersonnelOp[];
  public eAct: IEquipmentOp[];
  public mAct: IMaterialOp[];
  public segData: IOpData[];

  constructor();
  constructor(osres: IOpsegResponse);
  constructor(osres?: any) {
    this._id = osres && osres._id || undefined;
    this.oid = osres && osres.oid || '';
    this.desc = osres && osres.desc || '';
    this.hs = osres && osres.hs || undefined;
    this.opType = osres && osres.opType || '';
    this.qty = osres && osres.qty || new Quantity();
    this.actSTime = osres && osres.actSTime || undefined;
    this.actETime = osres && osres.actETime || undefined;
    this.opDef = osres && osres.opDef || undefined;
    this.state = osres && osres.state || '';
    this.jobResponse = osres && osres.jobResponse || undefined;
    this.pAct = osres && osres.pAct || [];
    this.eAct = osres && osres.eAct || [];
    this.mAct = osres && osres.mAct || [];
    this.segData = osres && osres.segData || [];
  }

  public DeriveFromOpsegReq(osreq: IOpsegRequirement) {
    this.oid = osreq.oid;
    this.desc = osreq.desc;
    this.hs = osreq.hs;
    this.opType = osreq.opType;
    this.opDef = osreq.opDef;
    // this.state = WorkData.workStates[0];
    this.state = WorkData.WorkStates.Ready.text;
  }
}

export interface IOpsegResponseElite extends IElite {
  // 暂时不需要了，都在同一个doc 里，不需要重复数据
  // segState: string;
}

export class OpsegResponseElite {
  public _id: string;
  public oid: string;
  // public state: string;

  constructor();
  constructor(opsrese: IOpsegResponseElite);
  constructor(opsrese?: any) {
    this._id = opsrese && opsrese._id || undefined;
    this.oid = opsrese && opsrese.oid || '';
    // this.state = opsrese && opsrese.state || '';
  }

}

// MongoDB 里的 OperationsResponse Schema
export interface IOpResponse {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  opReq: IOpsegRequirementElite[];
  workRes: IElite;
  startTime: Date;
  endTime: Date;
  opDef: IOpDefElite;
  state: string;
  firstSeg: IElite;
  lastSeg: IElite;
  segRes: IOpsegResponse[];
}

export class OpResponse {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public opReq: IOpsegRequirementElite[];
  public workRes: IElite;
  public startTime: Date;
  public endTime: Date;
  public opDef: IOpDefElite;
  public state: string;
  public firstSeg: IElite;
  public lastSeg: IElite;
  public segRes: IOpsegResponse[];

  constructor();
  constructor(opres: IOpResponse);
  constructor(opres?: any) {
    this._id = opres && opres._id || undefined;
    this.oid = opres && opres.oid || '';
    this.desc = opres && opres.desc || '';
    this.hs = opres && opres.hs || undefined;
    this.opType = opres && opres.opType || '';
    this.opReq = opres && opres.opReq || [];
    this.workRes = opres && opres.workRes || undefined;
    this.startTime = opres && opres.startTime || undefined;
    this.endTime = opres && opres.endTime || undefined;
    this.opDef = opres && opres.opDef || undefined;
    this.state = opres && opres.state || '';
    this.firstSeg = opres && opres.firstSeg || undefined;
    this.lastSeg = opres && opres.lastSeg || undefined;
    this.segRes = opres && opres.segRes || [];
  }

  public GetElite() {
    return new OpResponseElite(this);
  }

}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IOpResponseElite extends IElite {
  state: string;
}

export class OpResponseElite {
  public _id: string;
  public oid: string;
  public state: string;

  constructor();
  constructor(oprese: IOpResponseElite);
  constructor(oprese?: any) {
    this._id = oprese && oprese._id || undefined;
    this.oid = oprese && oprese.oid || '';
    this.state = oprese && oprese.state || '';
  }
}

export interface IOpResponseProfile {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  workRes: IElite;
  startTime: Date;
  endTime: Date;
  opDef: IOpDefElite;
  state: string;
}

export class OpResponseProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public workRes: IElite;
  public startTime: Date;
  public endTime: Date;
  public opDef: IOpDefElite;
  public state: string;

  constructor();
  constructor(opresp: IOpResponseProfile);
  constructor(opresp?: any) {
    this._id = opresp && opresp._id || undefined;
    this.oid = opresp && opresp.oid || '';
    this.desc = opresp && opresp.desc || '';
    this.hs = opresp && opresp.hs || undefined;
    this.opType = opresp && opresp.opType || '';
    this.workRes = opresp && opresp.workRes || undefined;
    this.startTime = opresp && opresp.startTime || undefined;
    this.endTime = opresp && opresp.endTime || undefined;
    this.opDef = opresp && opresp.opDef || undefined;
    this.state = opresp && opresp.state || '';
  }
}
