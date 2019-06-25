import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IPAElite } from './physical-asset';

export interface IPaclass {
  _id: string;
  oid: string;
  code: string;
  desc: string;
  hs: IHierarchyScope;
  manufacture: any;
  prop: IResProp[];
  physicalAssets: IPAElite[];
  paCapTestSpec: IElite[];
}

export class Paclass {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;
  public manufacture: any;
  public prop: IResProp[];
  public physicalAssets: IPAElite[];
  public paCapTestSpec: IElite[];

  constructor();
  constructor(pac: IPaclass);
  constructor(pac?: any) {
    this._id = pac && pac._id || undefined;
    this.oid = pac && pac.oid || '';
    this.code = pac && pac.code || undefined;
    this.desc = pac && pac.desc || '';
    this.hs = pac && pac.hs || undefined;
    this.manufacture = pac && pac.manufacture || undefined;
    this.prop = pac && pac.prop || [];
    this.physicalAssets = pac && pac.physicalAssets || [];
    this.paCapTestSpec = pac && pac.paCapTestSpec || [];
  }

  public GetElite(): PaclassElite {
    return new PaclassElite(this);
  }
}

//Mongodb中其他Schema中可能引用的EquipmentClass Schema
export interface IPaclassElite {
  _id: string;
  oid: string;
//  code: string;
}

export class PaclassElite {
  public _id: string;
  public oid: string;
//  public code: string;

  constructor();
  constructor(pae: IPaclassElite);
  constructor(pae?: any) {
    this._id = pae && pae._id || undefined;
    this.oid = pae && pae.oid || '';
//    this.code = pe && pe.code || '';
  }
}

export interface IPaclassProfile extends IPaclassElite {
  code: string;
  desc: string;
  hs: IHierarchyScope;
  physicalAssets: IPAElite[];
}

export class PaclassProfile {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;
  public physicalAssets: IPAElite[];

  constructor();
  constructor(pap: IPaclassProfile);
  constructor(pap?: any) {
    this._id = pap && pap._id || undefined;
    this.oid = pap && pap.oid || '';
    this.code = pap && pap.code || '';
    this.desc = pap && pap.desc || '';
    this.hs = pap && pap.hs || undefined;
    this.physicalAssets = pap && pap.physicalAssets || [];
  }
}
