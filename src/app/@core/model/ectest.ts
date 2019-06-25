import { IHierarchyScope } from './hs';
import { IEclassElite, IEclass } from './eclass';
import { IEquipment, EquipmentElite, IEquipmentElite } from './equipment';
import { IElite, IResProp, IResult, Result } from './common';
import { IParameter, Parameter } from './parameter';
import { IECapTestSpecElite } from './ectest-spec';

export interface IECapTest {
  _id: string;
  oid: string;
  ectSpec: IECapTestElite;
  desc: string;
  tester: string;
  testTime: Date;
  prop: IResProp[];
  imgs: String[];
  reason: IParameter[];
  result: IResult;
  loc: IHierarchyScope;
  hs: IHierarchyScope;
}

export class ECapTest {
  public _id: string;
  public oid: string;
  public ectSpec: IECapTestElite;
  public desc: string;
  public tester: string;
  public testTime: Date;
  public prop: IResProp[];
  public imgs: String[];
  public reason: IParameter[];
  public result: IResult;
  public loc: IHierarchyScope;
  public hs: IHierarchyScope;

  constructor();
  constructor(ecapt: IECapTest);
  constructor(ecapt?: any) {
    this._id = ecapt && ecapt._id || undefined;
    this.oid = ecapt && ecapt.oid || '';
    this.ectSpec = ecapt && ecapt.mtSpec || undefined;
    this.desc = ecapt && ecapt.desc || '';
    this.desc = ecapt && ecapt.desc || '';
    this.tester = ecapt && ecapt.tester || '';
    this.testTime = ecapt && ecapt.testTime || new Date();
    this.prop = ecapt && ecapt.prop || [];
    this.reason = ecapt && ecapt.reason || [new Parameter()];
    this.result = ecapt && ecapt.result || new Result();
    this.imgs = ecapt && ecapt.imgs || [];
    this.loc = ecapt && ecapt.loc || undefined;
    this.hs = ecapt && ecapt.hs || undefined;
  }
}

export interface IECapTestElite {
  _id: string;
  oid: string;
}

export class ECapTestElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ecapte: IECapTestElite);
  constructor(ecapte?: any) {
    this._id = ecapte && ecapte._id || undefined;
    this.oid = ecapte && ecapte.oid || '';
  }
}

export interface IECapTestProfile {
  _id: string;
  oid: string;
  ectSpec: IECapTestSpecElite;
}

export class ECapTestProfile {
  public _id: string;
  public oid: string;
  public ectSpec: IECapTestSpecElite;

  constructor();
  constructor(ecaptp: IECapTestProfile);
  constructor(ecaptp?: any) {
    this._id = ecaptp && ecaptp._id || undefined;
    this.oid = ecaptp && ecaptp.oid || '';
    this.ectSpec = ecaptp && ecaptp.ectSpec || undefined;
  }
}






