import * as moment from 'moment';

import { IHierarchyScope } from './hs';
import { IOpDefElite } from './op-def';
import { IOpRequestElite } from './op-req';
import { IOpPerformanceElite } from './op-perf';
import { IElite, IQuantity, Quantity} from './common';
import { WorkData, MaterialData } from '../data/util.service';

export interface IOpSchedule {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opType: string;
  opDef: IOpDefElite;
  startTime: Date;
  endTime: Date;
  scheduleState: string;
  scheduleType: string;
  pubDate: Date;
  opReq: IOpRequestElite[];
  workSchedule: IElite;
  opPerf: IOpPerformanceElite;
}

export class OpSchedule {
	public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opType: string;
  public opDef: IOpDefElite;
  public startTime: Date;
  public endTime: Date;
  public scheduleState: string;
  public scheduleType: string;
  public pubDate: Date;
  public opReq: IOpRequestElite[];
  public workSchedule: IElite;
  public opPerf: IOpPerformanceElite;

  constructor();
  constructor(ops: IOpSchedule);
  constructor(ops?: any) {
  	this._id = ops && ops._id || undefined;
  	this.oid = ops && ops.oid || undefined;
  	this.desc = ops && ops.desc || undefined;
  	this.hs = ops && ops.hs || undefined;
  	this.opType = ops && ops.opType || WorkData.opTypes[0];
    this.opDef = ops && ops.opDef || undefined;
  	this.startTime = ops && ops.startTime || moment().startOf('day').add(1, 'd');
  	this.endTime = ops && ops.endTime || moment().startOf('day').add(2, 'd');
  	this.scheduleState = ops && ops.scheduleState || WorkData.reqStates[0];
    this.scheduleType = ops && ops.scheduleType || undefined;
  	this.pubDate = ops && ops.pubDate || moment();
  	this.opReq = ops && ops.opReq || [];
    this.workSchedule = ops && ops.workSchedule || undefined;
  	this.opPerf = ops && ops.opPerf || undefined;
  }

  public GetElite() {
    return new OpScheduleElite(this);
  }

      /**
   * [根据 destMReq 获取工单的计划数量]
   * @return {IQuantity} [description]
   */
  public get qty(): IQuantity {
    let rnQty: IQuantity = new Quantity({
      quantity: 0,
      unit: '件'
    });
    if(this.opReq && this.opReq.length > 0) {
      rnQty.quantity = this.opReq.map(or => or.mlot.qty.quantity).reduce((prev, curr) => prev + curr);
      rnQty.unit = this.opReq[0].mlot.qty.unit;
    }
    return rnQty;
  }
}

export interface IOpScheduleElite extends IElite {
}

export class OpScheduleElite{
  public _id: string;
  public oid: string;

  constructor();
  constructor(opse:IOpScheduleElite);
  constructor(opse?: any) {
    this._id = opse && opse._id || undefined;
    this.oid = opse && opse.oid || '';
  }
}

export interface IOpScheduleProfile {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  opDef: IOpDefElite;
  opType: string;
  startTime: Date;
  endTime: Date;
  scheduleState: string;
  scheduleType: string;
  pubDate: Date;
  opReq: IOpRequestElite[];
  opPerf: IOpPerformanceElite;
}

export class OpScheduleProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public opDef: IOpDefElite;
  public opType: string;
  public startTime: Date;
  public endTime: Date;
  public scheduleState: string;
  public scheduleType: string;
  public pubDate: Date;
  public opReq: IOpRequestElite[];
  public opPerf: IOpPerformanceElite;

  constructor();
  constructor(opsp: IOpScheduleProfile);
  constructor(opsp?: any) {
    this._id = opsp && opsp._id || undefined;
    this.oid = opsp && opsp.oid || undefined;
    this.desc = opsp && opsp.desc || undefined;
    this.hs = opsp && opsp.hs || undefined;
    this.opDef = opsp && opsp.opDef || undefined;
    this.opType = opsp && opsp.opType || undefined;
    this.startTime = opsp && opsp.startTime || undefined;
    this.endTime = opsp && opsp.endTime || undefined;
    this.scheduleState = opsp && opsp.scheduleState || undefined;
    this.scheduleType = opsp && opsp.scheduleType || undefined;
    this.pubDate = opsp && opsp.pubDate || moment();
    this.opReq = opsp && opsp.opReq || [];
    this.opPerf = opsp && opsp.opPerf || undefined;
  }


}
