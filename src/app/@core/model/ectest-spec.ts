import { IHierarchyScope } from './hs';
import { IEclassElite, IEclass } from './eclass';
import { IEquipment, EquipmentElite, IEquipmentElite } from './equipment';
import { IElite, IResProp, IResult, Result } from './common';
import { IParameter, Parameter } from './parameter';


export interface IECapTestSpec {
  _id: string;
  oid: string;
  name: string;
  desc: string;
  ver: string;
  tester: string;
  reason: IParameter[];
  result: IResult;
  loc: IHierarchyScope;
  hs: IHierarchyScope;
  testedEclassProp: IEClassProp[];
  testedEquipmentProp: IEquipmentProp[];
}

export class ECapTestSpec {
  public _id: string;
  public oid: string;
  public name: string;
  public desc: string;
  public ver: string;
  public tester: string;
  public reason: IParameter[];
  public result: IResult;
  public loc: IHierarchyScope;
  public hs: IHierarchyScope;
  public testedEclassProp: IEClassProp[];
  public testedEquipmentProp: IEquipmentProp[];

  constructor();
  constructor(ecapts: IECapTestSpec);
  constructor(ecapts?: any) {
    this._id = ecapts && ecapts._id || undefined;
    this.oid = ecapts && ecapts.oid || '';
    this.name = ecapts && ecapts.name || '';
    this.desc = ecapts && ecapts.desc || '';
    this.tester = ecapts && ecapts.tester || '';
    this.reason = ecapts && ecapts.reason || [new Parameter()];
    this.result = ecapts && ecapts.result || new Result();
    this.loc = ecapts && ecapts.loc || undefined;
    this.hs = ecapts && ecapts.hs || undefined;
    this.testedEclassProp = ecapts && ecapts.testedEclassProp || [];
    this.testedEquipmentProp = ecapts && ecapts.testedEquipmentProp || [];
  }
}

export interface IECapTestSpecElite {
  _id: string;
  oid: string;
  name: string;
  ver: string;
}

export class ECapTestSpecElite {
  public _id: string;
  public oid: string;
  public name:string;
  public ver: string;

  constructor();
  constructor(ecaptse: IECapTestSpecElite);
  constructor(ecaptse?: any) {
    this._id = ecaptse && ecaptse._id || undefined;
    this.oid = ecaptse && ecaptse.oid || '';
    this.name = ecaptse && ecaptse.name || '';
    this.ver = ecaptse && ecaptse.ver || '';
  }
}

export interface IECapTestSpecProfile {
  _id: string;
  oid: string;
  ver: string;
}

export class ECapTestSpecProfile {
  public _id: string;
  public oid: string;
  public ver: string;

  constructor();
  constructor(ecaptsp: IECapTestSpecProfile);
  constructor(ecaptsp?: any) {
    this._id = ecaptsp && ecaptsp._id || undefined;
    this.oid = ecaptsp && ecaptsp.oid || '';
    this.ver = ecaptsp && ecaptsp.ver || '';
  }
}

export interface IEClassProp {
  eclass: IEclassElite;
  prop:  IElite;
}

export class EClassProp {
  public eclass: IEclassElite;
  public prop: IElite;

  constructor();
  constructor(ectsp: IEClassProp);
  constructor(ectsp?:any){
    this.eclass = ectsp && ectsp.eclass || '';
    this.prop = ectsp && ectsp.prop || '';
  }
}


export interface IEquipmentProp {
  equipment: IEquipmentElite;
  prop: IElite;
}

export class EquipmentProp {
  public equipment: IEquipmentElite;
  public prop: IElite;

  constructor();
  constructor(etsp: IEquipmentProp);
  constructor(etsp?:any){
    this.equipment = etsp && etsp.equipment || '';
    this.prop = etsp && etsp.prop || '';
  }
}




