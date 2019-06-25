import { IHierarchyScope } from './hs';
import { IResProp } from './common';
import { IEnergyProfile } from './endef';

export interface IEnclass {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  endefs: IEnergyProfile[];
}

//MongoDB里的EnergyClass Schema
export class Enclass {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public endefs: IEnergyProfile[];

  constructor();
  constructor(enc: IEnclass);
  constructor(enc?: any) {
    this._id = enc && enc._id || undefined;
    this.oid = enc && enc.oid ||  '';
    this.desc = enc && enc.desc ||  '';
    this.hs = enc && enc.hs ||  undefined;
    this.prop = enc && enc.prop ||  [];
    this.endefs = enc && enc.endefs ||  [];
  }

  public GetElite(): EnclassElite {
    return new EnclassElite(this);
  }
}

//Mongodb中其他Schema中可能引用的EnergyClass Schema
export interface IEnclassElite {
  _id: string;
  oid: string;
}

export class EnclassElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ence: IEnclassElite);
  constructor(ence?: any) {
    this._id = ence && ence._id || undefined;
    this.oid = ence && ence.oid || '';
  }

}

//Mongodb中其他Schema中可能引用的EnergyClass Schema
export interface IEnclassProfile {
  oid: string;
  desc: string;
  hs: IHierarchyScope;
}

export class EnclassProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;

  constructor();
  constructor(encp: IEnclassProfile);
  constructor(encp?: any) {
    this._id = encp && encp._id || undefined;
    this.oid = encp && encp.oid || '';
    this.desc = encp && encp.desc || '';
    this.hs = encp && encp.hs ||  undefined;
  }

}
