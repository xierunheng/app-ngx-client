import * as _ from 'lodash';
import { IHierarchyScope } from './hs';
import { IElite } from './common';
import { IValue, Value } from './parameter';
import { IPersonElite } from './person';

//MongoDB里的AlertDefinition Schema

export interface IWorkAlertProp {
  _id: string;
  oid: string;
  desc: string;
  value: IValue;
  tags: string[];
  active: boolean;
}

export class WorkAlertProp {
  public _id: string;
  public oid: string;
  public desc: string;
  public value: IValue;
  public active: boolean;
  public tags: string[];

  constructor();
  constructor(waProp:IWorkAlertProp);
  constructor(waProp?: any) {
    this._id = waProp && waProp._id || undefined;
    this.oid = waProp && waProp.oid || '';
    this.desc = waProp && waProp.desc || '';
    this.value = waProp && waProp.value || new Value();
    this.active = waProp && waProp.active || false;
    this.tags = waProp && waProp.tags || [];
  }
}

export interface IWorkAlertDef {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  receiveHs: IHierarchyScope[];
  receivers: IPersonElite[];
  prop: IWorkAlertProp[];
  priority: number[];
  category: string[];
}

export class WorkAlertDef {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public receiveHs: IHierarchyScope[];
  public receivers: IPersonElite[];
  public prop: IWorkAlertProp[];
  public priority: number[];
  public category: string[];

  constructor();
  constructor(wadef: IWorkAlertDef);
  constructor(wadef?: any) {
    this._id = wadef && wadef._id ||  undefined;
    this.oid = wadef && wadef.oid ||  '';
    this.desc = wadef && wadef.desc ||  '';
    this.hs = wadef && wadef.hs ||  undefined;
    this.receiveHs = wadef && wadef.receiveHs ||  [];
    this.receivers = wadef && wadef.receivers ||  [];
    this.prop = wadef && wadef.prop ||  [];
    this.priority = wadef && wadef.priority || [];
    this.category = wadef && wadef.category || [];
  }


  public GetElite() {
    return new WorkAlertDefElite(this);
  }

  public GetProfile() {
    return new WorkAlertDefProfile(this);
  }
}

//MongoDB中其他Schema中可能引用的EnergyDefinition Schema
export interface IWorkAlertDefElite extends IElite{

}

export class WorkAlertDefElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(wade: IWorkAlertDefElite);
  constructor(wade?: any) {
    this._id = wade && wade._id || undefined;
    this.oid = wade && wade.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的EnergyDefinition Schema
export interface IWorkAlertDefProfile extends IWorkAlertDefElite{
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  priority: number[];
  category: string[];
}

export class WorkAlertDefProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public priority: number[];
  public category: string[];

  constructor();
  constructor(wadp: IWorkAlertDefProfile);
  constructor(wadp?: any) {
    this._id = wadp && wadp._id || undefined;
    this.oid = wadp && wadp.oid || '';
    this.hs = wadp && wadp.hs || undefined;
    this.desc = wadp && wadp.desc ||  '';
    this.priority = wadp && wadp.priority || [];
    this.category = wadp && wadp.category || [];

  }
}
