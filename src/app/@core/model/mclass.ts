import { IHierarchyScope } from './hs';
import { IElite, IResProp } from './common';
import { MdefElite, IMdefElite } from './mdef';
import { MaterialData } from '../data/util.service';

export interface IMclass {
  _id: string;
  oid: string;
  code: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  assClasss: IMclassElite[];
  assType: string;
  assRel: string;
  mdefs: IMdefElite[];
}

//MongoDB里的MaterialClass Schema
export class Mclass {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public assClasss: IMclassElite[];
  public assType: string;
  public assRel: string;
  public mdefs: IMdefElite[];

  constructor();
  constructor(mc: IMclass);
  constructor(mc?: any) {
    this._id = mc && mc._id ||  undefined;
    this.oid = mc && mc.oid ||   '';
    this.code = mc && mc.code || '';
    this.desc = mc && mc.desc || '';
    this.hs = mc && mc.hs || undefined;
    this.prop = mc && mc.prop || [];
    this.assClasss = mc && mc.assClasss || [];
    this.assType = mc && mc.assType || MaterialData.assemblyTypes[0];
    this.assRel = mc && mc.assRel || MaterialData.assemblyRelations[0];
    this.mdefs = mc && mc.mdefs || [];
  }

  public GetElite(): IMclassElite {
    // return new MclassElite(this);
    return {
      _id: this._id,
      oid: this.oid,
      code: this.code,
    };
  }
}

//Mongodb中其他Schema中可能引用的MaterialClass Schema
export interface IMclassElite extends IElite {
  code: string;
}

export class MclassElite {
  public _id: string;
  public oid: string;
  public code: string;

  constructor();
  constructor(mce: IMclassElite);
  constructor(mce?: any) {
    this._id = mce && mce._id || undefined;
    this.oid = mce && mce.oid || '';
    this.code = mce && mce.code || '';
  }
}

export interface IMclassProfile extends IMclassElite {
  desc: string;
  hs: IHierarchyScope;
  assType: string;
  assRel: string;
}

export class MclassProfile {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;
  public assType: string;
  public assRel: string;

  constructor();
  constructor(mcp: IMclassProfile);
  constructor(mcp?: any) {
    this._id = mcp && mcp._id || undefined;
    this.oid = mcp && mcp.oid || '';
    this.code = mcp && mcp.code || '';
    this.desc = mcp && mcp.desc || '';
    this.hs = mcp && mcp.hs || undefined;
    this.assType = mcp && mcp.assType || MaterialData.assemblyTypes[0];
    this.assRel = mcp && mcp.assRel || MaterialData.assemblyRelations[0];
  }
}
