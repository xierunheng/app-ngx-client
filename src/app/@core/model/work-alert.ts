import * as _ from 'lodash';
import * as moment from 'moment';

import { IHierarchyScope } from './hs';
import { WorkData } from '../data/util.service';
import { IElite } from './common';
import { IValue, Value } from './parameter';
import { IPersonElite } from './person';
import { IEquipmentElite } from './equipment';
import { IWorkAlertProp, WorkAlertProp,
  IWorkAlertDefElite, WorkAlertDefElite, IWorkAlertDef } from './work-alert-def';

//MongoDB里的WorkAlert Schema

export interface IWorkAlert {
  _id: string;
  oid: string;
  messageText: string;
  hs: IHierarchyScope;
  person: IPersonElite;
  equipment: IEquipmentElite;
  workAlertDef: IWorkAlertDefElite;
  receiveHs: IHierarchyScope[];
  receivers: IPersonElite[];
  prop: IWorkAlertProp[];
  priority: number;
  category: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkAlert {
  public _id: string;
  public oid: string;
  public messageText: string;
  public hs: IHierarchyScope;
  public person: IPersonElite;
  public equipment: IEquipmentElite;
  public workAlertDef: IWorkAlertDefElite;
  public receiveHs: IHierarchyScope[];
  public receivers: IPersonElite[];
  public prop: IWorkAlertProp[];
  public priority: number;
  public category: string;
  public createdAt: Date;
  public state: string;
  public updatedAt: Date;

  constructor();
  constructor(wa: IWorkAlert);
  constructor(wa?: any) {
    this._id = wa && wa._id ||  undefined;
    this.oid = wa && wa.oid ||  '';
    this.messageText = wa && wa.messageText ||  '';
    this.hs = wa && wa.hs ||  undefined;
    this.person = wa && wa.person ||  undefined;
    this.equipment = wa && wa.equipment ||  undefined;
    this.workAlertDef = wa && wa.workAlertDef ||  undefined;
    this.receiveHs = wa && wa.receiveHs ||  [];
    this.receivers = wa && wa.receivers ||  [];
    this.prop = wa && wa.prop ||  [];
    this.priority = wa && wa.priority || 1;
    this.category = wa && wa.category || '';
    this.state = wa && wa.state || WorkData.alertStates[0];
    this.createdAt = wa && wa.createdAt || undefined;
    this.updatedAt = wa && wa.updatedAt || undefined;
  }

  public GetElite() {
    return new WorkAlertElite(this);
  }

  public GetProfile() {
    return new WorkAlertProfile(this);
  }

  public DeriveFromDef(wadef: IWorkAlertDef) {
    this.workAlertDef = new WorkAlertDefElite(wadef);
    this.prop = wadef.prop;
    this.category = wadef.category[0];
    this.hs = wadef.hs;
    this.priority = wadef.priority[0];
    this.receiveHs = wadef.receiveHs;
    this.receivers = wadef.receivers;
  }

  public formatOid() {
    this.oid = (this.workAlertDef ? this.workAlertDef.oid : '') +
      (this.person ?  this.person.oid : '') +
      (this.equipment ? this.equipment.oid : '') +
      moment().format('YYMMDDHHmmss');
  }
}

//MongoDB中其他Schema中可能引用的EnergyDefinition Schema
export interface IWorkAlertElite extends IElite{

}

export class WorkAlertElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(wae: IWorkAlertElite);
  constructor(wae?: any) {
    this._id = wae && wae._id || undefined;
    this.oid = wae && wae.oid || '';
  }
}

//MongoDB中其他Schema中可能引用的EnergyDefinition Schema
export interface IWorkAlertProfile extends IWorkAlertElite{
  oid: string;
  messageText: string;
  state: string;
  hs: IHierarchyScope;
  priority: number;
  category: string;
}

export class WorkAlertProfile {
  public _id: string;
  public oid: string;
  public messageText: string;
  public state: string;
  public hs: IHierarchyScope;
  public priority: number;
  public category: string;

  constructor();
  constructor(wap: IWorkAlertProfile);
  constructor(wap?: any) {
    this._id = wap && wap._id ||  undefined;
    this.oid = wap && wap.oid ||  '';
    this.messageText = wap && wap.messageText ||  '';
    this.state = wap && wap.state || '';
    this.hs = wap && wap.hs ||  undefined;
    this.priority = wap && wap.priority || 1;
    this.category = wap && wap.category || '';
  }
}
