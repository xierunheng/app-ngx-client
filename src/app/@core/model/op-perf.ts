import * as moment from 'moment';

import { IHierarchyScope } from './hs';
import { IOpResponseElite } from './op-res';
import { IElite } from './common';

export interface IOpPerformance {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  opSchedule: IElite;
  startTime: Date;
  endTime: Date;
  state: string;
  pubDate: Date;
  opRes: IOpResponseElite[];
}

export class OpPerformance {
	public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public opSchedule: IElite;
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public pubDate: Date;
  public opRes: IOpResponseElite[];

  constructor();
  constructor(opp: IOpPerformance);
  constructor(opp?: any) {
  	this._id = opp && opp._id || undefined;
  	this.oid = opp && opp.oid || undefined;
  	this.desc = opp && opp.desc || undefined;
  	this.hs = opp && opp.hs || undefined;
  	this.opType = opp && opp.opType || undefined;
  	this.opSchedule = opp && opp.opSchedule || undefined;
  	this.startTime = opp && opp.startTime || undefined;
  	this.endTime = opp && opp.endTime || undefined;
  	this.state = opp && opp.state || undefined;
  	this.pubDate = opp && opp.pubDate || moment();
  	this.opRes = opp && opp.opRes || [];
  }

  public GetElite() {
    return new OpPerformanceElite(this);
  }

}

export interface IOpPerformanceElite{
  _id: string;
  oid: string;
  state: string;
}

export class OpPerformanceElite{
  public _id: string;
  public oid: string;
  public state: string;

  constructor();
  constructor(oppe:IOpPerformanceElite);
  constructor(oppe?: any) {
    this._id = oppe && oppe._id || undefined;
    this.oid = oppe && oppe.oid || '';
    this.state = oppe && oppe.state || '';
  }
}

export interface IOpPerformanceProfile {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  opRes: IOpResponseElite[];
  startTime: Date;
  endTime: Date;
  state: string;
  pubDate: Date;
}

export class OpPerformanceProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public opRes: IOpResponseElite[];
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public pubDate: Date;

  constructor();
  constructor(oppp: IOpPerformanceProfile);
  constructor(oppp?: any) {
    this._id = oppp && oppp._id || undefined;
    this.oid = oppp && oppp.oid || undefined;
    this.desc = oppp && oppp.desc || undefined;
    this.hs = oppp && oppp.hs || undefined;
    this.opType = oppp && oppp.opType || undefined;
    this.opRes = oppp && oppp.opRes || [];
    this.startTime = oppp && oppp.startTime || undefined;
    this.endTime = oppp && oppp.endTime || undefined;
    this.state = oppp && oppp.state || undefined;
    this.pubDate = oppp && oppp.pubDate || moment();
  }
}
