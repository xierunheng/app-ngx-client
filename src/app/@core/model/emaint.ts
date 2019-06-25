import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IEclass, EclassElite, IEclassElite } from './eclass';
import { IEquipmentElite, IEquipment, IEquipmentProfile, EquipmentElite } from './equipment';
import { IPersonElite } from './person';
import { IMsubLotProfile } from './msublot';
import { IJobOrderElite } from './job-order';
import { IParameter, Parameter } from './parameter';

export interface IMOpLog {
  op: string;
  hs: IHierarchyScope;
  person: IPersonElite;
  subLot: IMsubLotProfile;
  date: Date;
  jr: IJobOrderElite;
  reason: IParameter[];
}

export class MOpLog {
  public op: string;
  public hs: IHierarchyScope;
  public person: IPersonElite;
  public subLot: IMsubLotProfile;
  public date: Date;
  public jr: IJobOrderElite;
  public reason: IParameter[];

  constructor();
  constructor(m: IMOpLog);
  constructor(m?: any) {
    this.op = m && m.op || '';
    this.hs = m && m.hs ||  undefined;
    this.person = m && m.person || undefined;
    this.subLot = m && m.subLot || undefined;
    this.date = m && m.date || undefined;
    this.jr = m && m.jr || undefined;
    this.reason = m && m.reason || [new Parameter()];
  }
}

//MongoDB里的Equipment Schema

export interface IEMaint {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  moplog: IMOpLog[];
  eclass: IEclassElite[];
  equipment: IEquipmentElite;
}

export class EMaint {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public moplog: IMOpLog[];
  public eclass: IEclassElite[];
  public equipment: IEquipmentElite;

  constructor();
  constructor(em: IEMaint);
  constructor(em?: any) {
    this._id = em && em._id ||  undefined;
    this.oid = em && em.oid ||  '';
    this.desc = em && em.desc ||  undefined;
    this.hs = em && em.hs ||  undefined;
    this.prop = em && em.prop ||  [];
    this.moplog = em && em.moplog || [];
    this.eclass = em && em.eclass ||  [];
    this.equipment = em && em.equipment || undefined;
  }

    //从单个的 Enwuipment 中继承相关属性，默认 Equipment 一般是单选的
  public DeriveFromEdef(e: IEquipment) {
    this.hs = e.hs;
    this.prop = e.prop;
    this.eclass = e.eclass;
    this.equipment = new EquipmentElite(e);
  }

  public GetElite() {
    return new EMaintElite(this);
  }

  public GetProfile() {
    return new EMaintProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEMaintElite extends IElite{

}

export class EMaintElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(ee: IEMaintElite);
  constructor(ee?: any) {
    this._id = ee && ee._id || undefined;
    this.oid = ee && ee.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEMaintProfile extends IEMaintElite{
  desc: string;
  hs: IHierarchyScope;
  eclass: IEclassElite[];
  equipment: IEquipmentElite;
}

export class EMaintProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public eclass: IEclassElite[];
  public equipment: IEquipmentElite;

  constructor();
  constructor(ep: IEMaintProfile);
  constructor(ep?: any) {
    this._id = ep && ep._id || undefined;
    this.oid = ep && ep.oid || '';
    this.desc = ep && ep.desc ||  undefined;
    this.hs = ep && ep.hs ||  undefined;
    this.eclass = ep && ep.eclass || undefined;
    this.equipment = ep && ep.equipment || undefined;
  }
}
