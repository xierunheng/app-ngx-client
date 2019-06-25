import * as moment from 'moment';
import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import {
  IPersonnelSpec,
  IEquipmentSpec, IMaterialSpec,
  IQuantity, Quantity, IElite
} from './common';
import { IOpseg, IOpsegProfile, OpsegProfile, IOpDefElite } from './op-def';
import { IProsegElite } from './proseg';
import { IWorkMasterElite } from './work-master';

//MongoDB里的WorkMaster Schema
export interface IWorkDirective {
  _id: string;
  oid: string;
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  duration: IQuantity;
  opDef: IOpDefElite;
  opseg: IElite;
  proseg: IProsegElite;
  workMaster: IWorkMasterElite;
  pSpec: IPersonnelSpec[];
  eSpec: IEquipmentSpec[];
  mSpec: IMaterialSpec[];
  wfSpec: any[];
}

export class WorkDirective {
  public _id: string;
  public oid: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public duration: IQuantity;
  public opDef: IOpDefElite;
  public opseg: IElite;
  public proseg: IProsegElite;
  public workMaster: IWorkMasterElite;
  public pSpec: IPersonnelSpec[];
  public eSpec: IEquipmentSpec[];
  public mSpec: IMaterialSpec[];
  public wfSpec: any[];

  constructor();
  constructor(wd: IWorkDirective);
  constructor(wd?: any) {
    this._id = wd && wd._id || undefined;
    this.oid = wd && wd.oid || '';
    this.desc = wd && wd.desc || '';
    this.workType = wd && wd.workType || '';
    this.hs = wd && wd.hs || undefined;
    this.pubDate = wd && wd.pubDate || moment();
    this.duration = wd && wd.duration || new Quantity();
    this.opDef = wd && wd.opDef || undefined;
    this.opseg = wd && wd.opseg || undefined;
    this.proseg = wd && wd.proseg || undefined;
    this.workMaster = wd && wd.workMaster || undefined;
    this.pSpec = wd && wd.pSpec || [];
    this.eSpec = wd && wd.eSpec || [];
    this.mSpec = wd && wd.mSpec || [];
    this.wfSpec = wd && wd.wfSpec || [];
  }

  public GetElite() {
    return new WorkDirectiveElite(this);
  }

}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IWorkDirectiveElite extends IElite {
  proseg: IProsegElite;
  workMaster: IWorkMasterElite;
}

export class WorkDirectiveElite {
  public _id: string;
  public oid: string;
  public proseg: IProsegElite;
  public workMaster: IWorkMasterElite;

  constructor();
  constructor(wde: IWorkDirectiveElite);
  constructor(wde?: any) {
    this._id = wde && wde._id || undefined;
    this.oid = wde && wde.oid || '';
    this.proseg = wde && wde.proseg || undefined;
    this.workMaster = wde && wde.workMaster || undefined;
  }
}

export interface IWorkDirectiveProfile extends IElite {
  desc: string;
  workType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  duration: IQuantity;
  opDef: IOpDefElite;
  opseg: IElite;
  proseg: IProsegElite;
  workMaster: IWorkMasterElite;
}

export class WorkDirectiveProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public workType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public duration: IQuantity;
  public opDef: IOpDefElite;
  public opseg: IElite;
  public proseg: IProsegElite;
  public workMaster: IWorkMasterElite;

  constructor();
  constructor(wdp: IWorkDirectiveProfile);
  constructor(wdp?: any) {
    this._id = wdp && wdp._id || undefined;
    this.oid = wdp && wdp.oid || '';
    this.desc = wdp && wdp.desc || '';
    this.workType = wdp && wdp.workType || '';
    this.hs = wdp && wdp.hs || undefined;
    this.pubDate = wdp && wdp.pubDate || undefined;
    this.duration = wdp && wdp.duration || new Quantity();
    this.opDef = wdp && wdp.opDef || undefined;
    this.opseg = wdp && wdp.opseg || undefined;
    this.proseg = wdp && wdp.proseg || undefined;
    this.workMaster = wdp && wdp.workMaster || undefined;
  }
}
