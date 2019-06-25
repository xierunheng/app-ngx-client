import { IElite } from './common';
/**
 * 这种形式的 interface 还是需要的，
 * 即使是IQuantity 的早期约束，还是需要以这种方式呈现
 */
export interface IValue {
  valueStr: string;
  dataType?: string;
  unit: string;
  key?: string;
}

export class Value {
  public valueStr: string;
  public dataType?: string;
  public unit: string;
  public key?: string;

  constructor();
  constructor(v: IValue);
  constructor(v?: any) {
    this.valueStr = v && v.valueStr || '';
    this.dataType = v && v.dataType || '';
    this.unit = v && v.unit || '';
    this.key = v && v.key || '';
  }
}


export interface IParameter {
  _id: string;
  oid: string;
  desc: string;
  value: IValue;
  active: boolean;
  //在最终的数据存储时，不需要tags标签信息，
  tags?: string[];
}

export class Parameter {
  public _id: string;
  public oid: string;
  public desc: string;
  public value: IValue;
  public active: boolean;
  public tags?: string[];

  constructor();
  constructor(para:IParameter);
  constructor(para?: any) {
    this._id = para && para._id || undefined;
    this.oid = para && para.oid || '';
    this.desc = para && para.desc || '';
    this.value = para && para.value || new Value();
    this.active = para && para.active || false; 
    this.tags = para && para.tags || [];
  }
}

export interface IParameterElite extends IElite {

}

export class ParameterElite {
  public _id: string;
  public oid: string;

  constructor();
  constructor(pe: IParameterElite);
  constructor(pe?: any) {
    this._id = pe && pe._id || undefined;
    this.oid = pe && pe.oid || '';
  }
}

export interface IParameterProfile extends IElite {
  desc: string;
  value: IValue;
  active: boolean;
}

export class ParameterProfile {
  public _id: string;
  public oid: string;
  public desc: string;
  public value: IValue;
  public active: boolean;

  constructor();
  constructor(pp: IParameterProfile);
  constructor(pp?: any) {
    this._id = pp && pp._id || undefined;
    this.oid = pp && pp.oid || '';
    this.desc = pp && pp.desc || '';
    this.value = pp && pp.value || new Value();
    this.active = pp && pp.active || false;
  }
}
