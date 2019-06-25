import * as moment from 'moment';

import { IHierarchyScope } from './hs';
import { IWorkResponseElite } from './work-res';
import { IElite } from './common';

export interface IWorkPerformance {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  workSchedule: IElite;
  startTime: Date;
  endTime: Date;
  state: string;
  pubDate: Date;
  workRes: IWorkResponseElite[];
}

export class WorkPerformance {
	public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public workSchedule: IElite;
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public pubDate: Date;
  public workRes: IWorkResponseElite[];

  constructor();
  constructor(wp: IWorkPerformance);
  constructor(wp?: any) {
  	this._id = wp && wp._id || undefined;
  	this.oid = wp && wp.oid || undefined;
  	this.desc = wp && wp.desc || undefined;
  	this.hs = wp && wp.hs || undefined;
  	this.workType = wp && wp.workType || undefined;
  	this.workSchedule = wp && wp.workSchedule || undefined;
  	this.startTime = wp && wp.startTime || undefined;
  	this.endTime = wp && wp.endTime || undefined;
  	this.state = wp && wp.state || undefined;
  	this.pubDate = wp && wp.pubDate || moment();
  	this.workRes = wp && wp.workRes || [];
  }
  public GetElite() {
    return new WorkPerformanceElite(this);
  }
}

export interface IWorkPerformanceElite{
  _id: string;
  oid: string;
}

export class WorkPerformanceElite{
  public _id: string;
  public oid: string;

  constructor();
  constructor(wpe:IWorkPerformanceElite);
  constructor(wpe?: any) {
    this._id = wpe && wpe._id || undefined;
    this.oid = wpe && wpe.oid || '';
  }
}

export interface IWorkPerformanceProfile {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  workSchedule: IElite;
  startTime: Date;
  endTime: Date;
  state: string;
  pubDate: Date;
  workRes: IWorkResponseElite[];
}

export class WorkPerformanceProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public workSchedule: IElite;
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public pubDate: Date;
  public workRes: IWorkResponseElite[];

  constructor();
  constructor(wpp: IWorkPerformanceProfile);
  constructor(wpp?: any) {
    this._id = wpp && wpp._id || undefined;
    this.oid = wpp && wpp.oid || undefined;
    this.desc = wpp && wpp.desc || undefined;
    this.hs = wpp && wpp.hs || undefined;
    this.workType = wpp && wpp.workType || undefined;
    this.workSchedule = wpp && wpp.workSchedule || undefined;
    this.startTime = wpp && wpp.startTime || undefined;
    this.endTime = wpp && wpp.endTime || undefined;
    this.state = wpp && wpp.state || undefined;
    this.pubDate = wpp && wpp.pubDate || moment();
    this.workRes = wpp && wpp.workRes || [];
  }
}
