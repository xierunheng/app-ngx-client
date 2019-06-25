import * as moment from 'moment';
import { IHierarchyScope } from './hs';
import { IPersonnelCap, IEquipmentCap, IMaterialCap, IElite } from './common';

//MongoDB里的WorkMasterCapability Schema
export interface IProsegCapability {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  proseg: any;
  capType: string;
  reason: string;
  startTime: Date;
  endTime: Date;
  pCap: IPersonnelCap[];
  eCap: IEquipmentCap[];
  mCap: IMaterialCap[];
}

export class ProsegCapability {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public proseg: any;
  public capType: string;
  public reason: string;
  public startTime: Date;
  public endTime: Date;
  public pCap: IPersonnelCap[];
  public eCap: IEquipmentCap[];
  public mCap: IMaterialCap[];

  constructor();
  constructor(psc:IProsegCapability);
  constructor(psc?: any) {
    this._id = psc && psc._id || undefined;
    this.oid = psc && psc.oid || '';
    this.desc = psc && psc.desc || '';
    this.hs = psc && psc.hs || undefined;
    this.proseg = psc && psc.proseg || undefined;
    this.capType = psc && psc.capType || '';
    this.reason = psc && psc.reason || '';
    this.startTime = psc && psc.startTime || moment();
    this.endTime = psc && psc.endTime || undefined;
    this.pCap = psc && psc.pCap || [];
    this.eCap = psc && psc.eCap || [];
    this.mCap = psc && psc.mCap || [];
  }

  public GetElite() {
    return new ProsegCapabilityElite(this);
  }
}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IProsegCapabilityElite extends IElite {
}

export class ProsegCapabilityElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(psce: IProsegCapabilityElite);
  constructor(psce?: any) {
    this._id = psce && psce._id || undefined;
    this.oid = psce && psce.oid || '';
  }

}

export interface IProsegCapProfile extends IElite {
  desc: string;
  hs: IHierarchyScope;
  proseg: any;
  capType: string;
  reason: string;
  startTime: Date;
  endTime: Date;
}

export class ProsegCapProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public proseg: any;
  public capType: string;
  public reason: string;
  public startTime: Date;
  public endTime: Date;

  constructor();
  constructor(pscp: IProsegCapProfile);
  constructor(pscp?: any) {
    this._id = pscp && pscp._id || undefined;
    this.oid = pscp && pscp.oid || '';
    this.desc = pscp && pscp.desc || '';
    this.hs = pscp && pscp.hs || undefined;
    this.proseg = pscp && pscp.proseg || undefined;
    this.capType = pscp && pscp.capType || '';
    this.reason = pscp && pscp.reason || '';
    this.startTime = pscp && pscp.startTime || moment();
    this.endTime = pscp && pscp.endTime || undefined;
  }

}
