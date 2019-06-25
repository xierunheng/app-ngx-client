import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { Quantity, IQuantity, IResProp, IElite, IMaterialOp } from './common';
import { IPersonElite, IPerson, PersonElite } from './person';
import { IPclassElite } from './pclass';
import { IPOpLog } from './base/oplog';

//MongoDB里的 PersonnelSub Schema
export interface IPsub {
  _id: string;
  oid: string;
  desc: string;
  hs: IHierarchyScope;
  status: string;
  prop: IResProp[];
  qty: IQuantity;
  ngqty: IQuantity;
  mAct: IMaterialOp[];
  ngmAct: IMaterialOp[];
  reasons: IParameter[];
  oplog: IPOpLog[];
  pclass: IPclassElite[];
  person: IPersonElite;
}

export class Psub {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public status: string;
  public prop: IResProp[];
  public qty: IQuantity;
  public ngqty: IQuantity;
  public mAct: IMaterialOp[];
  public ngmAct: IMaterialOp[];
  public reasons: IParameter[];
  public oplog: IPOpLog[];
  public pclass: IPclassElite[];
  public person: IPersonElite;

  constructor();
  constructor(ps: IPsub);
  constructor(ps?: any) {
    this._id = ps && ps._id || undefined;
    this.oid = ps && ps.oid || '';
    this.desc = ps && ps.desc || '';
    this.hs = ps && ps.hs || undefined;
    this.status = ps && ps.status || '';
    this.prop = ps && ps.prop || [];
    this.qty = ps && ps.qty || new Quantity({
      quantity: 0,
      unit: '件',
    });
    this.ngqty = ps && ps.ngqty || new Quantity({
      quantity: 0,
      unit: '件',
    });
    this.oplog = ps && ps.oplog || [];
    this.pclass = ps && ps.pclass || [];
    this.person = ps && ps.person || undefined;
  }

  public GetElite() {
    return new PsubElite(this);
  }

  //从单个的 Person 中继承相关属性，默认 person 一般是单选的
  public DeriveFromPerson(p: IPerson) {
    this.hs = p.hs;
    this.prop = p.prop;
    this.pclass = p.pclass;
    this.person = new PersonElite(p);
  }
}



//MongoDB中其他Schema中可能引用的 MaterialSubLotElite Schema
export interface IPsubElite extends IElite {
}

export class PsubElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(pse: IPsubElite);
  constructor(pse?: any) {
    this._id = pse && pse._id || undefined;
    this.oid = pse && pse.oid || '';
  }
}

export interface IPsubProfile extends IPsubElite{
  oid: string;
  pclass: IPclassElite[];
  person: IPersonElite;
  prop: IResProp[];
  desc: string;
  qty: IQuantity;
  ngqty: IQuantity;
  hs: IHierarchyScope;
}

export class PsubProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public hs: IHierarchyScope;
  public pclass: IPclassElite[];
  public person: IPersonElite;
  public prop: IResProp[];
  public qty: IQuantity;
  public ngqty: IQuantity;


  constructor();
  constructor(psp: IPsubProfile);
  constructor(psp?: any) {
    this._id = psp && psp._id || undefined;
    this.oid = psp && psp.oid || '';
    this.desc = psp && psp.desc || '';
    this.hs = psp && psp.hs || undefined;
    this.pclass = psp && psp.pclass || [];
    this.person = psp && psp.person || undefined;
    this.prop = psp && psp.prop || undefined;
    this.qty = psp && psp.qty || new Quantity({
      quantity: 0,
      unit: '件',
    });
    this.ngqty = psp && psp.ngqty || new Quantity({
      quantity: 0,
      unit: '件',
    });
  }
}
