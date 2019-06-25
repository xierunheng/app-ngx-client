import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IEnSubElite } from './ensub';
import { IEnclass, EnclassElite, IEnclassElite } from './enclass';

//MongoDB里的EnergyDefinition Schema

export interface IEnergyDefinition {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  ensubs: IEnSubElite[];
  enclass: IEnclassElite[];
}

export class EnergyDefinition {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public ensubs: IEnSubElite[];
  public enclass: IEnclassElite[];

  constructor();
  constructor(en: IEnergyDefinition);
  constructor(en?: any) {
    this._id = en && en._id ||  undefined;
    this.oid = en && en.oid ||  '';
    this.desc = en && en.desc ||  '';
    this.hs = en && en.hs ||  undefined;
    this.prop = en && en.prop ||  [];
    this.ensubs = en && en.ensubs || [];
    this.enclass = en && en.enclass ||  [];
  }

  //从多个Enclass中继承相关属性，
  public DeriveFromEnclasss(encs: IEnclass[]) {
    this.hs = encs[0].hs;
    encs.forEach((value, index, array) => {
      this.prop = _.unionBy(this.prop, value.prop, '_id');
      });
    this.enclass = encs.map((value, index, array) => {
      return new EnclassElite(value);
    })
  }

  public GetElite() {
    return new EnergyElite(this);
  }

  public GetProfile() {
    return new EnergyProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的EnergyDefinition Schema
export interface IEnergyElite extends IElite{

}

export class EnergyElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ene: IEnergyElite);
  constructor(ene?: any) {
    this._id = ene && ene._id || undefined;
    this.oid = ene && ene.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的EnergyDefinition Schema
export interface IEnergyProfile extends IEnergyElite{
  enclass: IEnclassElite[];
  hs: IHierarchyScope;
  oid: string;
  desc: string;
}

export class EnergyProfile {
  public _id: string;
  public oid: string;
  public enclass:IEnclassElite[];
  public hs: IHierarchyScope;
  public desc: string;

  constructor();
  constructor(enp: IEnergyProfile);
  constructor(enp?: any) {
    this._id = enp && enp._id || undefined;
    this.oid = enp && enp.oid || '';
    this.desc = enp && enp.desc ||  '';
    this.enclass = enp && enp.eclass || [];
    this.hs = enp && enp.hs || undefined;
  }
}
