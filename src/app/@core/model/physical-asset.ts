import { IHierarchyScope } from './hs';
import { IResProp, IElite, IEquipmentAssetMapping } from './common';
import { IPaclass, IPaclassElite, PaclassElite } from './paclass';
import { IEsubElite } from './esub';
import * as _ from 'lodash';

export interface IPhysicalAsset {
  _id: string;
  oid: string;
  name: string;
  desc: string;
  hs: IHierarchyScope;
  loc: IHierarchyScope;
  fixedAssetID:string;
  vendorID:string;
  eaMapping: IEquipmentAssetMapping;
  prop: IResProp[];
  paclass: IPaclassElite[];
  paCapTestSpec: IElite[];
}

export class PhysicalAsset {
  public _id: string;
  public oid: string;
  public name: string;
  public desc: string;
  public hs: IHierarchyScope;
  public loc: IHierarchyScope;
  public fixedAssetID:string;
  public vendorID:string;
  public eaMapping: IEquipmentAssetMapping;
  public prop: IResProp[];
  public paclass: IPaclassElite[];
  public paCapTestSpec: IElite[];

  constructor();
  constructor(pa: IPhysicalAsset);
  constructor(pa?: any) {
    this._id = pa && pa._id || undefined;
    this.oid = pa && pa.oid || '';
    this.name = pa && pa.name || '';
    this.desc = pa && pa.desc || '';
    this.hs = pa && pa.hs || undefined;
    this.loc = pa && pa.loc || undefined;
    this.fixedAssetID = pa && pa.fixedAssetID || undefined;
    this.vendorID = pa && pa.vendorID || undefined;
    this.eaMapping = pa && pa.eaMapping || [];
    this.prop = pa && pa.prop || [];
    this.paclass = pa && pa.paclass || [];
    this.paCapTestSpec = pa && pa.paCapTestSpec || [];
  }

  public DeriveFromPaclasss(pacs: IPaclass[]) {
    if (pacs && pacs.length > 0) {
      this.hs = pacs[0].hs;
      pacs.forEach((value, index, array) => {
        this.prop = _.unionBy(this.prop, value.prop, '_id');
      });
      this.paclass = pacs.map((value, index, array) => {
        return new PaclassElite(value);
      })
    }
  }

  public GetProfile() {
    return new PAProfile(this);
  }
}

export interface IPAElite {
  _id: string;
  oid: string;
  name: string;
}

export class PAElite {
  public _id: string;
  public oid: string;
  public name: string;

  constructor();
  constructor(pq: IPAElite);
  constructor(pa?: any) {
    this._id = pa && pa._id || undefined;
    this.oid = pa && pa.oid || '';
    this.name = pa && pa.name || '';
  }
}

export interface IPAProfile extends IPAElite {
  desc: string;
  hs: IHierarchyScope;
  loc: IHierarchyScope;
  fixedAssetID:string;
  vendorID:string;
  paclass: IPaclassElite[];
}

export class PAProfile{
  public _id: string;
  public oid: string;
  public name: string;
  public desc: string;
  public hs: IHierarchyScope;
  public loc: IHierarchyScope;
  public fixedAssetID:string;
  public vendorID:string;
  public paclass: IPaclassElite[];

  constructor();
  constructor(pap: IPAProfile);
  constructor(pap?: any) {
    this._id = pap && pap._id || undefined;
    this.oid = pap && pap.oid || '';
    this.name = pap && pap.name || '';
    this.desc = pap && pap.desc || '';
    this.hs = pap && pap.hs || undefined;
    this.loc = pap && pap.loc || undefined;
    this.fixedAssetID = pap && pap.fixedAssetID || undefined;
    this.vendorID = pap && pap.vendorID || undefined;
    this.paclass = pap && pap.paclass || [];
  }
}
