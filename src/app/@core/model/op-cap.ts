import * as moment from 'moment';
import { IHierarchyScope } from './hs';
import { IPersonnelCap, IEquipmentCap, IMaterialCap } from './common';
import { IProsegCapability } from './proseg-cap';

//MongoDB里的OpCapability Schema
export interface IOpCapability {
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
  prosegCap: IProsegCapability[];
}

export class OpCapability {
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
  public prosegCap: IProsegCapability[];

  constructor();
  constructor(opc: IOpCapability)
  constructor(opc?: any) {
    this._id = opc && opc._id || undefined;
    this.oid = opc && opc.oid || '';
    this.desc = opc && opc.desc || '';
    this.hs = opc && opc.hs || undefined;
    this.capType = opc && opc.capType || '';
    this.reason = opc && opc.reason || '';
    this.conFactor = opc && opc.conFactor || 1;
    this.startTime = opc && opc.startTime || moment();
    this.endTime = opc && opc.endTime || undefined;
    this.pubDate = opc && opc.pubDate || moment();
    this.pCap = opc && opc.pCap || [];
    this.eCap = opc && opc.eCap || [];
    this.mCap = opc && opc.mCap || [];
    this.prosegCap = opc && opc.prosegCap || [];
  }

  public GetElite() {
    return new OpCapabilityElite(this);
  }
}

//Mongodb中其他Schema中可能引用的OpCapability Schema
export interface IOpCapabilityElite {
  _id: string;
  oid: string;
}

export class OpCapabilityElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(opce:IOpCapabilityElite);
  constructor(opce?: any) {
    this._id = opce && opce._id || undefined;
    this.oid = opce && opce.oid || '';
  }

}

export interface IOpCapabilityProfile extends OpCapabilityElite {
  desc: string;
  hs: IHierarchyScope;
  capType: string;
  reason: string;
  conFactor: number;
  startTime: Date;
  endTime: Date;
  pubDate: Date;
}

export class OpCapabilityProfile {
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
  constructor(opcp:IOpCapabilityProfile);
  constructor(opcp?: any) {
    this._id = opcp && opcp._id || undefined;
    this.oid = opcp && opcp.oid || '';
    this.desc = opcp && opcp.desc || '';
    this.hs = opcp && opcp.hs || undefined;
    this.capType = opcp && opcp.capType || '';
    this.reason = opcp && opcp.reason || '';
    this.conFactor = opcp && opcp.conFactor || 1;
    this.startTime = opcp && opcp.startTime || moment();
    this.endTime = opcp && opcp.endTime || undefined;
    this.pubDate = opcp && opcp.pubDate || moment();
  }

}
