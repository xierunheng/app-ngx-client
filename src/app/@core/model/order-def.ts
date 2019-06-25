import * as _ from 'lodash';

import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IQuantity, Quantity, IElite, IMaterialSpec } from './common';
import { IOpDefElite, OpDefElite, IOpDef } from './op-def';
import { MaterialData } from '../data/util.service';

/**
 * OrderDefiniton Schema
 */
export interface IOrderDef {
  _id: string;
  oid: string;
  ver: string;
  desc: string;
  hs: IHierarchyScope;
  pubDate: Date;
  opDef: IOpDefElite[];
  items: IMaterialSpec[];
  para: IParameter[];
}

export class OrderDef {
  public _id: string;
  public oid: string;
  public ver: string;
  public desc: string;
  public hs: IHierarchyScope;
  public pubDate: Date;
  public opDef: IOpDefElite[];
  public items: IMaterialSpec[];
  public para: IParameter[];


  constructor();
  constructor(od: IOrderDef);
  constructor(od?: any) {
    this._id = od && od._id || undefined;
    this.oid = od && od.oid || '';
    this.ver = od && od.ver || '';
    this.desc = od && od.desc || '';
    this.hs = od && od.hs || undefined;
    this.pubDate = od && od.pubDate || new Date();
    this.opDef = od && od.opDef || [];
    this.items = od && od.items || [];
    this.para = od && od.para || [];
  }

  public GetElite() {
    return new OrderDefElite(this);
  }

  /**
   * 从OPdefinition 获取 items信息，保证订单定义的信息和操作定义的信息一致
   * 在这里，对操作定义中的清单项进行过滤和筛选，把最佳的提取出来
   * 后续这个操作需要通过依赖项 串起来
   * 1. 如果是新的项，直接push
   * 2. 如果是重复项，depends
   * 2.1 如果重复项由属性，把属性合并到老的项
   * 2.2 如果有ass装配项，合并属性并且替换
   * @param {IOpDef[]} opds [description]
   */
  public DeriveFormOpDef(opds: IOpDef[]) {
    let items: IMaterialSpec[] = [];
    opds.forEach(opd => {
      opd.opmb.forEach(opmb => {
        opmb.opmbItem.forEach(oi => {
          if( oi.use !== MaterialData.useTypes[0]) {
            let index = items.findIndex(item => item.oid === oi.oid);
            if(index > -1) {
              if(oi.opprop && oi.opprop.length > 0) {
                items[index].opprop = _.unionBy(oi.opprop, items[index].opprop, '_id');
              }
              if(oi.assSpec && oi.assSpec.length > 0) {
                oi.opprop = _.unionBy(oi.opprop, items[index].opprop, '_id');
                items.splice(index, 1, oi);
              }
            } else {
              items.push(oi);
            }
          }
        });
      });
    });
    this.items = items;
    this.opDef = opds.map(opd => new OpDefElite(opd));
  }
}

//Mongodb中其他Schema中可能引用的OpSeg Schema
export interface IOrderDefElite extends IElite {
  ver: string;
}

export class OrderDefElite {
  public _id: string;
  public oid: string;
  public ver: string;

  constructor();
  constructor(ode: IOrderDefElite);
  constructor(ode?: any) {
    this._id = ode && ode._id || undefined;
    this.oid = ode && ode.oid || '';
    this.ver = ode && ode.ver || '';
  }
}

export interface IOrderDefProfile extends IElite {
  ver: string;
  desc: string;
  hs: IHierarchyScope;
  pubDate: Date;
}

export class OrderDefProfile {
  public _id: string;
  public oid: string;
  public ver: string;
  public desc: string;
  public hs: IHierarchyScope;
  public pubDate: Date;

  constructor();
  constructor(odp: IOrderDefProfile);
  constructor(odp?: any) {
    this._id = odp && odp._id || undefined;
    this.oid = odp && odp.oid || '';
    this.ver = odp && odp.ver || '';
    this.desc = odp && odp.desc || '';
    this.hs = odp && odp.hs || undefined;
    this.pubDate = odp && odp.pubDate || new Date();
  }
}
