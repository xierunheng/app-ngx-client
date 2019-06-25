import { nextCode } from '../utils/util';

import { MaterialData } from '../data/util.service';
import { Quantity, IQuantity, IResProp, IElite } from './common';
import { IHierarchyScope } from './hs';
import { IMclassElite, IMclass } from './mclass';
import { IMdef, MdefElite, IMdefElite } from './mdef';
import { IMsubLotElite } from './msublot';
import { IPersonElite } from './person';
import { IOrderElite } from './order';


//MongoDB里的MaterialLot Schema
export interface IMlot {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  mclass: IMclassElite[];
  mdef: IMdefElite;
  status: string;
  prop: IResProp[];
  supplier: any;
  subLots: IMsubLotElite[];
  loc: IHierarchyScope;
  qty: IQuantity;
  subQty: IQuantity;
  assLot: any[];
  assSubLot: any[];
  assType: string;
  assRel: string;
  order: IOrderElite;
  molder: IPersonElite;
}

export class Mlot {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public mclass: IMclassElite[];
  public mdef: IMdefElite;
  public status: string;
  public prop: IResProp[];
  public supplier: any;
  public subLots: IMsubLotElite[];
  public loc: IHierarchyScope;
  public qty: IQuantity;
  public subQty: IQuantity;
  public assLot: any[];
  public assSubLot: any[];
  public assType: string;
  public assRel: string;
  public order: IOrderElite;
  public molder: IPersonElite;

  constructor();
  constructor(ml: IMlot);
  constructor(ml?: any) {
    this._id = ml && ml._id || undefined;
    this.oid = ml && ml.oid || '';
    this.desc = ml && ml.desc || '';
    this.hs = ml && ml.hs || undefined;
    this.mclass = ml && ml.mclass || [];
    this.mdef = ml && ml.mdef || undefined;
    this.status = ml && ml.status || MaterialData.statuses[0];
    this.prop = ml && ml.prop || [];
    this.supplier = ml && ml.supplier || {
      oid: '传奇',
      code: 'CG',
    };
    this.subLots = ml && ml.subLots || [];
    this.loc = ml && ml.loc || undefined;
    this.qty = ml && ml.qty || {
      quantity: 1,
      unit: '件'
    };
    this.subQty = ml && ml.subQty || {
      quantity: 0,
      unit: '件'
    };
    this.assLot = ml && ml.asslot || [];
    this.assSubLot = ml && ml.assSublot || [];
    this.assType = ml && ml.assType || MaterialData.assemblyTypes[0];
    this.assRel = ml && ml.assRel || MaterialData.assemblyRelations[0];
    this.order = ml && ml.order || undefined;
    this.molder = ml && ml.molder || undefined;
  }

  public get Prex() {
    if (this.mclass && this.mclass.length > 0) {
      let hscode = this.hs ? this.hs.code || '00' : '00';
      let scode = this.supplier ? this.supplier.code : 'CG';
      return hscode + scode + this.mclass[0].code;
    }
    return '';
  }

  //从单个的 Material 中继承相关属性，默认 Material 一般是单选的
  public DeriveFromMdef(m: IMdef) {
    this.hs = m.hs;
    this.prop = m.prop;
    this.mclass = m.mclass;
    this.mdef = new MdefElite(m);
    this.assType = m.assType;
    this.assRel = m.assRel;
  }

  public GetElite() {
    return new MlotElite(this);
  }
}

//MongoDB中其他Schema中可能引用的MaterialLotlElite Schema
export interface IMlotElite extends IElite {
  mdef: IMdefElite;
  qty: IQuantity;
}

export class MlotElite {
  public _id: string;
  public oid: string;
  public mdef: IMdefElite;
  public qty: IQuantity;

  constructor();
  constructor(mle: IMlotElite);
  constructor(mle?: any) {
    this._id = mle && mle._id || undefined;
    this.oid = mle && mle.oid || '';
    this.mdef = mle && mle.mdef || undefined;
    this.qty = mle && mle.qty || undefined;
  }
}

/**
 * Mlot 的 Elite + Context
 * up for Mclass & Mdef, down for Msublot
 */
export interface IMlotProfile extends IMlotElite {
  hs: IHierarchyScope;
  mclass: IMclassElite[];
  mdef: IMdefElite;
  loc: IHierarchyScope;
  qty: IQuantity;
  subQty: IQuantity;
  subLots: IMsubLotElite[];
  status: string;
}

export class MlotProfile {
  public _id: string;
  public oid: string;
  public hs: IHierarchyScope;
  public mclass: IMclassElite[];
  public mdef: IMdefElite;
  public loc: IHierarchyScope;
  public qty: IQuantity;
  public subQty: IQuantity;
  public subLots: IMsubLotElite[];
  public status: string;

  constructor();
  constructor(mlp: IMlotProfile);
  constructor(mlp?: any) {
    this._id = mlp && mlp._id || undefined;
    this.oid = mlp && mlp.oid || '';
    this.hs = mlp && mlp.hs || undefined;
    this.mclass = mlp && mlp.mclass || [];
    this.mdef = mlp && mlp.mdef || undefined;
    this.loc = mlp && mlp.loc || undefined;
    this.qty = mlp && mlp.qty || undefined;
    this.subQty = mlp && mlp.subQty || undefined;
    this.subLots = mlp && mlp.subLots || [];
    this.status = mlp && mlp.status || undefined;
  }
}
