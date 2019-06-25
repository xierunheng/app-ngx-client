import { IHierarchyScope } from './hs';
import { IResProp } from './common';
import { IEquipmentProfile } from './equipment';

export interface IEclass {
  _id: string;
  oid: string;
  code: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  equipments: IEquipmentProfile[];
}

//MongoDB里的EquipmentClass Schema
export class Eclass {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public equipments: IEquipmentProfile[];

  constructor();
  constructor(ec: IEclass);
  constructor(ec?: any) {
    this._id = ec && ec._id || undefined;
    this.oid = ec && ec.oid ||  '';
    this.code = ec && ec.code ||  '';
    this.desc = ec && ec.desc ||  '';
    this.hs = ec && ec.hs ||  undefined;
    this.prop = ec && ec.prop ||  [];
    this.equipments = ec && ec.equipments ||  [];
  }

  public GetElite(): EclassElite {
    return new EclassElite(this);
  }
}

//Mongodb中其他Schema中可能引用的EquipmentClass Schema
export interface IEclassElite {
  _id: string;
  oid: string;
  code: string;
}

export class EclassElite {
  public _id: string;
  public oid: string;
  public code: string;

  constructor();
  constructor(ece: IEclassElite);
  constructor(ece?: any) {
    this._id = ece && ece._id || undefined;
    this.oid = ece && ece.oid || '';
    this.code = ece && ece.code || '';
  }

}

//Mongodb中其他Schema中可能引用的EquipmentClass Schema
export interface IEclassProfile {
  _id: string;
  oid: string;
  code: string;
  desc: string;
  hs: IHierarchyScope;
}

export class EclassProfile {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;

  constructor();
  constructor(ecp: IEclassProfile);
  constructor(ecp?: any) {
    this._id = ecp && ecp._id || undefined;
    this.oid = ecp && ecp.oid || '';
    this.code = ecp && ecp.code || '';
    this.desc = ecp && ecp.desc || '';
    this.hs = ecp && ecp.hs ||  undefined;
  }

}
