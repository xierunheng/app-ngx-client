import * as _ from 'lodash';
import * as moment from 'moment';

import { IHierarchyScope, HierarchyScope } from './hs';
import { IValue, Value, IParameter } from './parameter';
import { IMdef, IMdefProfile, IMdefElite, MdefElite } from './mdef';
import { IMlot, IMlotElite } from './mlot';
import { IMsubLot, IMsubLotElite } from './msublot';

/**
 * 任意 interface，可用扩展成任意的object
 */
export interface ILooseObject {
    [key: string]: any;
}

/**
 * 系统中的关键 interface，用_id oid 唯一标识一个object
 * _id：mongodb 数据库中的唯一标识符
 * oid: 系统中有意义的 object 标识符
 */
export interface IElite {
  _id: string;
  oid: string;
}

export class Elite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(e: IElite);
  constructor(e?: any) {
    this._id = e && e._id || undefined;
    this.oid = e && e.oid || '';
  }
}

/**
 * 检验结果或测试结果
 * IResult 和 IValue 的结构是一样的，考虑到IValue 的简单化，把 IResult 做成完整的
 */
export interface IResult {
  valueStr: string;
  dataType: string;
  unit: string;
  key: string;
}

export class Result {
  public valueStr: string;
  public dataType: string;
  public unit: string;
  public key: string;

  constructor();
  constructor(r: IResult);
  constructor(r?: any) {
    this.valueStr = r && r.valueStr || '';
    this.dataType= r && r.dataType || '';
    this.unit= r && r.unit || '';
    this.key= r && r.key || '';
  }
}

/**
 * 测试结果
 */
export interface ITestResult {
  _id: string;
  oid: string;
  desc: string;
  testTime: Date;
  result: IResult[];
  expirTime: Date;
}

export class TestResult {
  public _id: string;
  public oid: string;
  public desc: string;
  public testTime: Date;
  public result: IResult[];
  public expirTime: Date;

  constructor();
  constructor(tr: ITestResult);
  constructor(tr?: any) {
    this._id = tr &&tr._id || undefined;
    this.oid= tr &&tr.oid || '';
    this.desc= tr &&tr.desc || '';
    this.testTime = tr &&tr.testTime || moment();
    this.result = tr &&tr.result || [];
    this.expirTime = tr &&tr.expirTime || moment().add(2, 'h');
  }
}

/**
 * 资源测试项
 */
export interface IResTestSpec {
  _id: string;
  oid: string;
  ver: string;
  desc: string;
  hs: IHierarchyScope;
  testedClassProp: any[];
  testedProp: any[];
  testedLotProp: any[];
}

//equipment: IElite[];
/**
 * 设备与工装的映射关系
 */
export interface IEquipmentAssetMapping {
  equipment: IElite;
  physicalAsset: IElite;
  startTime: Date;
  endTime: Date;
}

export class EquipmentAssetMapping {
  public equipment: IElite;
  public physicalAsset: IElite;
  public startTime: Date;
  public endTime: Date;

  constructor();
  constructor(eaMap: IEquipmentAssetMapping);
  constructor(eaMap?: any) {
    this.equipment = eaMap && eaMap.equipment || undefined;
    this.physicalAsset= eaMap && eaMap.physicalAsset || undefined;
    this.startTime= eaMap && eaMap.startTime || new Date();
    this.endTime= eaMap && eaMap.endTime || new Date();
  }
}

/**
 * 数值范围
 */
export interface IRange {
  oid: string;
  desc: string;
  lower: IValue;
  upper: IValue;
}

export class Range {
  public oid: string;
  public desc: string;
  public lower: IValue;
  public upper: IValue;

  constructor();
  constructor(range: IRange);
  constructor(range?: any) {
    this.oid = range && range.oid || '';
    this.desc= range && range.desc || '';
    this.lower= range && range.lower || new Value();
    this.upper= range && range.upper || new Value();
  }
}

/**
 * 时间范围
 */
export interface ITimeRange {
  startTime: Date;
  endTime: Date;
  recurrence: string;
  duration: string;
}

export class TimeRange {
  public startTime: Date;
  public endTime: Date;
  public recurrence: string;
  public duration: string;

  constructor();
  constructor(trange: ITimeRange);
  constructor(trange?: any) {
    this.startTime = trange && trange.startTime || new Date();
    this.endTime= trange && trange.endTime || new Date();
    this.recurrence= trange && trange.recurrence || '';
    this.duration= trange && trange.duration || '';
  }
}

