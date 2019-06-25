import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IResProp, IElite, Quantity, IQuantity } from './common';
import { IEclassElite } from './eclass';
import { IEquipmentElite, IEquipment, IEquipmentProfile, EquipmentElite } from './equipment';
import { IEDataElite } from './edata';
import { IEOpLog } from './base/oplog';

//MongoDB里的Equipment Schema

export interface IEsub {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  status: string;
  prop: IResProp[];
  qty: IQuantity;
  ngqty: IQuantity;
  oplog: IEOpLog[];
  datas: IEDataElite[];
  eclass: IEclassElite[];
  equipment: IEquipmentElite;
  setupTime: Date;
}

export class Esub {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public status: string;
  public prop: IResProp[];
  public qty: IQuantity;
  public ngqty: IQuantity;
  public oplog: IEOpLog[];
  public datas: IEDataElite[];
  public eclass: IEclassElite[];
  public equipment: IEquipmentElite;
  public setupTime: Date;

  constructor();
  constructor(es: IEsub);
  constructor(es?: any) {
    this._id = es && es._id ||  undefined;
    this.oid = es && es.oid ||  '';
    this.desc = es && es.desc ||  '';
    this.hs = es && es.hs ||  undefined;
    this.status = es && es.status || '';
    this.prop = es && es.prop ||  [];
    this.qty = es && es.qty || new Quantity({
      quantity: 0,
      unit: '件',
    });
    this.ngqty = es && es.ngqty || new Quantity({
      quantity: 0,
      unit: '件',
    });
    this.oplog = es && es.oplog || [];
    this.datas = es && es.datas || [];
    this.eclass = es && es.eclass ||  [];
    this.equipment = es && es.equipment || undefined;
    this.setupTime = es && es.setupTime || undefined;
  }

  //从单个的 Enwuipment 中继承相关属性，默认 Equipment 一般是单选的
  public DeriveFromEdef(e: IEquipment) {
    this.hs = e.hs;
    this.prop = e.prop;
    this.eclass = e.eclass;
    this.equipment = new EquipmentElite(e);
  }


  public GetElite() {
    return new EsubElite(this);
  }

  public GetProfile() {
    return new EsubProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEsubElite extends IElite{
  eclass: IEclassElite[];
  equipment: IEquipmentElite;
}

export class EsubElite {
  public _id: string;
  public oid: string;
  public eclass: IEclassElite[];
  public equipment: IEquipmentElite;

  constructor();
  constructor(ese: IEsubElite);
  constructor(ese?: any) {
    this._id = ese && ese._id || undefined;
    this.oid = ese && ese.oid || '';
    this.eclass = ese && ese.eclass || [];
    this.equipment = ese && ese.equipment || undefined;
  }
}

//MongoDB中其他Schema中可能引用的Equipment Schema
export interface IEsubProfile extends IElite{
  desc: string;
  hs: IHierarchyScope;
  eclass: IEclassElite[];
  equipment: IEquipmentElite;
  prop: IResProp[];
}

export class EsubProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public eclass: IEclassElite[];
  public equipment: IEquipmentElite;
  public prop: IResProp[];

  constructor();
  constructor(esp: IEsubProfile);
  constructor(esp?: any) {
    this._id = esp && esp._id || undefined;
    this.oid = esp && esp.oid || '';
    this.desc = esp && esp.desc ||  '';
    this.hs = esp && esp.hs ||  undefined;
    this.eclass = esp && esp.eclass || undefined;
    this.equipment = esp && esp.equipment || undefined;
    this.prop = esp && esp.prop || undefined;
  }
}
