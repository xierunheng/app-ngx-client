import * as _ from 'lodash';
import { IQuantity, Quantity, IElite, IMaterialSpec } from './common';
import { IHierarchyScope } from './hs';
import { IParameter } from './parameter';
import { IMdefInfo } from './mdef';
import { IMlotElite } from './mlot';
import { IOpDefElite } from './op-def';
import { IOpRequestElite } from './op-req';
import { IOrderDefElite, OrderDefElite, IOrderDef } from './order-def';
import { WorkData, MaterialData } from '../data/util.service';

export interface ICustomer {
  oid: string;
  name: string;
  addr: string;
  contact: string;
}

//MongoDB里的JobOrder Schema
export interface IOrder {
  _id: string;
  oid: string;
  desc: string;
  PO: string;
  customer: ICustomer;
  priority: number;
  // orderDef: IOrderDefElite;
  orderDef: IOrderDef;
  opDef: IOpDefElite[];
  hs: IHierarchyScope;
  opReq: IOpRequestElite[];
  orderDate: Date,
  deliveryTime: Date,
  mlot: IMlotElite[];
  state: string;
  para: IParameter[];
}

export class Order {
  public _id: string;
  public oid: string;
  public desc: string;
  public PO: string;
  public customer: ICustomer;
  public priority: number;
  // public orderDef: IOrderDefElite;
  public orderDef: IOrderDef;
  public opDef: IOpDefElite[];
  public hs: IHierarchyScope;
  public opReq: IOpRequestElite[];
  public orderDate: Date;
  public deliveryTime: Date;
  public mlot: IMlotElite[];
  public state: string;
  public para: IParameter[];

  constructor();
  constructor(od: IOrder);
  constructor(od?: any) {
    this._id = od && od._id || undefined;
    this.oid = od && od.oid || '';
    this.desc = od && od.desc || '';
    this.PO = od && od.PO || '';
    this.customer = od && od.customer || undefined;
    this.priority = od && od.priority || 1;
    this.orderDef = od && od.orderDef || undefined;
    this.opDef = od && od.opDef || [];
    this.hs = od && od.hs || undefined;
    this.opReq = od && od.opReq || [];
    this.orderDate = od && od.orderDate || new Date();
    this.deliveryTime = od && od.deliveryTime || undefined;
    this.mlot = od && od.mlot || [];
    this.state = od && od.state || WorkData.reqStates[0];
    this.para = od && od.para || [];
  }

  public GetElite() {
    return new OrderElite(this);
  }

        /**
   * [根据 destMReq 获取工单的计划数量]
   * @return {IQuantity} [description]
   */
  public get qty(): IQuantity {
    let rnQty: IQuantity = new Quantity({
      quantity: 0,
      unit: '件'
    });
    if(this.mlot && this.mlot.length > 0) {
      rnQty.quantity = this.mlot.map(or => or.qty.quantity).reduce((prev, curr) => prev + curr);
      rnQty.unit = this.mlot[0].qty.unit;
    }
    return rnQty;
  }

  public DeriveFromOrderDef(ord: IOrderDef) {
    this.hs = ord.hs;
    this.orderDef = ord;
    this.para = ord.para;
    this.opDef = ord.opDef;
  }

}

//Mongodb中其他Schema中可能引用的WorkMaster Schema
export interface IOrderElite extends IElite {
  priority: number;
  deliveryTime: Date;
  opDef: IOpDefElite[];
}

export class OrderElite {
  public _id: string;
  public oid: string;
  public priority: number;
  public deliveryTime: Date;
  public opDef: IOpDefElite[];

  constructor();
  constructor(oe: IOrderElite);
  constructor(oe?: any) {
    this._id = oe && oe._id || undefined;
    this.oid = oe && oe.oid || '';
    this.priority = oe && oe.priority || 1;
    this.deliveryTime = oe && oe.deliveryTime || undefined;
    this.opDef = oe && oe.opDef || [];
  }
}

export interface IOrderProfile extends IElite {
  oid: string;
  desc: string;
  PO: string;
  customer: ICustomer;
  priority: number;
  orderDef: IOrderDefElite;
  opDef: IOpDefElite[];
  hs: IHierarchyScope;
  orderDate: Date,
  deliveryTime: Date,
  state: string;
}

/**
 * 订单的一项产品内容，用于布产
 */
export interface IOrderItem extends IElite {
  priority: number;
  deliveryTime: Date;
  items: IMaterialSpec;
}
