import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite, IQuantity, Quantity} from './common';
import { IEclass, EclassElite, IEclassElite } from './eclass';
import { IEquipmentElite } from './equipment';
import { IEsub, EsubElite, IEsubElite } from './esub';

//MongoDB里的Equipment Schema
export interface IEquipmentData {
  _id: string;
  oid: string;
  name: string;
  unit: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  esub: IEsubElite;
  eclass: IEclass[];
  equipment: IEquipmentElite;
  startTime: Date;
  endTime: Date;
  duration: IQuantity;
  metrics: any;
}

export class EquipmentData {
  public _id: string;
  public oid: string;
  public name: string;
  public unit: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public esub: IEsubElite;
  public eclass: IEclass[];
  public equipment: IEquipmentElite;
  public startTime: Date;
  public endTime: Date;
  public duration: IQuantity;
  public metrics: any;


  constructor();
  constructor(ed: IEquipmentData);
  constructor(ed?: any) {
    this._id = ed && ed._id ||  undefined;
    this.oid = ed && ed.oid ||  '';
    this.name = ed && ed.name || '';
    this.unit = ed && ed.unit || '';
    this.desc = ed && ed.desc || '';
    this.hs = ed && ed.hs || undefined;
    this.prop = ed && ed.prop || undefined;
    this.esub = ed && ed.esub || undefined;
    this.eclass = ed && ed.eclass || [];
    this.equipment = ed && ed.equipment || undefined;
    this.startTime = ed && ed.startTime || undefined;
    this.endTime = ed && ed.endTime || undefined;
    this.duration = ed && ed.duration || new Quantity();
    this.metrics = ed && ed.metrics || undefined;
  }

  //从单个的 Esub 中继承相关属性
  public DeriveFromEsub(es: IEsub) {
    this.hs = es.hs;
    this.prop = es.prop;
    this.esub = new EsubElite(es);
  }

  public DeriveFromData(data: any[]) {
    if(data && data.length > 0) {
      this.startTime = new Date(_.first(data)[0]);
      this.endTime = new Date(_.last(data)[0]);
      this.metrics = data;
    }
  }

  public GetElite() {
    return new EDataElite(this);
  }

  public GetProfile() {
    return new EDataProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEDataElite extends IElite{

}

export class EDataElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ede: IEDataElite);
  constructor(ede?: any) {
    this._id = ede && ede._id || undefined;
    this.oid = ede && ede.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEDataProfile extends IEDataElite{
  name: string;
  metrics: any;
}

export class EDataProfile {
  public _id: string;
  public oid: string;
  public name: string;
  public metrics: any;

  constructor();
  constructor(edp: IEDataProfile);
  constructor(edp?: any) {
    this._id = edp && edp._id || undefined;
    this.oid = edp && edp.oid || '';
    this.name = edp && edp.name || '';
    this.metrics = edp && edp.metrics || [];
  }
}
