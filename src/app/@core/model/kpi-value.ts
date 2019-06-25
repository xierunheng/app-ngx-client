import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IQuantity, Quantity, IElite, IRange, ITimeRange, IResProp } from './common';


/**
 * OrderDefiniton Schema
 */
export interface IKpiValue {
  _id: string;
  oid: string;
  name:string;
  desc: string;
  hs: IHierarchyScope;
  timeRange: ITimeRange;
  value: string;
  unit: string;
  kpi: IElite;
  prop: IResProp;
}

export class KpiValue {
  public _id: string;
  public oid: string;
  public name:string;
  public desc: string;
  public hs: IHierarchyScope;
  public timeRange: ITimeRange;
  public value: string;
  public unit: string;
  public kpi: IElite;
  public prop: IResProp;

  constructor();
  constructor(kpiv: IKpiValue);
  constructor(kpiv?: any) {
    this._id = kpiv && kpiv._id || undefined;
    this.oid = kpiv && kpiv.oid || '';
    this.name = kpiv && kpiv.name || '';
    this.desc = kpiv && kpiv.desc || '';
    this.hs = kpiv && kpiv.hs || undefined;
    this.timeRange = kpiv && kpiv.timeRange || undefined;
    this.value = kpiv && kpiv.value || '';
    this.unit = kpiv && kpiv.unit || '';
    this.kpi = kpiv && kpiv.kpi || [];
    this.prop = kpiv && kpiv.prop || [];
  }
}

//Mongodb中其他Schema中可能引用的OpSeg Schema
export interface IKpiValueElite {
  _id: string;
  oid: string;
  name: string;
}

export class KpiValueElite {
  public _id: string;
  public oid: string;
  public name: string;

  constructor();
  constructor(kpive: IKpiValueElite);
  constructor(kpive?: any) {
    this._id = kpive && kpive._id || undefined;
    this.oid = kpive && kpive.oid || '';
    this.name = kpive && kpive.name || '';
  }
}

export interface IKpiValueProfile {
  oid: string;
  desc: string;
  name: string
  hs: IHierarchyScope;
}

export class KpiValueProfile {
  public _id: string;
  public oid: string;
  public name: string;
  public desc: string;
  public hs: IHierarchyScope;

  constructor();
  constructor(kpivp: IKpiValueProfile);
  constructor(kpivp?: any) {
    this._id = kpivp && kpivp._id || undefined;
    this.oid = kpivp && kpivp.oid || '';
    this.name = kpivp && kpivp.name || '';
    this.desc = kpivp && kpivp.desc || '';
    this.hs = kpivp && kpivp.hs || undefined;
  }
}
