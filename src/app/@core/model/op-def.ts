import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { OpProp,
  IPersonnelSpec, IEquipmentSpec,
  IMaterialSpec, MaterialSpec,
  IQuantity, Quantity,
  ISegDep, IElite } from './common';
import {IProseg,
  IProsegElite, ProsegElite } from './proseg';
import { IWorkMasterElite } from './work-master';
import { IMdef, MdefElite } from './mdef';
import { MaterialData } from '../data/util.service';

export interface IOpMBill {
  _id: string;
  oid: string;
  desc: string;
  opmbItem: IMaterialSpec[];
}

export class OpMBill {
  public _id: string;
  public oid: string;
  public desc: string;
  public opmbItem: IMaterialSpec[];

  constructor();
  constructor(opmb: IOpMBill);
  constructor(opmb?: any) {
    this._id = opmb && opmb._id || undefined;
    this.oid = opmb && opmb.oid || '';
    this.desc = opmb && opmb.desc || '';
    this.opmbItem = opmb && opmb.opmbItem || [];
  }

  /**
   * [从工艺段获取相关的信息，关注工艺段的物料信息]
   * @param {IProseg} ps [description]
   */
  public DeriveFromProseg(ps: IProseg) {
    this.oid = ps.oid;
    this.opmbItem = ps.mSpec;
  }
}

export interface ISegDep {
  _id: string;
  oid: string;
  desc: string;
  depend: string;
  tfactor: string;
  tunit: string;
  item: any[];
}

export class SegDep {
  public _id: string;
  public oid: string;
  public desc: string;
  public depend: string;
  public tfactor: string;
  public tunit: string;
  public item: any[];

  constructor();
  constructor(segdep: ISegDep);
  constructor(segdep?: any) {
    this._id = segdep && segdep._id || undefined;
    this.oid = segdep && segdep.oid || '';
    this.desc = segdep && segdep.desc || '';
    this.depend = segdep && segdep.depend || '';
    this.tfactor = segdep && segdep.tfactor || '';
    this.tunit = segdep && segdep.tunit || '';
    this.item = segdep && segdep.item || [];
  }
}

/**
 * sub-key Operation Segment Defintion
 */
export interface IOpseg {
  _id: string;
  oid: string;
  desc: string;
  opType: string;
  hs: IHierarchyScope;
  duration: IQuantity;
  proseg: IProsegElite;
  pSpec: IPersonnelSpec[];
  eSpec: IEquipmentSpec[];
  mSpec: IMaterialSpec[];
  para: IParameter[];
  dep: ISegDep[];
  workDef: IWorkMasterElite;
}

export class Opseg {
  public _id: string;
  public oid: string;
  public desc: string;
  public opType: string;
  public hs: IHierarchyScope;
  public duration: IQuantity;
  public proseg: IProsegElite;
  public pSpec: IPersonnelSpec[];
  public eSpec: IEquipmentSpec[];
  public mSpec: IMaterialSpec[];
  public para: IParameter[];
  public dep: ISegDep[];
  public workDef: IWorkMasterElite;

  constructor();
  constructor(os: IOpseg);
  constructor(os?: any) {
    this._id = os && os._id || undefined;
    this.oid = os && os.oid || '';
    this.desc = os && os.desc || '';
    this.opType = os && os.opType || '';
    this.hs = os && os.hs || undefined;
    this.duration = os && os.duration || new Quantity();
    this.proseg = os && os.proseg || undefined;
    this.pSpec = os && os.pSpec || [];
    this.eSpec = os && os.eSpec || [];
    this.mSpec = os && os.mSpec || [];
    this.para = os && os.para || [];
    this.dep = os && os.dep || undefined;
    //这里创建的目的，在于能够在 创建 和 更新 的界面上，一致的呈现
    //会有循环引用的问题，有待解决
    // this.workDef = os && os.workDef || new WorkMasterElite();
    this.workDef = os && os.workDef || undefined;
  }

  public GetElite() {
    return new OpsegProfile(this);
  }

  /**
   * 从单个的 ProcessSegment 继承相关的属性，
   * 保证 ProcessSegment 和 OpSegment 在某些属性上的一致性
   * @param {IProseg} ps [ProcessSegment]
   */
  public DeriveFromProseg(ps: IProseg) {
    this.oid = ps.oid;
    this.desc = ps.desc;
    this.opType = ps.opType;
    this.hs = ps.hs;
    this.duration = ps.duration;
    this.pSpec = ps.pSpec;
    this.eSpec = ps.eSpec;
    this.mSpec = ps.mSpec;
    this.para = ps.para;
    this.proseg = new ProsegElite(ps);
  }
}

