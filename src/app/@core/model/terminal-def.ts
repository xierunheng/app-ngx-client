import { IHierarchyScope } from './hs';
import { IResProp, IElite } from './common';
import { IProsegElite } from './proseg';

export interface ITerminalDef{
  _id: string;
  oid: string;
  desc: string;
  ps: IProsegElite;
  hs: IHierarchyScope;
  category: string[];
  size: string[];
  resolution: string[];
  prop: IResProp[];
}

export class TerminalDef {
  public _id: string;
  public oid: string;
  public desc: string;
  public ps: IProsegElite;
  public hs: IHierarchyScope;
  public category: string[];
  public size: string[];
  public resolution: string[];
  public prop: IResProp[];

  constructor();
  constructor(td: ITerminalDef);
  constructor(td?: any) {
    this._id = td && td._id || undefined;
    this.oid = td && td.oid || '';
    this.desc = td && td.desc || '';
    this.hs = td && td.hs || undefined;
    this.ps = td && td.ps || undefined;
    this.category = td && td.category || [];
    this.size = td && td.size || [];
    this.resolution = td && td.resolution || [];
    this.prop = td && td.prop || [];
  }

  GetElite(): TerminalDefElite {
    return new TerminalDefElite(this);
  }
}

export interface ITerminalDefElite {
  _id: string;
  oid: string;
}

export class TerminalDefElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(tde: ITerminalDefElite);
  constructor(tde?: any) {
    this._id = tde && tde._id || undefined;
    this.oid = tde && tde.oid || '';
  }

}

export interface ITerminalDefProfile{
  _id: string;
  oid: string;
  desc: string;
  ps: IProsegElite;
  hs: IHierarchyScope;
  category: string[];
  size: string[];
  resolution: string[];
}

export class TerminalDefProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public ps: IProsegElite;
  public hs: IHierarchyScope;
  public category: string[];
  public size: string[];
  public resolution: string[];

  constructor();
  constructor(tdp: ITerminalDefProfile);
  constructor(tdp?: any) {
    this._id = tdp && tdp._id || undefined;
    this.oid = tdp && tdp.oid || '';
    this.desc = tdp && tdp.desc || '';
    this.hs = tdp && tdp.hs || undefined;
    this.ps = tdp && tdp.ps || undefined;
    this.category = tdp && tdp.category || [];
    this.size = tdp && tdp.size || [];
    this.resolution = tdp && tdp.resolution || [];
  }

}

