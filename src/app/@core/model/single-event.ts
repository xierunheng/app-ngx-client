import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IValue, Value, IParameter, Parameter } from './parameter';
import { IResProp, IElite, Elite } from './common';
import { IPclass, PclassElite, IPclassElite } from './pclass';
import { IMlotProfile } from './mlot';

export interface IAlarmData {
  alarmEvent: string;
  alarmType: string;
  alarmLimit: IValue[];
  priority: number;
}

export class AlarmData {
  public alarmEvent: string;
  public alarmType: string;
  public alarmLimit: IValue[];
  public priority: number;

  constructor();
  constructor(ad: AlarmData);
  constructor(ad?: any) {
    this.alarmEvent = ad && ad.alarmEvent || '';
    this.alarmType = ad && ad.alarmType || '';
    this.alarmLimit = ad && ad.alarmLimit || [new Value()];
    this.priority = ad && ad.priority || 0;
  }
}

export interface ISingleEvent {
  _id: string;
  oid: string;
  objectType: string;
  externalRef: IElite;
  desc: string;
  eventType: string;
  eventSubType: string;
  hs: IHierarchyScope;
  equipID: IElite[];
  value: IValue[];
  previousValue: IValue[];
  messageText: string;
  personID: IElite[];
  computerID: IElite[];
  physicalAssetID: IElite[];
  proceduralElemRef: IElite[];
  category: string[];
  alarmData: IAlarmData[];
  associatedEventID: IElite[];
  userAttr: IParameter[];
  createdAt: Date;
  updatedAt: Date;
  //value / previousValue * 100
  delta?: number;
}

export class SingleEvent {
  public _id: string;
  public oid: string;
  public objectType: string;
  public externalRef: IElite;
  public desc: string;
  public eventType: string;
  public eventSubType: string;
  public hs: IHierarchyScope;
  public equipID: IElite[];
  public value: IValue[];
  public previousValue: IValue[];
  public messageText: string;
  public personID: IElite[];
  public computerID: IElite[];
  public physicalAssetID: IElite[];
  public proceduralElemRef: IElite[];
  public category: string[];
  public alarmData: IAlarmData[];
  public associatedEventID: IElite[];
  public userAttr: IParameter[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor();
  constructor(se: SingleEvent);
  constructor(se?: any) {
    this._id = se && se._id || undefined;
    this.oid = se && se.oid || '';
    this.objectType =se && se.objectType || '';
    this.externalRef = se && se.externalRef || undefined;
    this.desc = se && se.desc || '';
    this.eventType =se && se.eventType || '';
    this.eventSubType = se && se.eventSubType || '';
    this.hs = se && se.hs || undefined;
    this.equipID =se && se.equipID || [new Elite()];
    this.value = se && se.value || [new Value()];
    this.previousValue = se && se.previousValue || [new Value()];
    this.messageText =se && se.messageText || '';
    this.personID = se && se.personID || [];
    this.computerID = se && se.computerID || [];
    this.physicalAssetID =se && se.physicalAssetID || [];
    this.proceduralElemRef = se && se.proceduralElemRef || [];
    this.category = se && se.category || [];
    this.alarmData =  se && se.alarmData || [new AlarmData()];
    this.associatedEventID = se && se.associatedEventID || [];
    this.userAttr = se && se.userAttr || [];
    this.createdAt =se && se.createdAt || undefined;
    this.updatedAt =se && se.updatedAt || undefined;
  }
}
