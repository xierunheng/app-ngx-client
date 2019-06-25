import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IEnclassElite } from './enclass';
import { IEnergyElite, IEnergyDefinition, EnergyElite } from './endef';
import { IEnDataElite } from './endata';

//MongoDB里的EnergySub Schema

export interface IEnSub {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  datas: IEnDataElite[];
  enclass: IEnclassElite;
  endef: IEnergyElite;
}

export class EnSub {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public datas: IEnDataElite[];
  public enclass: IEnclassElite;
  public endef: IEnergyElite;

  constructor();
  constructor(ens: IEnSub);
  constructor(ens?: any) {
    this._id = ens && ens._id ||  undefined;
    this.oid = ens && ens.oid ||  '';
    this.desc = ens && ens.desc ||  '';
    this.hs = ens && ens.hs ||  undefined;
    this.prop = ens && ens.prop ||  [];
    this.datas = ens && ens.datas || [];
    this.enclass = ens && ens.eclass || undefined;
    this.endef = ens && ens.endef || undefined;
  }

  //从单个的 Material 中继承相关属性，默认 Material 一般是单选的
  public DeriveFromEndef(en: IEnergyDefinition) {
    this.hs = en.hs;
    this.prop = en.prop;
    this.enclass = en.enclass[0];
    this.endef = new EnergyElite(en);
  }

  public GetEnSubElite() {
    return new EnSubElite(this);
  }

  public GetEnSubProfile() {
    return new EnSubProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的EnergySub Schema
export interface IEnSubElite extends IElite{

}

export class EnSubElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ense: IEnSubElite);
  constructor(ense?: any) {
    this._id = ense && ense._id || undefined;
    this.oid = ense && ense.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的EnergySub Schema
export interface IEnSubProfile extends IElite{
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  enclass: IEnclassElite;
  endef: IEnSubElite;
  prop: IResProp[];
}

export class EnSubProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public enclass: IEnclassElite;
  public endef: IEnergyElite;
  public prop: IResProp[];

  constructor();
  constructor(ensp: IEnSubProfile);
  constructor(ensp?: any) {
    this._id = ensp && ensp._id || undefined;
    this.oid = ensp && ensp.oid || '';
    this.desc = ensp && ensp.desc ||  '';
    this.hs = ensp && ensp.hs ||  undefined;
    this.enclass = ensp && ensp.enclass || undefined;
    this.endef = ensp && ensp.endef || undefined;
    this.prop = ensp && ensp.prop ||  [];
  }
}
