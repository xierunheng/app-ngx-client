import { IHierarchyScope } from './hs';
import { IPclass, IPclassElite } from './pclass';
import { IPerson, PersonElite, IPersonElite } from './person';
import { IResProp } from './common';

export interface IQTest {
  _id: string;
  oid: string;
  desc: string;
  ver: string;
  loc: IHierarchyScope;
  hs: IHierarchyScope;
  pclass: IPCTestProp[];
  person: IPersonTestProp[];
}

export class QTest {
  public _id: string;
  public oid: string;
  public desc: string;
  public ver: string;
  public loc: IHierarchyScope;
  public hs: IHierarchyScope;
  public pclass: IPCTestProp[];
  public person: IPersonTestProp[];

  constructor();
  constructor(qt: IQTest);
  constructor(qt?: any) {
    this._id = qt && qt._id || undefined;
    this.oid = qt && qt.oid || '';
    this.desc = qt && qt.desc || '';
    this.loc = qt && qt.loc || undefined;
    this.hs = qt && qt.hs || undefined;
    this.pclass = qt && qt.pclass || [];
    this.person = qt && qt.person || [];
  }
}

export interface IQTestElite {
  _id: string;
  oid: string;
}

export class QTestElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(qte: IQTestElite);
  constructor(qte?: any) {
    this._id = qte && qte._id || undefined;
    this.oid = qte && qte.oid || '';
  }
}

export interface IQTestProfile {
  _id: string;
  oid: string;
  ver: string;
}

export class QTestProfile {
  public _id: string;
  public oid: string;
  public ver: string;

  constructor();
  constructor(qtp: IQTestProfile);
  constructor(qtp?: any) {
    this._id = qtp && qtp._id || undefined;
    this.oid = qtp && qtp.oid || '';
    this.ver = qtp && qtp.ver || '';
  }
}

export interface IPCTestProp {
  pclass: IPclassElite;
  prop:  IResProp[];
}

export class ECTestProp {
  public pclass: IPclassElite[];
  public prop: IResProp[];

  constructor();
  constructor(pctp: IPCTestProp);
  constructor(pctp?:any){
    this.pclass = pctp && pctp.pclass || '';
    this.prop = pctp && pctp.prop || '';
  }
}


export interface IPersonTestProp {
  person: IPersonElite;
  prop: IResProp[];
}

export class EquipmentTestProp {
  public person: IPersonElite[];
  public prop: IResProp[];

  constructor();
  constructor(ptp: IPersonTestProp);
  constructor(ptp?:any){
    this.person = ptp && ptp.person || '';
    this.prop = ptp && ptp.prop || '';
  }
}




