import { IHierarchyScope } from './hs';
import { IMclassElite, IMclass } from './mclass';
import { IMdef, MdefElite, IMdefElite } from './mdef';
import { IMlotElite, MlotElite } from './mlot';
import { IMsubLotElite, MsubLotElite } from './msublot';
import { IResProp, IResult, Result } from './common';
import { IParameter, Parameter } from './parameter';
import { IMTestSpecElite } from './mtest-spec';

export interface IMTest {
  _id: string;
  oid: string;
  mtSpec: IMTestSpecElite;
  desc: string;
  tester: string;
  testTime: Date;
  sampleOid: String;
  sampleSpec: String;
  mlot: IMlotElite;
  msublot: IMsubLotElite;
  prop: IResProp[];
  reason: IParameter[];
  result: IResult;
  imgs: String[];
  loc: IHierarchyScope;
  hs: IHierarchyScope;
}

export class MTest {
  public _id: string;
  public oid: string;
  public mtSpec: IMTestSpecElite;
  public desc: string;
  public tester: string;
  public testTime: Date;
  public sampleOid: String;
  public sampleSpec: String;
  public mlot: IMlotElite;
  public msublot: IMsubLotElite;
  public prop: IResProp[];
  public reason: IParameter[];
  public result: IResult;
  public imgs: String[];
  public loc: IHierarchyScope;
  public hs: IHierarchyScope;

  constructor();
  constructor(mt: IMTest);
  constructor(mt?: any) {
    this._id = mt && mt._id || undefined;
    this.oid = mt && mt.oid || '';
    this.mtSpec = mt && mt.mtSpec || undefined;
    this.desc = mt && mt.desc || '';
    this.tester = mt && mt.tester || '';
    this.testTime = mt && mt.testTime || new Date();
    this.sampleOid = mt && mt.sampleOid || '';
    this.sampleSpec = mt && mt.sampleSpec || '';
    this.mlot = mt && mt.mlot || new MlotElite();
    this.msublot = mt && mt.msublot || new MsubLotElite();
    this.prop = mt && mt.prop || [];
    this.reason = mt && mt.reason || [new Parameter()];
    this.result = mt && mt.result || new Result();
    this.imgs = mt && mt.imgs || [];
    this.loc = mt && mt.loc || undefined;
    this.hs = mt && mt.hs || undefined;
  }
}

export interface IMTestElite {
  _id: string;
  oid: string;
}

export class MTestElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(mte: IMTestElite);
  constructor(mte?: any) {
    this._id = mte && mte._id || undefined;
    this.oid = mte && mte.oid || '';
  }
}

export interface IMTestProfile {
  _id: string;
  oid: string;
  mtSpec: IMTestSpecElite;
}

export class MTestProfile {
  public _id: string;
  public oid: string;
  public mtSpec: IMTestSpecElite;

  constructor();
  constructor(mtp: IMTestProfile);
  constructor(mtp?: any) {
    this._id = mtp && mtp._id || undefined;
    this.oid = mtp && mtp.oid || '';
    this.mtSpec = mtp && mtp.mtSpec || undefined;
  }
}


