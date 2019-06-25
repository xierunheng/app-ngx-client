import * as _ from 'lodash';
import { WorkData, MaterialData } from '../data/util.service';
import { IHierarchyScope } from './hs';
import { IOpRequest, IOpRequestElite } from './op-req';
import { WorkRequest, IWorkRequest, IWorkRequestElite, WorkRequestElite } from './work-req';
import { IJobResponse, JobResponse } from './job-response';
import { IJobOrder, JobOrder, IJobOrderElite } from './job-order';
import { IQuantity, Quantity, IElite, IMaterialOp } from './common';
import { Response } from './base/res';

export interface IWorkResponse {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  req: IWorkRequestElite;
  opRes: IElite;
  startTime: Date;
  endTime: Date;
  state: string;
  firstJob: IElite;
  lastJob: IElite;
  jobResponse: IJobResponse[];
  //qty & ngqty 需要客户端自己计算
  qty?: IQuantity;
  ngqty?: IQuantity;
}

export class WorkResponse extends Response {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public req: IWorkRequestElite;
  public opRes: IElite;
  public startTime: Date;
  public endTime: Date;
  public state: string;
  public firstJob: IElite;
  public lastJob: IElite;
  public jobResponse: JobResponse[];

  constructor();
  constructor(wres: IWorkResponse);
  constructor(wres?: any) {
    super();
    this._id = wres && wres._id || undefined;
    this.oid = wres && wres.oid || '';
    this.desc = wres && wres.desc || '';
    this.hs = wres && wres.hs || undefined;
    this.workType = wres && wres.workType || '';
    this.req = wres && wres.req || undefined;
    this.opRes = wres && wres.opRes || undefined;
    this.startTime = wres && wres.startTime || undefined;
    this.endTime = wres && wres.endTime || undefined;
    this.state = wres && wres.state || '';
    this.firstJob = wres && wres.firstJob || undefined;
    this.lastJob = wres && wres.lastJob || undefined;
    this.jobResponse = [];
    if(wres && wres.jobResponse) {
      this.jobResponse = wres.jobResponse.map(jr => new JobResponse(jr));
    }
  }

  public GetElite() {
    return new WorkResponseElite(this);
  }

  public get destMAct(): IMaterialOp[] {
    let lastjr = this.jobResponse.find(jr => jr.oid === this.lastJob.oid);
    return lastjr.mAct;
  }

  public get qty(): IQuantity {
    let rnQty: IQuantity = new Quantity();
    if(this.destMAct.length > 0) {
      rnQty.unit = this.destMAct[0].qty.unit;
      rnQty.quantity = this.destMAct.map(ma => ma.qty.quantity).reduce((prev, curr) => prev + curr);
    }
    return rnQty;
  }

  public get ngqty(): IQuantity {
    let rnQty: IQuantity = new Quantity();
    rnQty.unit = this.jobResponse[0].ngqty.unit;
    rnQty.quantity = this.jobResponse.map(jr => jr.ngqty.quantity).reduce((prev, curr) => prev + curr);
    return rnQty;
  }

  /**
   * [获取工单实际的产出
   * like {1016: 10，
   *     1013: 12}, 1016 型号的产品 10 件, 1013产品 12 件]
   * @return {any} [description]
   */
  public get actOutput(): any {
    return this.calcOutput(this.destMAct);
  }

  /**
   * [按照成型工区分来获取工单实际的产出]
   * @return {any} [description]
   */
  public get actOutputWithMolder(): any {
    return this.calcOutputWithMolder(this.destMAct);
  }

  /**
   * [获取作业的所有质量缺陷数]
   * @return {any} [description]
   */
  public get actQCI(): any {
    return this.calcQCI(_.flatten(this.jobResponse.map(jr => jr.mAct)));
  }

  /**
   * [获取工单的质量缺陷数，同时获取累计占比，形成pareto图]
   * @return {any} [description]
   */
  public get actQCIPareto(): any {
    return this.calcQCIPareto(_.flatten(this.jobResponse.map(jr => jr.mAct)));
  }

  /**
   * [获取作业带时间戳的产出]
   * @return {any} [description]
   */
  public get actOutputWithTime(): any {
    return this.jobResponse.map(jr => {
      return {
        name: jr.oid,
        data: this.calcOutputWithTime(jr.mAct)
      };
    });
  }

  /**
   * [根据工单的执行状态，显示工单的样式]
   * @return {string} [description]
   */
  public get showStatus(): string {
    return WorkData.WorkStates[this.state].status;
  }

}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IWorkResponseElite  extends IElite {
  state: string;
}

export class WorkResponseElite {
  public _id: string;
  public oid: string;
  public state: string;

  constructor();
  constructor(wrese: IWorkResponseElite);
  constructor(wrese?: any) {
    this._id = wrese && wrese._id || undefined;
    this.oid = wrese && wrese.oid || '';
    this.state = wrese && wrese.state || '';
  }

}

export interface IWorkResponseProfile  extends IWorkResponseElite {
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  workType: string;
  req: IWorkRequestElite;
  opRes: IElite;
  startTime: Date;
  endTime: Date;
}

export class WorkResponseProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public workType: string;
  public req: IWorkRequestElite;
  public opRes: IElite;
  public startTime: Date;
  public endTime: Date;
  public state: string;

  constructor();
  constructor(wrp: IWorkResponseProfile);
  constructor(wrp?: any) {
    this._id = wrp && wrp._id || undefined;
    this.oid = wrp && wrp.oid || '';
    this.desc = wrp && wrp.desc || '';
    this.hs = wrp && wrp.hs || undefined;
    this.workType = wrp && wrp.workType || '';
    this.req = wrp && wrp.req || undefined;
    this.opRes = wrp && wrp.opRes || undefined;
    this.startTime = wrp && wrp.startTime || undefined;
    this.endTime = wrp && wrp.endTime || undefined;
    this.state = wrp && wrp.state || '';
  }
}

/**
 * 作业，包括 wreq & wres
 */
export interface IWork {
  wreq: IWorkRequest;
  wres: IWorkResponse;
}
