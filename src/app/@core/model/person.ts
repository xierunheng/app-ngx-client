import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IPclass, PclassElite, IPclassElite } from './pclass';
import { IMlotProfile } from './mlot';

export interface IUsedName {
  name: string;
  deadline: Date;
}

export interface IPerson {
  _id: string;
  oid: string;
  name: string;
  code: string;
  desc: string;
  mobile: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  pclass: IPclassElite[];
  psubs: IElite[];
  //成型工领用的模具批次
  molds: IMlotProfile[];
  barcodes:IMlotProfile[];
  usedName: IUsedName[];
}

//MongoDB里的Person Schema
export class Person {
  public _id: string;
  public oid: string;
  public name: string;
  public code: string;
  public desc: string;
  public mobile: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public pclass: IPclassElite[];
  public psubs: IElite[];
  public molds: IMlotProfile[];
  public barcodes: IMlotProfile[];
  public usedName: IUsedName[];

  constructor();
  constructor(p: IPerson);
  constructor(p?: any) {
    this._id = p && p._id || undefined;
    this.oid = p && p.oid || '';
    this.name = p && p.name || '';
    this.code = p && p.code || undefined;
    this.desc = p && p.desc || '';
    this.mobile = p && p.mobile || undefined;
    this.hs = p && p.hs || undefined;
    this.prop = p && p.prop || [];
    this.pclass = p && p.pclass || [];
    this.psubs = p && p.psubs || [];
    this.molds = p && p.molds || [];
    this.barcodes = p && p.barcodes || [];
    this.usedName = p && p.usedName || [];
  }

  //从多个Pclass中继承相关属性，
  //TODO: 已经转移到service中，后续可以删除了
  public DeriveFromPclasss(pcs: IPclass[]) {
    if (pcs && pcs.length > 0) {
      this.hs = pcs[0].hs;
      pcs.forEach((value, index, array) => {
        this.prop = _.unionBy(this.prop, value.prop, '_id');
      });
      this.pclass = pcs.map((value, index, array) => {
        return new PclassElite(value);
      })
    }
  }

  public GetProfile() {
    return new PersonProfile(this);
  }
}

export interface IPersonElite extends IElite {
  name: string;
  code: string;
  mobile: string;
}

export class PersonElite {
  public _id: string;
  public oid: string;
  public name: string;
  public code: string;
  public mobile: string;

  constructor();
  constructor(pe: IPersonElite);
  constructor(pe?: any) {
    this._id = pe && pe._id || undefined;
    this.oid = pe && pe.oid || '';
    this.name = pe && pe.name || '';
    this.code = pe && pe.code || '';
    this.mobile = pe && pe.mobile || '';
  }
}

//MongoDB中其他Schema中可能引用的Person Schema
export interface IPersonProfile extends IPersonElite {
  desc: string;
  hs: IHierarchyScope;
  pclass: IPclassElite[];
}

export class PersonProfile {
  public _id: string;
  public oid: string;
  public name: string;
  public code: string;
  public desc: string;
  public mobile: string;
  public hs: IHierarchyScope;
  public pclass: IPclassElite[];

  constructor();
  constructor(pp: IPersonProfile);
  constructor(pp?: any) {
    this._id = pp && pp._id || undefined;
    this.oid = pp && pp.oid || '';
    this.name = pp && pp.name || '';
    this.code = pp && pp.code || '';
    this.desc = pp && pp.desc || '';
    this.mobile = pp && pp.mobile || '';
    this.hs = pp && pp.hs || undefined;
    this.pclass = pp && pp.pclass || [];
  }
}