/**
 * Segment Dependency
 */
export interface ISegDep {
  _id: string;
  oid: string;
  desc: string;
  dependency: string;
  tfValue: string;
  tfUnit: string;
  items: IElite;
}

export class SegDep {
  public _id: string;
  public oid: string;
  public desc: string;
  public dependency: string;
  public tfValue: string;
  public tfUnit: string;
  public items: IElite;

  constructor();
  constructor(sd: ISegDep);
  constructor(sd?: any) {
    this._id = sd && sd._id || undefined;
    this.oid = sd && sd.oid || '';
    this.desc = sd && sd.desc || '';
    this.dependency = sd && sd.dependency || '';
    this.tfValue = sd && sd.tfValue || [];
    this.tfUnit = sd && sd.tfUnit || [];
    this.items = sd && sd.items || undefined;
  }
}

export interface IQuantity {
  quantity: number;
  unit: string;
}

export class Quantity{
  public quantity: number;
  public unit: string;

  constructor();
  constructor(q: IQuantity);
  constructor(q?:any){
    this.quantity = q && q.quantity || 0;
    this.unit = q && q.unit || '';
  }
}


//interface of Resource Property
export interface IResProp extends IParameter {
  testSpec?: IElite[];
  testResult?: ITestResult[];
}

//Resource Property
export class ResProp {
  public _id: string;
  public  oid: string;
  public desc: string;
  public value: IValue;
  public active: boolean;
  public tags?: string[];
  public testSpec?: IElite[];
  public testResult?: ITestResult[];

  constructor();
  constructor(rp: IParameter);
  constructor(rp: IResProp);
  constructor(rp?:any) {
    this._id = rp && rp._id || undefined;
    this.oid = rp && rp.oid || '';
    this.desc = rp && rp.desc || '';
    this.value = rp && rp.value || new Value();
    this.tags = rp && rp.tags || [];
    this.active = rp && rp.active || false;
    this.testSpec = rp && rp.testSpec || [];
    this.testResult = rp && rp.testResult || [];
  }
}

//Op Property
export interface IOpProp extends IParameter {
  qty: IQuantity;
}

export class OpProp {
  public _id: string;
  public oid: string;
  public desc: string;
  public value: IValue;
  public tags?: string[];
  public active: boolean;
  public qty: IQuantity;

  constructor();
  constructor(opp: IParameter);
  constructor(opp: IResProp);
  constructor(opp: IOpProp);
  constructor(opp?: any) {
    this._id = opp && opp._id || undefined;
    this.oid = opp && opp.oid || '';
    this.desc = opp && opp.desc || '';
    this.value = opp && opp.value || new Value();
    this.tags = opp && opp.tags || [];
    this.active = opp && opp.active || false;
    this.qty = opp && opp.qty || new Quantity();
  }
}

export interface IPersonnelSpec {
  _id: string;
  oid: string;
  pclass: any;
  person: any;
  desc: string;
  use: string;
  qty: IQuantity;
  opprop: IOpProp[];
}

export class PersonnelSpec {
  public _id: string;
  public oid: string;
  public pclass: any;
  public person: any;
  public desc: string;
  public use: string;
  public qty: IQuantity;
  public opprop: IOpProp[];

  constructor();
  constructor(ps: IPersonnelSpec);
  constructor(ps?: any) {
    this._id = ps && ps._id || undefined;
    this.oid = ps && ps.oid || '';
    this.pclass = ps && ps.pclass || undefined;
    this.person = ps && ps.person || undefined;
    this.desc = ps && ps.desc || '';
    this.use = ps && ps.use || '';
    this.qty = ps && ps.qty || new Quantity();
    this.opprop = ps && ps.opprop || [];
  }
}

export interface IEquipmentSpec {
  _id: string;
  oid: string;
  eclass: any;
  equipment: any;
  desc: string;
  use: string;
  qty: IQuantity;
  opprop: IOpProp[];
}

export class EquipmentSpec {
  public _id: string;
  public oid: string;
  public eclass: any;
  public equipment: any;
  public desc: string;
  public use: string;
  public qty: IQuantity;
  public opprop: IOpProp[];

