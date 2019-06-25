import { IHierarchyScope } from './hs';
import {IPersonnelCap, PersonnelCap,
  IEquipmentCap, EquipmentCap,
  IMaterialCap, MaterialCap, IElite} from './common';
import { IWorkMaster, WorkMasterElite } from './work-master';

//MongoDB里的WorkMasterCapability Schema
export interface IWmCapability {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  wm: any;
  capType: string;
  reason: string;
  startTime: Date;
  endTime: Date;
  pCap: IPersonnelCap[];
  eCap: IEquipmentCap[];
  mCap: IMaterialCap[];
}

export class WmCapability {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public wm: any;
  public capType: string;
  public reason: string;
  public startTime: Date;
  public endTime: Date;
  public pCap: IPersonnelCap[];
  public eCap: IEquipmentCap[];
  public mCap: IMaterialCap[];

  constructor();
  constructor(wmc: IWmCapability);
  constructor(wmc?: any) {
    this._id = wmc && wmc._id || undefined;
    this.oid = wmc && wmc.oid || '';
    this.desc = wmc && wmc.desc || '';
    this.hs = wmc && wmc.hs || undefined;
    this.wm = wmc && wmc.wm || undefined;
    this.capType = wmc && wmc.capType || '';
    this.reason = wmc && wmc.reason || '';
    this.startTime = wmc && wmc.startTime || undefined;
    this.endTime = wmc && wmc.endTime || undefined;
    this.pCap = wmc && wmc.pCap || [];
    this.eCap = wmc && wmc.eCap || [];
    this.mCap = wmc && wmc.mCap || [];
  }

  //从单个的 WorkMaster 中继承相关属性，默认 WorkMaster 一般是单选的
  public DeriveFromSingleWorkMaster(wm: IWorkMaster) {
    this.hs = wm.hs;
    this.wm = new WorkMasterElite(wm);
    this.pCap = wm.pSpec.map((value, index, array) => { return new PersonnelCap(value); } );
    this.eCap = wm.eSpec.map((value, index, array) => { return new EquipmentCap(value); } );
    this.mCap = wm.mSpec.map((value, index, array) => { return new MaterialCap(value); } );
  }

  public GetElite() {
    return new WmCapabilityElite(this);
  }
}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IWmCapabilityElite extends IElite {
}

export class WmCapabilityElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(wmce: IWmCapabilityElite);
  constructor(wmce?: any) {
    this._id = wmce && wmce._id || undefined;
    this.oid = wmce && wmce.oid || '';
  }

}

export interface IWmCapabilityProfile extends IElite {
  desc: string;
  hs: IHierarchyScope;
  wm: any;
  capType: string;
  reason: string;
  startTime: Date;
  endTime: Date;
}

export class WmCapabilityProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public wm: any;
  public capType: string;
  public reason: string;
  public startTime: Date;
  public endTime: Date;

  constructor();
  constructor(wmcp: IWmCapabilityProfile);
  constructor(wmcp?: any) {
    this._id = wmcp && wmcp._id || undefined;
    this.oid = wmcp && wmcp.oid || '';
    this.desc = wmcp && wmcp.desc || '';
    this.hs = wmcp && wmcp.hs || undefined;
    this.capType = wmcp && wmcp.capType || '';
    this.reason = wmcp && wmcp.reason || '';
    this.startTime = wmcp && wmcp.startTime || undefined;
    this.endTime = wmcp && wmcp.endTime || undefined;
  }

}
