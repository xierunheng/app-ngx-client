import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IPersonnelSpec, IEquipmentSpec,
  IMaterialSpec, IQuantity, Quantity,
  ISegDep, IElite } from './common';

//MongoDB里的ProcessSegment Schema
export interface IProseg {
  _id: string;
  oid: string;
  code: string;
  no: string;
  desc: string;
  opType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  duration: IQuantity;
  pSpec: IPersonnelSpec[];
  eSpec: IEquipmentSpec[];
  mSpec: IMaterialSpec[];
  para: IParameter[];
  dep: ISegDep[];
  subPs: IProseg[];
}

export class Proseg {
  public _id: string;
  public oid: string;
  public code: string;
  public no: string;
  public desc: string;
  public opType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public duration: IQuantity;
  public pSpec: IPersonnelSpec[];
  public eSpec: IEquipmentSpec[];
  public mSpec: IMaterialSpec[];
  public para: IParameter[];
  public dep: ISegDep[];
  public subPs: IProseg[];

  constructor();
  constructor(ps: IProseg);
  constructor(ps?: any) {
    this._id = ps && ps._id || undefined;
    this.oid = ps && ps.oid || '';
    this.code = ps && ps.code || '';
    this.no = ps && ps.no || '';
    this.desc = ps && ps.desc || '';
    this.opType = ps && ps.opType || '';
    this.hs = ps && ps.hs || undefined;
    this.pubDate = ps && ps.pubDate || undefined;
    this.duration = ps && ps.duration || new Quantity();
    this.pSpec = ps && ps.pSpec || [];
    this.eSpec = ps && ps.eSpec || [];
    this.mSpec = ps && ps.mSpec || [];
    this.para = ps && ps.para || [];
    this.dep = ps && ps.dep || [];
    this.subPs = ps && ps.subPs || [];
  }

  public GetElite() {
    return new ProsegElite(this);
  }
}

//Mongodb中其他Schema中可能引用的ProSeg Schema
export interface IProsegElite extends IElite {
  _id: string;
  oid: string;
  code: string;
  no: string;
}

export class ProsegElite {
  public _id: string;
  public oid: string;
  public code: string;
  public no: string;

  constructor();
  constructor(pse: IProsegElite);
  constructor(pse?: any) {
    this._id = pse && pse._id || undefined;
    this.oid = pse && pse.oid || '';
    this.code = pse && pse.code || '';
    this.no = pse && pse.no || '';
  }


}


//Mongodb中其他Schema中可能引用的ProSeg Schema
export interface IProsegProfile {
  _id: string;
  oid: string;
  code: string;
  desc: string;
  no: string;
  opType: string;
  hs: IHierarchyScope;
  pubDate: Date;
  duration: IQuantity;
}

export class ProsegProfile {
  public _id: string;
  public oid: string;
  public code: string;
  public desc: string;
  public no: string;
  public opType: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public duration: IQuantity;

  constructor();
  constructor(pp: IProsegProfile);
  constructor(pp?: any) {
    this._id = pp && pp._id || undefined;
    this.oid = pp && pp.oid || '';
    this.code = pp && pp.code || '';
    this.no = pp && pp.no || '';
    this.desc = pp && pp.desc || '';
    this.opType = pp && pp.opType || '';
    this.hs = pp && pp.hs ||  undefined;
    this.pubDate = pp && pp.pubDate || undefined;
    this.duration = pp && pp.duration || new Quantity();
  }

}
