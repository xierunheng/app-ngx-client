import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { Quantity, IQuantity, IResProp, IElite } from './common';
import { IMclassElite } from './mclass';
import { MdefElite, IMdefElite } from './mdef';
import { IMlot, MlotElite, IMlotElite } from './mlot';
import { IPersonElite } from './person';
import { IEquipmentElite } from './equipment';
import { UtilData, MaterialData } from '../data/util.service';
import { IMOpLog } from './base/oplog';

//MongoDB里的 MaterialSubLot Schema
export interface IMsubLot {
  _id: string;
  oid: string;
  usedOid: string[];
  desc: string;
  hs: IHierarchyScope;
  status: string;
  prop: IResProp[];
  loc: IHierarchyScope;
  qty: IQuantity;
  mclass: IMclassElite[];
  mdef: IMdefElite;
  mlot: IMlotElite;
  assLot: IElite[];
  assSubLot: IElite[];
  assType: string;
  assRel: string;
  molder: IPersonElite;
  driedTime: Date;
  kiln: IEquipmentElite;
  kilnTime: Date;
  qcer: IPersonElite;
  qcState: string;
  qcTime: Date;
  reason: IParameter[];
  repairType: string;
  order: IElite;
  carton: IElite;
  pallet: IElite;
  inver: IPersonElite;
  invTime: Date;
  opState: string;
  oplog: IMOpLog[];
  subLot: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class MsubLot {
  public _id: string;
  public oid: string;
  public usedOid: string[];
  public desc: string;
  public hs: IHierarchyScope;
  public status: string;
  public prop: IResProp[];
  public loc: IHierarchyScope;
  public qty: IQuantity;
  public mclass: IMclassElite[];
  public mdef: IMdefElite;
  public mlot: IMlotElite;
  public assLot: IElite[];
  public assSubLot: IElite[];
  public assType: string;
  public assRel: string;
  public molder: IPersonElite;
  public driedTime: Date;
  public kiln: IEquipmentElite;
  public kilnTime: Date;
  public qcer: IPersonElite;
  public qcState: string;
  public qcTime: Date;
  public reason: IParameter[];
  public repairType: string;
  public order: IElite;
  public carton: IElite;
  public pallet: IElite;
  public inver: IPersonElite;
  public invTime: Date;
  public opState: string;
  public oplog: IMOpLog[];
  public subLot: any[];
  public createdAt: Date;
  public updatedAt: Date;
  //物料子批次的最大可用数量，该数量限制子批次数和单批数量
  //默认值 10000，保证更新时有效
  public maxAvailableQuantity?: number = 10000;
  //扫码这个子批次，同时跟出这个成型工今天扫的所有子批次的统计信息
  public mActCount?: any;
  //扫码的总数
  public mQty?: IQuantity;

  constructor();
  constructor(msl: IMsubLot);
  constructor(msl?: any) {
    this._id = msl && msl._id || undefined;
    this.oid = msl && msl.oid || '';
    this.usedOid = msl && msl.usedOid || [];
    this.desc = msl && msl.desc || '';
    this.hs = msl && msl.hs || undefined;
    this.status = msl && msl.status || '';
    this.prop = msl && msl.prop || [];
    this.loc = msl && msl.loc || undefined;
    this.qty = msl && msl.qty || new Quantity({
      quantity: 1,
      unit: '件',
    });
    this.mclass = msl && msl.mclass || [];
    this.mdef = msl && msl.mdef || undefined;
    this.mlot = msl && msl.mlot || undefined;
    this.assLot = msl && msl.assLot || [];
    this.assSubLot = msl && msl.assSubLot || [];
    this.assType = msl && msl.assType || '';
    this.assRel = msl && msl.assRel || '';
    this.molder = msl && msl.molder || undefined;
    this.driedTime = msl && msl.driedTime || undefined;
    this.kiln = msl && msl.kiln || undefined;
    this.kilnTime = msl && msl.kilnTime || undefined;
    this.qcer = msl && msl.qcer || undefined;
    this.qcState = msl && msl.qcState || '';
    this.qcTime = msl && msl.qcTime || undefined;
    this.reason = msl && msl.reason || [];
    this.repairType = msl && msl.repairType || '';
    this.order = msl && msl.order || undefined;
    this.carton = msl && msl.carton || undefined;
    this.pallet = msl && msl.pallet || undefined;
    this.inver = msl && msl.inver || undefined;
    this.invTime = msl && msl.invTime || undefined;
    this.opState = msl && msl.opState || MaterialData.BodyOps.create.state;
    this.oplog = msl && msl.oplog || [];
    this.subLot = msl && msl.subLot || [];
    this.createdAt = msl && msl.createdAt || undefined;
    this.updatedAt = msl && msl.updatedAt || undefined;
  }

  //从单个的 Material 中继承相关属性，默认 Material 一般是单选的
  public static DeriveFromMLot(ml: IMlot): MsubLot {
    const msl = new MsubLot();
    msl.hs = ml.hs;
    msl.status = ml.status;
    msl.prop = ml.prop;
    msl.mclass = ml.mclass;
    msl.mdef = ml.mdef;
    msl.mlot = new MlotElite(ml);
    msl.loc = ml.loc;
    msl.assType = ml.assType;
    msl.assRel = ml.assRel;
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      let ol: IMOpLog = {
        op: MaterialData.BodyOps.create.text,
        proseg: user.ps,
        hs: user.hs,
        date: new Date(),
        reason: undefined,
        psub: user.psub,
        esub: undefined,
        jr: undefined,
      }
      msl.oplog.push(ol);
    }
    msl.maxAvailableQuantity = ml.qty.quantity - ml.subQty.quantity;
    return msl;
  }

