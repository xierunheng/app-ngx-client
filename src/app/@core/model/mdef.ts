import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IElite, IResProp } from './common';
import { IMclass, MclassElite, IMclassElite } from './mclass';
import { GlobalData } from './global';
import { IValue, Value, Parameter,IParameter } from './parameter';
import { IMlotElite } from './mlot';
import { IPsub } from './psub';
import { IEsub } from './esub';
import { MaterialData } from '../data/util.service';

export interface IQuantity {
  quantity: number;
  unit: string;
}

export class Quantity{
  public quantity: number;
  public unit: string;

  constructor();
  constructor(q: IQuantity);
  constructor(q?:any){
    this.quantity = q && q.quantity || 0;
    this.unit = q && q.unit || '';
  }
}

export interface IMdef {
  _id: string;
  oid: string;
  code: string;
  desc: string;
  picUrl: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  lots: IMlotElite[];
  assDefs: IMdefProfile[];
  assType: string;
  assRel: string;
  mclass: IMclassElite[];
  rdlog:IMrd[];
}

//MongoDB里的Material Schema
export class Mdef {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public picUrl: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public lots: IMlotElite[];
  public assDefs: IMdefProfile[];
  public assType: string;
  public assRel: string;
  public mclass: IMclassElite[];
  public rdlog: IMrd[];

  constructor();
  constructor(m: IMdef);
  constructor(m?: any) {
    this._id = m && m._id || undefined;
    this.oid = m && m.oid || '';
    this.code = m && m.code || '';
    this.desc = m && m.desc || '';
    this.picUrl = m && m.picUrl || '';
    this.hs = m && m.hs || undefined;
    this.prop = m && m.prop || [];
    this.lots = m && m.lots || [];
    this.assDefs = m && m.assDefs || [];
    this.assType = m && m.assType || MaterialData.assemblyTypes[0];
    this.assRel = m && m.assRel || MaterialData.assemblyRelations[0];
    this.mclass = m && m.mclass || [];
    this.rdlog = m && m.rdlog || [];
  }

  //从多个Pclass中继承相关属性，
  public DeriveFromMclasses(mcs: IMclass[]) {
    this.hs = mcs[0].hs;
    mcs.forEach(item => {
      this.prop = _.unionBy(this.prop, item.prop, '_id');
    });
    this.mclass = mcs.map(item => {
      return new MclassElite(item);
    });
    this.assType = mcs[0].assType;
    this.assRel = mcs[0].assRel;
  }

  public GetElite() {
    return new MdefElite(this);
  }

  public importPara(paraName: string, value: IValue) {
    let para = GlobalData.paras.find(item => item.oid === paraName);
    if (para) {
      let prop = _.cloneDeep(para);
      prop.value = value;
      this.prop.push(prop);
    }
  }
}

//MongoDB中其他Schema中可能引用的Material Schema
export interface IMdefElite extends IElite {
  code: string;
}

export class MdefElite {
  public _id: string;
  public oid: string;
  public code: string;

  constructor();
  constructor(me: IMdefElite);
  constructor(me?: any) {
    this._id = me && me._id || undefined;
    this.oid = me && me.oid || '';
    this.code = me && me.code || '';
  }
}

//Material Definition 的 Elite + Context
export interface IMdefProfile extends IMdefElite {
  code: string;
  desc: string;
  hs: IHierarchyScope;
  mclass: IMclassElite[];
  assDefs: IMdefProfile[];
}

export class MdefProfile {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public hs: IHierarchyScope;
  public mclass: IMclassElite[];
  public assDefs: IMdefProfile[];

  constructor();
  constructor(mp: IMdefProfile);
  constructor(mp?: any) {
    this._id = mp && mp._id || undefined;
    this.oid = mp && mp.oid || '';
    this.code = mp && mp.code || '';
    this.desc = mp && mp.desc || '';
    this.hs = mp && mp.hs || undefined;
    this.mclass = mp && mp.mclass || [];
    this.assDefs = mp && mp.assDefs || [];
  }
}

//为订单而设的mdef 信息
export interface IMdefInfo extends IMdefElite {
  picUrl: string;
  desc: string;
}

export class MdefInfo {
  public _id: string;
  public oid: string;
  public picUrl: string;
  public desc: string;

  constructor();
  constructor(mi: IMdefInfo);
  constructor(mi?: any) {
    this._id = mi && mi._id || undefined;
    this.oid = mi && mi.oid || '';
    this.desc = mi && mi.desc || '';
    this.picUrl = mi && mi.picUrl || '';
  }
}

//模具开发记录
export interface IMrd {
  _id: string;
  oid: string;
  desc: string;
  process:IQuantity;
  imgs:string[];
  picUrl: string;
  hs: IHierarchyScope;
  date:Date;
  reason:IParameter;
  psub:IPsub;
  esub:IEsub;
  jr:IParameter;

}

//MongoDB里的Mrd Schema
export class Mrd {
  public _id: string;
  public oid: string;
  public desc: string;
  public process:IQuantity;
  public imgs:string[];
  public picUrl: string;
  public hs: IHierarchyScope;
  public date:Date;
  public reason:IParameter;
  public psub:IPsub;
  public esub:IEsub;
  public jr:IParameter;

  constructor();
  constructor(m: IMrd);
  constructor(m?: any) {
    this._id = m && m._id || undefined;
    this.oid = m && m.oid || '';
    this.desc = m && m.desc || '';
    this.process = m && m.process || new Quantity();
    this.imgs = m && m.imgs || [];
    this.picUrl = m && m.picUrl || '';
    this.hs = m && m.hs || undefined;
    this.date = m && m.date || new Date();
    this.reason = m && m.reason || undefined;
    this.psub = m && m.psub || undefined;
    this.esub = m && m.esub || undefined;
    this.jr = m && m.jr || undefined;
  }
}