  constructor();
  constructor(es:IEquipmentSpec);
  constructor(es?:any) {
    this._id = es && es._id || undefined;
    this.oid = es && es.oid || '';
    this.eclass = es && es.eclass || undefined;
    this.equipment = es && es.equipment || undefined;
    this.desc = es && es.desc || '';
    this.use = es && es.use || '';
    this.qty = es && es.qty || new Quantity();
    this.opprop = es && es.opprop || [];
  }
}

export interface IMaterialBase {
  _id: string;
  oid: string;
  mclass: any;
  mdef: IMdefElite;
  assType: string;
  assRel: string;
  desc: string;
  use: string;
  qty: IQuantity;
  opprop: IOpProp[];
}

export interface IMaterialSpec extends IMaterialBase {
  assSpec: IMaterialSpec[];
  state: string;
}

export class MaterialSpec {
  public _id: string;
  public oid: string;
  public mclass: any;
  public mdef: IMdefElite;
  public desc: string;
  public assType: string;
  public assRel: string;
  public use: string;
  public qty: IQuantity;
  public opprop: IOpProp[];
  public assSpec: MaterialSpec[];
  public state: string;

  constructor();
  constructor(ms: IMaterialSpec);
  constructor(ms?: any) {
    this._id = ms && ms._id || undefined;
    this.oid = ms && ms.oid || '';
    this.mclass = ms && ms.mclass || undefined;
    this.mdef = ms && ms.mdef || undefined;
    this.desc = ms && ms.desc || '';
    this.assType = ms && ms.assType || '';
    this.assRel = ms && ms.assRel || '';
    this.use = ms && ms.use || '';
    this.qty = ms && ms.qty || new Quantity();
    this.opprop = ms && ms.opprop || [];
    this.assSpec = ms && ms.assSpec || [];
    this.state = ms && ms.state || [];
  }

  deriveFromMdef(mdef: IMdef) {
    let strOids = this.oid.split('-');
    this.oid = strOids[0] + '-' + mdef.oid;
    this.mdef = new MdefElite(mdef);
    this.desc = mdef.desc;
  }

  deriveFromMdefProfile(mdef: IMdefProfile) {
    let strOids = this.oid.split('-');
    this.oid = strOids[0] + '-' + mdef.oid;
    this.mdef = new MdefElite(mdef);
  }
}

export interface IOpData extends IParameter {
}

export class OpData {
  public _id: string;
  public oid: string;
  public desc: string;
  public value: IValue;
  public tags: string[];

  constructor();
  constructor(opd: IOpData);
  constructor(opd?: any) {
    this._id = opd && opd._id || undefined;
    this.oid = opd && opd.oid || '';
    this.desc = opd && opd.desc || '';
    this.value = opd && opd.value || undefined;
    this.tags = opd && opd.tags || [];
  }
}

export interface IPersonnelOp extends IPersonnelSpec {
  hs: IHierarchyScope;
}

export class PersonnelOp {
  public _id: string;
  public oid: string;
  public pclass: any;
  public person: any;
  public desc: string;
  public use: string;
  public qty: IQuantity;
  public hs: IHierarchyScope;
  public opprop: IOpProp[];

  constructor();
  constructor(ps: IPersonnelSpec);
  constructor(po: IPersonnelOp);
  constructor(po?: any) {
    this._id = po && po._id || undefined;
    this.oid = po && po.oid || '';
    this.pclass = po && po.pclass || undefined;
    this.person = po && po.person || undefined;
    this.desc = po && po.desc || '';
    this.use = po && po.use || '';
    this.qty = po && po.qty || new Quantity();
    this.hs = po && po.hs || undefined;
    this.opprop = po && po.opprop || [];
  }

  /**
   * 从多个PersonnelOp中继承下来
   * 这多个PersonnelOp的pclass是一样的
   * @param {IPersonnelOp[]} pos [description]
   */
  public DeriveFromPersonnelOps(pos: IPersonnelOp[]) {
    this.oid = pos[0].oid;
    this.pclass = pos[0].pclass;
    this.person = pos[0].person;
    this.desc = pos[0].desc;
    this.use = pos[0].use;
    this.qty.quantity = pos.map(item => item.qty.quantity)
      .reduce((prev, curr) => prev + curr);
    this.qty.unit = pos[0].qty.unit;
    this.hs = pos[0].hs;
    this.opprop = _.uniqBy(_.flatten(pos.map(item => item.opprop)), '_id');
  }
}

export interface IEquipmentOp extends IEquipmentSpec {
  hs: IHierarchyScope;
}

