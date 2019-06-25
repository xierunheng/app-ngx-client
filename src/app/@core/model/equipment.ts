import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IEclass, EclassElite, IEclassElite } from './eclass';
import { IEsubElite } from './esub';


//MongoDB里的Equipment Schema

export interface IEquipment {
  _id: string;
  oid: string;
  name: string;
  supplier: any;
  desc: string;
  hs: IHierarchyScope;
  status: string;
  prop: IResProp[];
  eclass: IEclassElite[];
  esubs: IEsubElite[];
}

export class Equipment {
  public _id: string;
  public oid: string;
  public name: string;
  public supplier: any;
  public desc: string;
  public hs: IHierarchyScope;
  public status: string;
  public prop: IResProp[];
  public eclass: IEclassElite[];
  public esubs:IEsubElite[];

  constructor();
  constructor(e: IEquipment);
  constructor(e?: any) {
    this._id = e && e._id ||  undefined;
    this.oid = e && e.oid ||  '';
    //开始怀疑初始化的问题了，我们要不要给某个参数一个初始化的值？
    //如果它确实没有，我们不能适意的加，这样会妨碍 patch
    this.name = e && e.name ||  undefined;
    this.supplier = e && e.supplier || undefined;
    this.desc = e && e.desc ||  '';
    this.hs = e && e.hs ||  undefined;
    this.status = e && e.status || undefined;
    this.prop = e && e.prop ||  [];
    this.eclass = e && e.eclass ||  [];
    this.esubs = e && e.esubs || [];
  }


  public GetElite() {
    return new EquipmentElite(this);
  }

  public GetProfile() {
    return new EquipmentProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEquipmentElite extends IElite{
  name: string;
  // supplier: string;
}

export class EquipmentElite {
  public _id: string;
  public oid: string;
  public name: string;
  // public supplier: string;

  constructor();
  constructor(ee: IEquipmentElite);
  constructor(ee?: any) {
    this._id = ee && ee._id || undefined;
    this.oid = ee && ee.oid || '';
    this.name = ee && ee.name || '';
    // this.supplier = ee && ee.supplier || '';
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEquipmentProfile extends IEquipmentElite{
  eclass: IEclassElite[];
  hs: IHierarchyScope;
  supplier: any;
}

export class EquipmentProfile {
  public _id: string;
  public oid: string;
  public eclass:IEclassElite[];
  public hs: IHierarchyScope;
  public supplier: any;

  constructor();
  constructor(ep: IEquipmentProfile);
  constructor(ep?: any) {
    this._id = ep && ep._id || undefined;
    this.oid = ep && ep.oid || '';
    this.eclass = ep && ep.eclass || [];
    this.hs = ep && ep.hs || undefined;
    this.supplier = ep && ep.supplier || undefined;
  }
}
