import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IPersonnelSpec,
  IEquipmentSpec, IMaterialSpec,
  IQuantity, Quantity, IElite } from './common';
import { IOpseg,
  IOpsegProfile, OpsegProfile, IOpDefElite } from './op-def';
import { IProsegElite } from './proseg';

//MongoDB里的WorkMaster Schema
export interface IWorkMaster{
  _id: string;
  oid: string;
  ver: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  duration: IQuantity;
  // duration: number;
  // unit: string;
  opDef: IOpDefElite;
  opseg: IElite;
  proseg: IProsegElite;
  pSpec: IPersonnelSpec[];
  eSpec: IEquipmentSpec[];
  mSpec: IMaterialSpec[];
  para: IParameter[];
  wfSpec: any[];
}

export class WorkMaster{
  public _id: string;
  public oid: string;
  public ver: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public duration: IQuantity;
  // public duration: number;
  // public unit: string;
  public opDef: IOpDefElite;
  public opseg: IElite;
  public proseg: IProsegElite;
  public pSpec: IPersonnelSpec[];
  public eSpec: IEquipmentSpec[];
  public mSpec: IMaterialSpec[];
  public para: IParameter[];
  public wfSpec: any[];

  constructor();
  constructor(wm: IWorkMaster);
  constructor(wm?: any) {
    this._id = wm && wm._id || undefined;
    this.oid = wm && wm.oid || '';
    this.ver = wm && wm.ver || '';
    this.desc = wm && wm.desc || '';
    this.workType = wm && wm.workType || '';
    this.hs = wm && wm.hs || undefined;
    this.pubDate = wm && wm.pubDate || undefined;
    this.duration = wm && wm.duration || new Quantity();
    this.opDef = wm && wm.opDef || undefined;
    this.opseg = wm && wm.opseg || undefined;
    this.proseg = wm && wm.proseg || undefined;
    this.pSpec = wm && wm.pSpec || [];
    this.eSpec = wm && wm.eSpec || [];
    this.mSpec = wm && wm.mSpec || [];
    this.para = wm && wm.para || [];
    this.wfSpec = wm && wm.wfSpec || [];
  }

  public GetElite() {
    return new WorkMasterElite(this);
  }

}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IWorkMasterElite extends IElite {
  ver: string;
  proseg: IProsegElite;
  //为了能及时找到 WorkMaster 和 Opseg  的对应关系，把该关系放到关键信息中,
  //以便随时查找,
  opDef: IOpDefElite;
}

export class WorkMasterElite {
  public _id: string;
  public oid: string;
  public ver: string;
  public proseg: IProsegElite;
  public opDef: IOpDefElite;

  constructor();
  constructor(wme: IWorkMasterElite);
  constructor(wme?: any) {
    this._id = wme && wme._id || undefined;
    this.oid = wme && wme.oid || '';
    this.ver = wme && wme.ver || '';
    this.proseg = wme && wme.proseg || undefined;
    this.opDef = wme && wme.opDef || undefined;
  }
}

export interface IWorkMasterProfile extends IElite {
  oid: string;
  ver: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  duration: IQuantity;
  proseg: IProsegElite;
  //为了能及时找到 WorkMaster 和 Opseg  的对应关系，把该关系放到关键信息中,
  //以便随时查找,
  opDef: IOpDefElite;
  opseg: IElite;
}

export class WorkMasterProfile {
  public _id: string;
  public oid: string;
  public ver: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public duration: IQuantity;
  public proseg: IProsegElite;
  public opDef: IOpDefElite;
  public opseg: IElite;

  constructor();
  constructor(wmp: IWorkMasterProfile);
  constructor(wmp?: any) {
    this._id = wmp && wmp._id || undefined;
    this.oid = wmp && wmp.oid || '';
    this.ver = wmp && wmp.ver || '';
    this.desc = wmp && wmp.desc || '';
    this.workType = wmp && wmp.workType || '';
    this.hs = wmp && wmp.hs || undefined;
    this.pubDate = wmp && wmp.pubDate || undefined;
    this.duration = wmp && wmp.duration || new Quantity();
    this.opDef = wmp && wmp.opDef || undefined;
    this.opseg = wmp && wmp.opseg || undefined;
    this.proseg = wmp && wmp.proseg || undefined;
  }
}
