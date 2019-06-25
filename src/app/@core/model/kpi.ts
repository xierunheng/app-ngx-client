import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IQuantity, Quantity, IElite, IRange, ITimeRange, IResProp } from './common';
import { IKpiDefElite, IKpiDef, KpiDefElite } from './kpi-def'


/**
 * OrderDefiniton Schema
 */
export interface IKpi {
  _id: string;
  oid: string;
  name:string;
  desc: string;
  hs: IHierarchyScope;
  formula: string;
  unit: string;
  range: IRange;
  resourceRef: IElite;
  trend: string;
  timing: string;
  timeRange: ITimeRange;
  audience: string;
  prodMethodology: string;
  effectModel: string;
  notes: string;
  usesKpi: IElite;
  kpiDefinition: IKpiDefElite
  kpiValue: IElite;
  prop: IResProp;
}

export class Kpi {
  public _id: string;
  public oid: string;
  public name:string;
  public desc: string;
  public hs: IHierarchyScope;
  public formula: string;
  public unit: string;
  public range: IRange;
  public resourceRef: IElite;
  public trend: string;
  public timing: string;
  public timeRange: ITimeRange;
  public audience: string;
  public prodMethodology: string;
  public effectModel: string;
  public notes: string;
  public usesKpi: IElite;
  public kpiDefinition: IKpiDefElite
  public kpiValue: IElite;
  public prop: IResProp;

  constructor();
  constructor(kpi: IKpi);
  constructor(kpi?: any) {
    this._id = kpi && kpi._id || undefined;
    this.oid = kpi && kpi.oid || '';
    this.name = kpi && kpi.name || '';
    this.desc = kpi && kpi.desc || '';
    this.hs = kpi && kpi.hs || undefined;
    this.formula = kpi && kpi.formula || '';
    this.unit = kpi && kpi.unit || '';
    this.range = kpi && kpi.range || [];
    this.resourceRef = kpi && kpi.resourceRef || undefined;
    this.trend = kpi && kpi.trend || '';
    this.timing = kpi && kpi.timing || '';
    this.timeRange = kpi && kpi.timeRange || undefined;
    this.audience = kpi && kpi.audience || '';
    this.prodMethodology = kpi && kpi.prodMethodology || '';
    this.effectModel = kpi && kpi.effectModel || '';
    this.notes = kpi && kpi.notes || '';
    this.usesKpi = kpi && kpi.usesKpiDefinition || undefined;
    this.kpiDefinition = kpi && kpi.kpiDefinition || undefined;
    this.kpiValue = kpi && kpi.kpiValue || [];
    this.prop = kpi && kpi.prop || [];

  }

  /**
   * 从操作定义 KpiDefinition 继承相关的属性
   * @param {IKpiDef} od [OpDefinition选项]
   * @param {string} reqOid [OpRequest OID]
   */
  public DeriveFromKpiDef(kpid: IKpiDef) {
    this.formula = kpid.formula;
    this.unit = kpid.unit;
    this.range = kpid.range;
    this.trend = kpid.trend;
    this.kpiDefinition = new KpiDefElite(kpid);
  }
}

//Mongodb中其他Schema中可能引用的OpSeg Schema
export interface IKpiElite {
  _id: string;
  oid: string;
}

export class KpiElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(kpie: IKpiElite);
  constructor(kpie?: any) {
    this._id = kpie && kpie._id || undefined;
    this.oid = kpie && kpie.oid || '';
  }
}

export interface IKpiProfile {
  oid: string;
  desc: string;
  name: string
  hs: IHierarchyScope;
  formula: string;
}

export class KpiProfile {
  public _id: string;
  public oid: string;
  public name: string;
  public desc: string;
  public hs: IHierarchyScope;
  public formula: string;

  constructor();
  constructor(kpip: IKpiProfile);
  constructor(kpip?: any) {
    this._id = kpip && kpip._id || undefined;
    this.oid = kpip && kpip.oid || '';
    this.name = kpip && kpip.name || '';
    this.desc = kpip && kpip.desc || '';
    this.hs = kpip && kpip.hs || undefined;
    this.formula = kpip && kpip.formula || '';
  }
}
