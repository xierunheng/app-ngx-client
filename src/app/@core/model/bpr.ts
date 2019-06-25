import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IValue, IParameter } from './parameter';
import { IResProp, IElite, IQuantity, IResult } from './common';
import { IPclass, PclassElite, IPclassElite } from './pclass';
import { IMlotProfile } from './mlot';

interface ISampleTestResult {
  oid: string;
  timeStamp: Date;
  externalRef: IElite;
  desc: string;
  testDisposition: string;
  equipID: IElite[];
  physicalAssetID: IElite[];
  analysisUsed: string[];
  expiration: Date;
  results: IResult[];
  expectedResults: IResult[];
}

interface IChangeHistory {
  oid: string;
  timeStamp: Date;
  prechangeData: IValue[];
  reason: IValue[];
}

interface IComment {
  oid: string;
  timeStamp: Date;
  commentText: string;
  personID: IElite;
}

interface IPersonnelID {
  oid: string;
  timeStamp: Date;
  name: string[];
  changeIndication: string;
  reason: string;
}

export interface IBPR {
  _id: string;
  oid: string;
  objectType: string;
  externalRef: IElite;
  desc: string;
  hs: IHierarchyScope;
  publishedDate: Date;
  batchID: IElite;
  BPRSpec: IElite;
  campaignID: IElite;
  changeIndication: string;
  delimiter: string;
  equipID: IElite;
  expirationDate: Date;
  language: string;
  lotID: IElite;
  mdefID: IElite;
  physicalAssetID: IElite[];
  recordStatus: string;
  version: string;
  changeHistory: IChangeHistory[];
  comments: IComment[];
  controlRecipes: IElite[];
  dataSets: IElite[];
  events: IElite[];
  masterRecipes: IElite[];
  personnelID: IPersonnelID[];
  opDef: IElite[];
  opPerf: IElite[];
  opSchedule: IElite[];
  recipeElements: IElite[];
  resourceQualifications: IElite[];
  samples: IElite[];
  workDirective: IElite[];
  workMaster: IElite[];
  workPerf: IElite[];
  workSchedule: IElite[];
  createdAt: Date;
  updatedAt: Date;
}