export class EquipmentOp {
  public _id: string;
  public oid: string;
  public eclass: any;
  public equipment: any;
  public desc: string;
  public use: string;
  public qty: IQuantity;
  public hs: IHierarchyScope;
  public opprop: IOpProp[];

  constructor();
  constructor(eo: IEquipmentSpec);
  constructor(eo: IEquipmentOp);
  constructor(eo?: any) {
    this._id = eo && eo._id || undefined;
    this.oid = eo && eo.oid || '';
    this.eclass = eo && eo.eclass || undefined;
    this.equipment = eo && eo.equipment || undefined;
    this.desc = eo && eo.desc || '';
    this.use = eo && eo.use || '';
    this.qty = eo && eo.qty || new Quantity();
    this.hs = eo && eo.hs || undefined;
    this.opprop = eo && eo.opprop || [];
  }

  /**
   * 从多个EquipmentOp中继承下来
   * 这多个EquipmentOp的eclass是一样的
   * @param {IEquipmentOp[]} eos [description]
   */
  public DeriveFromEquipmentOps(eos: IEquipmentOp[]) {
    this.oid = eos[0].oid;
    this.eclass = eos[0].eclass;
    this.equipment = eos[0].equipment;
    this.desc = eos[0].desc;
    this.use = eos[0].use;
    this.qty.quantity = eos.map(item => item.qty.quantity)
      .reduce((prev, curr) => prev + curr);
    this.qty.unit = eos[0].qty.unit;
    this.hs = eos[0].hs;
    this.opprop = _.uniqBy(_.flatten(eos.map(item => item.opprop)), '_id');
  }
}

export interface IMaterialOp extends IMaterialBase {
  lot: IMlotElite[];
  subLot: IMsubLotElite[];
  loc: IHierarchyScope;
  ass: IMaterialOp[];
  hs: IHierarchyScope;
  opState: string;
  reason: IParameter[];
  date: Date;
  updateAt: Date;
}

export class MaterialOp {
  public _id: string;
  public oid: string;
  public mclass: any;
  public mdef: IMdefElite;
  public lot: IMlotElite[];
  public subLot: IMsubLotElite[];
  public desc: string;
  public use: string;
  public loc: IHierarchyScope;
  public qty: IQuantity;
  public ass: MaterialOp[];
  public assType: string;
  public assRel: string;
  public hs: IHierarchyScope;
  public opState: string;
  public reason: IParameter[];
  public opprop: IOpProp[];
  public date: Date;
  public updateAt: Date;

  constructor();
  constructor(mo: IMaterialSpec);
  constructor(mo: IMaterialOp);
  constructor(mo?: any) {
    this._id = mo && mo._id || undefined;
    this.oid = mo && mo.oid || '';
    this.mclass = mo && mo.mclass || undefined;
    this.mdef = mo && mo.mdef || undefined;
    this.lot = mo && mo.lot || undefined;
    this.subLot = mo && mo.subLot || undefined;
    this.desc = mo && mo.desc || '';
    this.use = mo && mo.use || '';
    this.loc = mo && mo.loc || undefined;
    this.qty = mo && mo.qty || new Quantity();
    this.ass = [];
    if(mo) {
      if(mo.ass) {
        this.ass = mo.ass;
      } else if(mo.assSpec) {
        this.ass = mo.assSpec;
      }
    }
    this.assType = mo && mo.assType || '';
    this.assRel = mo && mo.assRel || '';
    this.hs = mo && mo.hs || undefined;
    this.opprop = mo && mo.opprop || [];
    this.opState = mo && mo.opState || '';
    this.reason = mo && mo.reason || [];
    this.date = mo && mo.date || undefined;
    this.updateAt = mo && mo.updateAt || undefined;
  }
}

export interface IPersonnelCap extends IPersonnelSpec {
  capType: string;
  reason: string;
  conFactor: number;
  startTime: Date;
  endTime: Date;
  hs: IHierarchyScope;
}

export class PersonnelCap {
  public _id: string;
  public oid: string;
  public pclass: any;
  public person: any;
  public desc: string;
  public capType: string;
  public reason: string;
  public conFactor: number;
  public use: string;
  public startTime: Date;
  public endTime: Date;
  public qty: IQuantity;
  public hs: HierarchyScope;
  public opprop: IOpProp[];

