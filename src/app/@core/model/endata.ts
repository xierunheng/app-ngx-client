import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite, IQuantity, Quantity} from './common';
import { IEnSub, EnSubElite, IEnSubElite } from './ensub';

//MongoDB里的EnergyData Schema
export interface IEnergyData {
  _id: string;
  oid: string;
  name: string;
  unit: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  ensub: IEnSubElite;
  startTime: Date;
  endTime: Date;
  duration: IQuantity;
  metrics: any[];
}

export class EnergyData {
  public _id: string;
  public oid: string;
  public name: string;
  public unit: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public ensub: IEnSubElite;
  public startTime: Date;
  public endTime: Date;
  public duration: IQuantity;
  public metrics: any[];


  constructor();
  constructor(end: IEnergyData);
  constructor(end?: any) {
    this._id = end && end._id ||  undefined;
    this.oid = end && end.oid ||  '';
    this.name = end && end.name || '';
    this.unit = end && end.unit || '';
    this.desc = end && end.desc || '';
    this.hs = end && end.hs || undefined;
    this.prop = end && end.prop || undefined;
    this.ensub = end && end.ensub || undefined;
    this.startTime = end && end.startTime || undefined;
    this.endTime = end && end.endTime || undefined;
    this.duration = end && end.duration || new Quantity();
    this.metrics = end && end.metrics || undefined;
  }

  //从单个的 EnSub 中继承相关属性
  public DeriveFromEnsub(ens: IEnSub) {
    this.hs = ens.hs;
    this.prop = ens.prop;
    this.ensub = new EnSubElite(ens);
  }

  public DeriveFromData(data: any[]) {
    if(data && data.length > 0) {
      this.startTime = new Date(_.first(data)[0]);
      this.endTime = new Date(_.last(data)[0]);
      this.metrics = data;
    }
  }

  public GetElite() {
    return new EnDataElite(this);
  }

  public GetProfile() {
    return new EnDataProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的EnergyData Schema
export interface IEnDataElite extends IElite{

}

export class EnDataElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ende: IEnDataElite);
  constructor(ende?: any) {
    this._id = ende && ende._id || undefined;
    this.oid = ende && ende.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的EnergyData Schema
export interface IEnDataProfile extends IEnDataElite{
  name: string;
  metrics: any[];
  unit: string;
  desc: string;
  hs: IHierarchyScope;
  startTime: Date;
  endTime: Date;
  duration: IQuantity;
}

export class EnDataProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public name: string;
  public metrics: any[];
  public unit: string;
  public startTime: Date;
  public endTime: Date;
  public duration: IQuantity;

  constructor();
  constructor(endp: IEnDataProfile);
  constructor(endp?: any) {
    this._id = endp && endp._id || undefined;
    this.oid = endp && endp.oid || '';
    this.desc = endp && endp.desc || '';
    this.hs = endp && endp.hs || undefined;
    this.name = endp && endp.name || '';
    this.metrics = endp && endp.metrics || [];
    this.unit = endp && endp.unit || '';
    this.startTime = endp && endp.startTime || undefined;
    this.endTime = endp && endp.endTime || undefined;
    this.duration = endp && endp.duration || new Quantity();
  }
}
