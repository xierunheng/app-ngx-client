import { IHierarchyScope } from './hs';
import { IPersonnelCap, IEquipmentCap, IMaterialCap } from './common';
import { IWmCapability } from './wm-cap';

//MongoDB里的WorkCapability Schema
export interface IWorkCapability {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  capType: string;
  reason: string;
  conFactor: number;
  startTime: Date;
  endTime: Date;
  pubDate: Date;
  pCap: IPersonnelCap[];
  eCap: IEquipmentCap[];
  mCap: IMaterialCap[];
  wmCap: IWmCapability[];
}

export class WorkCapability {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public capType: string;
  public reason: string;
  public conFactor: number;
  public startTime: Date;
  public endTime: Date;
  public pubDate: Date;
  public pCap: IPersonnelCap[];
  public eCap: IEquipmentCap[];
  public mCap: IMaterialCap[];
  public wmCap: IWmCapability[];

  constructor();
  constructor(wc: IWorkCapability);
  constructor(wc?: any) {
    this._id = wc && wc._id || undefined;
    this.oid = wc && wc.oid || '';
    this.desc = wc && wc.desc || '';
    this.hs = wc && wc.hs || undefined;
    this.capType = wc && wc.capType || '';
    this.reason = wc && wc.reason || '';
    this.conFactor = wc && wc.conFactor || 1;
    this.startTime = wc && wc.startTime || undefined;
    this.endTime = wc && wc.endTime || undefined;
    this.pubDate = wc && wc.pubDate || undefined;
    this.pCap = wc && wc.pCap || [];
    this.eCap = wc && wc.eCap || [];
    this.mCap = wc && wc.mCap || [];
    this.wmCap = wc && wc.wmCap || [];
  }

  public GetElite() {
    return new WorkCapabilityElite(this);
  }
}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IWorkCapabilityElite {
  _id: string;
  oid: string;
}

export class WorkCapabilityElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(wce: IWorkCapabilityElite);
  constructor(wce?: any) {
    this._id = wce && wce._id || undefined;
    this.oid = wce && wce.oid || '';
  }
}

export interface IWorkCapProfile {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  capType: string;
  reason: string;
  conFactor: number;
  startTime: Date;
  endTime: Date;
  pubDate: Date;
}

export class WorkCapProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public capType: string;
  public reason: string;
  public conFactor: number;
  public startTime: Date;
  public endTime: Date;
  public pubDate: Date;

  constructor();
  constructor(wcp: IWorkCapProfile);
  constructor(wcp?: any) {
    this._id = wcp && wcp._id || undefined;
    this.oid = wcp && wcp.oid || '';
    this.desc = wcp && wcp.desc || '';
    this.hs = wcp && wcp.hs || undefined;
    this.capType = wcp && wcp.capType || '';
    this.reason = wcp && wcp.reason || '';
    this.conFactor = wcp && wcp.conFactor || 1;
    this.startTime = wcp && wcp.startTime || undefined;
    this.endTime = wcp && wcp.endTime || undefined;
    this.pubDate = wcp && wcp.pubDate || undefined;
  }
}