  constructor();
  constructor(ps: IPersonnelSpec);
  constructor(pc: IPersonnelCap);
  constructor(pc?: any) {
    this._id = pc && pc._id || undefined;
    this.oid = pc && pc.oid || '';
    this.pclass = pc && pc.pclass || undefined;
    this.person = pc && pc.person || undefined;
    this.desc = pc && pc.desc || '';
    this.capType = pc && pc.capType || '';
    this.reason = pc && pc.reason || '';
    this.conFactor = pc && pc.conFactor || 1;
    this.startTime = pc && pc.startTime || undefined;
    this.endTime = pc && pc.endTime || undefined;
    this.use = pc && pc.use || '';
    this.qty = pc && pc.qty || new Quantity();
    this.hs = pc && pc.hs || undefined;
    this.opprop = pc && pc.opprop || [];
  }
}

export interface IEquipmentCap extends IEquipmentSpec {
  capType: string;
  reason: string;
  conFactor: number;
  startTime: Date;
  endTime: Date;
  hs: IHierarchyScope;
}

export class EquipmentCap {
  public _id: string;
  public oid: string;
  public eclass: any;
  public equipment: any;
  public desc: string;
  public capType: string;
  public reason: string;
  public conFactor: number;
  public use: string;
  public startTime: Date;
  public endTime: Date;
  public qty: IQuantity;
  public hs: IHierarchyScope;
  public opprop: IOpProp[];

  constructor();
  constructor(es: IEquipmentSpec);
  constructor(ec: IEquipmentCap);
  constructor(ec?: any) {
    this._id = ec && ec._id || undefined;
    this.oid = ec && ec.oid || '';
    this.eclass = ec && ec.eclass || undefined;
    this.equipment = ec && ec.equipment || undefined;
    this.desc = ec && ec.desc || '';
    this.capType = ec && ec.capType || '';
    this.reason = ec && ec.reason || '';
    this.conFactor = ec && ec.conFactor || 1;
    this.startTime = ec && ec.startTime || undefined;
    this.endTime = ec && ec.endTime || undefined;
    this.use = ec && ec.use || '';
    this.qty = ec && ec.qty || new Quantity();
    this.hs = ec && ec.hs || undefined;
    this.opprop = ec && ec.opprop || [];
  }
}

export interface IMaterialCap extends IMaterialBase {
  lot: IMlotElite[];
  subLot: IMsubLotElite[];
  desc: string;
  capType: string;
  reason: string;
  conFactor: number;
  startTime: Date;
  endTime: Date;
  loc: IHierarchyScope;
  ass: IMaterialCap[];
  hs: IHierarchyScope;
}

export class MaterialCap {
  public _id: string;
  public oid: string;
  public mclass: any;
  public mdef: IMdefElite;
  public lot: IMlotElite[];
  public subLot: IMsubLotElite[];
  public desc: string;
  public capType: string;
  public reason: string;
  public conFactor: number;
  public use: string;
  public startTime: Date;
  public endTime: Date;
  public loc: IHierarchyScope;
  public qty: IQuantity;
  public ass: MaterialCap[];
  public assType: string;
  public assRel: string;
  public hs: IHierarchyScope;
  public opprop: IOpProp[];

  constructor();
  constructor(ms: IMaterialSpec);
  constructor(mc: IMaterialCap);
  constructor(mc?: any) {
    this._id = mc && mc._id || undefined;
    this.oid = mc && mc.oid || '';
    this.mclass = mc && mc.mclass || undefined;
    this.mdef = mc && mc.mdef || undefined;
    this.lot = mc && mc.lot || undefined;
    this.subLot = mc && mc.sublot || undefined;
    this.desc = mc && mc.desc || '';
    this.capType = mc && mc.capType || '';
    this.reason = mc && mc.reason || '';
    this.conFactor = mc && mc.conFactor || 1;
    this.startTime = mc && mc.startTime || undefined;
    this.endTime = mc && mc.endTime || undefined;
    this.use = mc && mc.use || '';
    this.loc = mc && mc.loc || undefined;
    this.qty = mc && mc.qty || new Quantity();
    this.ass = [];
    if(mc) {
      if(mc.ass) {
        this.ass = mc.ass;
      } else if(mc.assSpec) {
        this.ass = mc.assSpec;
      }
    }
    this.assType = mc && mc.assType || '';
    this.assRel = mc && mc.assRel || '';
    this.hs = mc && mc.hs || undefined;
    this.opprop = mc && mc.opprop || [];
  }
}