  //物料子批次编码的头两位
  //1: 坯体： 00-97
  //2. 纸箱： 98
  //3. 托盘： 99
  public get Code() {
    let code = '00';
    if (this.mclass && this.mclass[0].oid !== UtilData.txtPT) {
      code = this.mclass[0].code;
    }
    return code;
  }

  public GetElite() {
    return new MsubLotElite(this);
  }
}

//MongoDB中其他Schema中可能引用的 MaterialSubLotElite Schema
export interface IMsubLotElite extends IElite {
  qty: IQuantity;
  molder: IPersonElite;
  usedOid?: string[];
  status?: string;
}

export class MsubLotElite {
  public _id: string;
  public oid: string;
  public qty: IQuantity;
  public molder: IPersonElite;
  public usedOid?: string[];
  public status?: string;

  constructor();
  constructor(mlse: IMsubLotElite);
  constructor(mlse?: any) {
    this._id = mlse && mlse._id || undefined;
    this.oid = mlse && mlse.oid || '';
    this.qty = mlse && mlse.qty || undefined;
    this.usedOid = mlse && mlse.usedOid || [];
    this.status = mlse && mlse.status || '';
  }
}

export interface IMsubLotProfile extends IMsubLotElite {
  mclass: IMclassElite[];
  mdef: IMdefElite;
  mlot: IMlotElite;
  loc: IHierarchyScope;
  prop: IResProp[];
  assSubLot: IElite[];
  opState: string;
  kiln: IEquipmentElite;
  qcer: IPersonElite;
  qcState: string;
  qcTime: Date;
  repairType: string;
  reason: IParameter[];
}

export class MsubLotProfile {
  public _id: string;
  public oid: string;
  public usedOid: string[];
  public qty: IQuantity;
  public mclass: IMclassElite[];
  public mdef: IMdefElite;
  public mlot: IMlotElite;
  public loc: IHierarchyScope;
  public prop: IResProp[];
  public assSubLot: IElite[];
  public opState: string;
  public molder: IPersonElite;
  public kiln: IEquipmentElite;
  public qcer: IPersonElite;
  public qcState: string;
  public qcTime: Date;
  public repairType: string;
  public reason: IParameter[];

  constructor();
  constructor(mlsp: IMsubLotProfile);
  constructor(mlsp?: any) {
    this._id = mlsp && mlsp._id || undefined;
    this.oid = mlsp && mlsp.oid || '';
    this.usedOid = mlsp && mlsp.usedOid || [];
    this.qty = mlsp && mlsp.qty || undefined;
    this.mclass = mlsp && mlsp.mclass || [];
    this.mdef = mlsp && mlsp.mdef || undefined;
    this.mlot = mlsp && mlsp.mlot || undefined;
    this.loc = mlsp && mlsp.loc || undefined;
    this.prop = mlsp && mlsp.prop || undefined;
    this.assSubLot = mlsp && mlsp.assSubLot || undefined;
    this.opState = mlsp && mlsp.opState || undefined;
    this.molder = mlsp && mlsp.molder || undefined;
    this.kiln = mlsp && mlsp.kiln || undefined;
    this.qcer = mlsp && mlsp.qcer || undefined;
    this.qcState = mlsp && mlsp.qcState || '';
    this.qcTime = mlsp && mlsp.qcTime || undefined;
    this.repairType = mlsp && mlsp.repairType || '手工';
    this.reason = mlsp && mlsp.reason || [];
  }
}
