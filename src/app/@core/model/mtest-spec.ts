import { IHierarchyScope } from './hs';
import { IMclassElite, IMclass } from './mclass';
import { IMdef, MdefElite, IMdefElite } from './mdef';
import { IMlotElite } from './mlot';
import { IElite, IResProp, IResult, Result } from './common';
import { IParameter, Parameter } from './parameter';

export interface IMTestSpec {
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
  testedMclassProp: IMClassProp[];
  testedMdefProp: IMDefProp[];
  testedMlotProp: IMLotProp[];
}

export class MTestSpec {
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
  public testedMclassProp: IMClassProp[];
  public testedMdefProp: IMDefProp[];
  public testedMlotProp: IMLotProp[];

  constructor();
  constructor(mt: IMTestSpec);
  constructor(mt?: any) {
    this._id = mt && mt._id || undefined;
    this.oid = mt && mt.oid || '';
    this.name = mt && mt.name || '';
    this.desc = mt && mt.desc || '';
    this.ver = mt && mt.ver || '';
    this.tester = mt && mt.tester || '';
    this.reason = mt && mt.reason || [new Parameter()];
    this.result = mt && mt.result || new Result();
    this.loc = mt && mt.loc || undefined;
    this.hs = mt && mt.hs || undefined;
    this.testedMclassProp = mt && mt.testedMclassProp || [];
    this.testedMdefProp = mt && mt.testedMdefProp || [];
    this.testedMlotProp = mt && mt.testedMlotProp || [];
  }
}

export interface IMTestSpecElite {
  _id: string;
  oid: string;
  name: string;
  ver: string;
}

export class MTestSpecElite {
  public _id: string;
  public oid: string;
  public name: string;
  public ver: string;

  constructor();
  constructor(mte: IMTestSpecElite);
  constructor(mte?: any) {
    this._id = mte && mte._id || undefined;
    this.oid = mte && mte.oid || '';
    this.name = mte && mte.name || '';
    this.ver = mte && mte.ver || '';
  }
}

export interface IMTestSpecProfile {
  _id: string;
  oid: string;
  ver: string;
}

export class MTestSpecProfile {
  public _id: string;
  public oid: string;
  public ver: string;

  constructor();
  constructor(mtp: IMTestSpecProfile);
  constructor(mtp?: any) {
    this._id = mtp && mtp._id || undefined;
    this.oid = mtp && mtp.oid || '';
    this.ver = mtp && mtp.ver || '';
  }
}

export interface IMClassProp {
  mclass: IMclassElite;
  prop: IElite;
}

export class MClassProp {
  public mclass: IMclassElite;
  public prop: IElite;

  constructor();
  constructor(mcp: IMClassProp);
  constructor(mcp?: any) {
    this.mclass = mcp && mcp.mclass || undefined;
    this.prop = mcp && mcp.prop || undefined;
  }
}

export interface IMDefProp {
  mdef: IMdefElite;
  prop: IElite;
}

export class MDefProp {
  public mdef: IMdefElite;
  public prop: IElite;

  constructor();
  constructor(mdp: IMDefProp);
  constructor(mdp?: any) {
    this.mdef = mdp && mdp.mdef || undefined;
    this.prop = mdp && mdp.prop || undefined;
  }
}

export interface IMLotProp {
  mlot: IMlotElite;
  prop: IElite;
}

export class MLotProp {
  public mlot: IMlotElite;
  public prop: IElite;

  constructor();
  constructor(mlp: IMLotProp);
  constructor(mlp?: any) {
    this.mlot = mlp && mlp.mlot || undefined;
    this.prop = mlp && mlp.prop || undefined;
  }
}


