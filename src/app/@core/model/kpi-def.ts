import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IQuantity, Quantity, IElite, IRange,Range, ITimeRange, TimeRange,IResProp } from './common';


/**
 * OrderDefiniton Schema
 */
export interface IKpiDef {
  _id: string;
  oid: string;
  name:string;
  desc: string;
  scope: string[];
  formula: string;
  unit: string;
  range: IRange;
  trend: string;
  timing: string[];
  audience: string[];
  prodMethodology: string[];
  effectModel: string;
  notes: string;
  usesKpiDefinition: IKpiDefElite[];
  kpi: IElite[];
  prop: IResProp;
}

export class KpiDef {
  public _id: string;
  public oid: string;
  public name:string;
  public desc: string;
  public scope: string[];
  public formula: string;
  public unit: string;
  public range: IRange;
  public trend: string;
  public timing: string[];
  public timeRange: ITimeRange;
  public audience: string[];
  public prodMethodology: string[];
  public effectModel: string;
  public notes: string;
  public usesKpiDefinition: IKpiDefElite[];
  public kpi: IElite[];
  public prop: IResProp;

  constructor();
  constructor(kpid: IKpiDef);
  constructor(kpid?: any) {
    this._id = kpid && kpid._id || undefined;
    this.oid = kpid && kpid.oid || '';
    this.name = kpid && kpid.name || '';
    this.desc = kpid && kpid.desc || '';
    this.scope = kpid && kpid.scope || [];
    this.formula = kpid && kpid.formula || '';
    this.unit = kpid && kpid.unit || '';
    this.range = kpid && kpid.range || new Range();
    this.trend = kpid && kpid.trend || '';
    this.timing = kpid && kpid.timing || [];
    this.timeRange = kpid && kpid.timeRange || new TimeRange() ;
    this.audience = kpid && kpid.audience || [];
    this.prodMethodology = kpid && kpid.prodMethodology || [];
    this.effectModel = kpid && kpid.effectModel || '';
    this.notes = kpid && kpid.notes || '';
    this.usesKpiDefinition = kpid && kpid.usesKpiDefinition || [];
    this.kpi = kpid && kpid.kpi || [];
    this.prop = kpid && kpid.prop || [];
  }
}

//Mongodb中其他Schema中可能引用的OpSeg Schema
export interface IKpiDefElite {
  _id: string;
  oid: string;
  name: string;
}

export class KpiDefElite {
  public _id: string;
  public oid: string;
  public name: string;

  constructor();
  constructor(kpide: IKpiDefElite);
  constructor(kpide?: any) {
    this._id = kpide && kpide._id || undefined;
    this.oid = kpide && kpide.oid || '';
    this.name = kpide && kpide.name || '';
  }
}

export interface IKpiDefProfile {
  oid: string;
  desc: string;
  name: string
  scope: string[];
  formula: string;
}

export class KpiDefProfile {
  public _id: string;
  public oid: string;
  public name: string;
  public desc: string;
  public scope: string[];
  public formula: string;

  constructor();
  constructor(kpidp: IKpiDefProfile);
  constructor(kpidp?: any) {
    this._id = kpidp && kpidp._id || undefined;
    this.oid = kpidp && kpidp.oid || '';
    this.name = kpidp && kpidp.name || '';
    this.desc = kpidp && kpidp.desc || '';
    this.scope = kpidp && kpidp.scope || [];
    this.formula = kpidp && kpidp.formula || '';
  }
}