//Mongodb中其他Schema中可能引用的OpSeg Schema
export interface IOpsegProfile extends IElite{
  proseg: IProsegElite;
  //为了能及时找到OpSeg和WorkMaster的对应关系，把该关系放到关键信息中,
  //以便随时查找，这个能不能不要，从 workMaster 那边直接找
  workDef: IWorkMasterElite;
}

export class OpsegProfile {
  public _id: string;
  public oid: string;
  public proseg: IProsegElite;
  public workDef: IWorkMasterElite;

  constructor();
  constructor(ose: IOpsegProfile);
  constructor(ose?: any) {
    this._id = ose && ose._id || undefined;
    this.oid = ose && ose.oid || '';
    this.proseg = ose && ose.proseg || {};
    this.workDef = ose && ose.workDef || undefined;
  }
}


/**
 * key Operation Definition
 */
export interface IOpDef{
  _id: string;
  oid: string;
  ver: string;
  code: string;
  desc: string;
  opType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  bom: any;
  workDef: any;
  bor: any;
  // opmb: IOpMBillItem[];
  opmb: IOpMBill[];
  firstSeg: IElite;
  lastSeg: IElite;
  opseg: IOpseg[];
  //在新建opdef 时，选择的 prosegs, 用于在服务器端创建opsegs
  psID?: string[];
}

export class OpDef{
  public _id: string;
  public oid: string;
  public ver: string;
  public code: string;
  public desc: string;
  public opType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public bom: any;
  public workDef: any;
  public bor: any;
  public opmb: IOpMBill[];
  public firstSeg: IElite;
  public lastSeg: IElite;
  public opseg: IOpseg[];
  public psID?: string[];

  constructor();
  constructor(opdef: IOpDef);
  constructor(opdef?: any) {
    this._id = opdef && opdef._id || undefined;
    this.oid = opdef && opdef.oid || '';
    this.ver = opdef && opdef.ver || '';
    this.code = opdef && opdef.code || undefined;
    this.desc = opdef && opdef.desc || '';
    this.opType = opdef && opdef.opType || '';
    this.hs = opdef && opdef.hs || undefined;
    this.pubDate = opdef && opdef.pubDate || new Date();
    this.bom = opdef && opdef.bom || undefined;
    this.workDef = opdef && opdef.workDef || undefined;
    this.bor = opdef && opdef.bor || undefined;
    this.firstSeg = opdef && opdef.firstSeg || undefined;
    this.lastSeg = opdef && opdef.lastSeg || undefined;
    this.opmb = opdef && opdef.opmb || [];
    this.opseg = opdef && opdef.opseg || [];
  }

  public GetElite() {
    return new OpDefElite(this);
  }
}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IOpDefElite extends IElite {
  ver: string;
  code: string;
}

export class OpDefElite {
  public _id: string;
  public oid: string;
  public ver: string;
  public code: string;

  constructor();
  constructor(opdefe:IOpDefElite);
  constructor(opdefe?: any) {
    this._id = opdefe && opdefe._id || undefined;
    this.oid = opdefe && opdefe.oid || '';
    this.ver = opdefe && opdefe.ver || '';
    this.code = opdefe && opdefe.code || '';
  }

}

export interface IOpDefProfile extends IElite {
  ver: string;
  code: string;
  desc: string;
  opType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  bom: any;
  workDef: any;
  bor: any;
}

export class OpDefProfile {
  public _id: string;
  public oid: string;
  public ver: string;
  public desc: string;
  public opType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public bom: any;
  public workDef: any;
  public bor: any;

  constructor();
  constructor(opdefp:IOpDefProfile);
  constructor(opdefp?: any) {
    this._id = opdefp && opdefp._id || undefined;
    this.oid = opdefp && opdefp.oid || '';
    this.ver = opdefp && opdefp.ver || '';
    this.desc = opdefp && opdefp.desc || '';
    this.opType = opdefp && opdefp.opType || '';
    this.hs = opdefp && opdefp.hs || undefined;
    this.pubDate = opdefp && opdefp.pubDate || new Date();
    this.bom = opdefp && opdefp.bom || undefined;
    this.workDef = opdefp && opdefp.workDef || undefined;
    this.bor = opdefp && opdefp.bor || undefined;
  }

}
