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

interface ISampleTest {
  oid: string;
  timeStamp: Date;
  externalRef: IElite;
  desc: string;
  testCode: string;
  testName: IElite;
  sampleTestResult: ISampleTestResult[];
}

export interface ISample {
  _id: string;
  oid: string;
  objectType: string;
  externalRef: IElite;
  desc: string;
  sampleSourceID: IElite;
  sampleSize: IQuantity[];
  sampleType: string;
  samplePullReason: string;
  sampleExpiration: Date;
  equipID: IElite[];
  physicalAssetID: IElite[];
  proceduralElemRef: IElite[];
  SOPRef: IElite[];
  sampleTest: ISampleTest[];
}
