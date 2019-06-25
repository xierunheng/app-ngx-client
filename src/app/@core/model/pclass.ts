import { IHierarchyScope } from './hs';
import { IResProp, IElite} from './common';
import { IPersonProfile } from './person';

export interface IPclass {
  _id: string;
  oid: string;
 // dept: string;
  desc: string;
  hs: IHierarchyScope;
  prop: IResProp[];
  persons: IPersonProfile[];
}

//MongoDB里的PersonnelClass Schema
export class Pclass {
  public _id: string;
  public oid: string;
//  public dept: string;
  public desc: string;
  public hs: IHierarchyScope;
  public prop: IResProp[];
  public persons: IPersonProfile[];

  constructor();
  constructor(pc: IPclass);
  constructor(pc?: any) {
    this._id = pc && pc._id || undefined;
    this.oid = pc && pc.oid || '';
//    this.dept = pc && pc.dept || '';
    this.desc = pc && pc.desc || '';
    this.hs = pc && pc.hs || undefined;
    this.prop = pc && pc.prop || [];
    this.persons = pc && pc.persons || [];
  }

  GetElite(): PclassElite {
    return new PclassElite(this);
  }
}

//Mongodb中其他Schema中可能引用的PersonnelClass Schema
export interface IPclassElite extends IElite {
//  dept: string;
}

export class PclassElite {
  public _id: string;
  public oid: string;
//  public dept: string;

  constructor();
  constructor(pce: IPclassElite);
  constructor(pce?: any) {
    this._id = pce && pce._id || undefined;
    this.oid = pce && pce.oid || '';
//    this.dept = pce && pce.dept || '';
  }
}

export interface IPclassProfile extends IElite {
  desc: string;
  hs: IHierarchyScope;
}

export class PclassProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
//  public dept: string;

  constructor();
  constructor(pcp: IPclassProfile);
  constructor(pcp?: any) {
    this._id = pcp && pcp._id || undefined;
    this.oid = pcp && pcp.oid || '';
    this.desc = pcp && pcp.desc || '';
    this.hs = pcp && pcp.hs || undefined;
  }
}
