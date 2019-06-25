import * as moment from 'moment';

import { IHierarchyScope } from './hs';
import { IWorkRequestElite } from './work-req';
import { IElite } from './common';
import { IWorkPerformanceElite } from './work-perf';

export interface IWorkSchedule {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  startTime: Date;
  endTime: Date;
  scheduleState: string;
  pubDate: Date;
  workReq: IWorkRequestElite[];
  opSchedule: IElite;
  workPerf: IWorkPerformanceElite;
}

export class WorkSchedule {
	public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public startTime: Date;
  public endTime: Date;
  public scheduleState: string;
  public pubDate: Date;
  public workReq: IWorkRequestElite[];
  public opSchedule: IElite;
  public workPerf: IWorkPerformanceElite;

  constructor();
  constructor(ws: IWorkSchedule);
  constructor(ws?: any) {
  	this._id = ws && ws._id || undefined;
  	this.oid = ws && ws.oid || undefined;
  	this.desc = ws && ws.desc || undefined;
  	this.hs = ws && ws.hs || undefined;
  	this.workType = ws && ws.workType || undefined;
  	this.startTime = ws && ws.startTime || undefined;
  	this.endTime = ws && ws.endTime || undefined;
  	this.scheduleState = ws && ws.scheduleState || undefined;
  	this.pubDate = ws && ws.pubDate || moment();
  	this.workReq = ws && ws.workReq || [];
    this.opSchedule = ws && ws.opSchedule || undefined;
    this.workPerf = ws && ws.workPerf || undefined;
  }
  public GetElite() {
    return new WorkScheduleElite(this);
  }
}

export interface IWorkScheduleElite{
  _id: string;
  oid: string;
}

export class WorkScheduleElite{
  public _id: string;
  public oid: string;

  constructor();
  constructor(wse:IWorkScheduleElite);
  constructor(wse?: any) {
    this._id = wse && wse._id || undefined;
    this.oid = wse && wse.oid || '';
  }
}

export interface IWorkScheduleProfile {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  startTime: Date;
  endTime: Date;
  scheduleState: string;
  pubDate: Date;
  workReq: IWorkRequestElite[];
}

export class WorkScheduleProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public startTime: Date;
  public endTime: Date;
  public scheduleState: string;
  public pubDate: Date;

  constructor();
  constructor(wsp: IWorkScheduleProfile);
  constructor(wsp?: any) {
    this._id = wsp && wsp._id || undefined;
    this.oid = wsp && wsp.oid || undefined;
    this.desc = wsp && wsp.desc || undefined;
    this.hs = wsp && wsp.hs || undefined;
    this.workType = wsp && wsp.workType || undefined;
    this.startTime = wsp && wsp.startTime || undefined;
    this.endTime = wsp && wsp.endTime || undefined;
    this.scheduleState = wsp && wsp.scheduleState || undefined;
    this.pubDate = wsp && wsp.pubDate || moment();
  }
}
