export interface IHierarchyScope {
  _id: string;
  name: string;
  code: string;
  level: string;
  path: string;
  remark: string;
}

export class HierarchyScope {
  public _id: string;
  public name: string;
  public code: string;
  public level: string;
  public path: string;
  public remark: string;

  constructor();
  constructor(hs: IHierarchyScope );
  constructor(hs?: any) {
    this._id = hs && hs._id || undefined;
    this.name = hs && hs.name || '';
    this.code = hs && hs.code || '';
    this.level = hs && hs.level || 'Enterprise';;
    this.path = hs && hs.path || ',';
    this.remark = hs && hs.remark || '';
  }
}

//Mongodb中其他Schema中可能引用的HierarchyScope Schema
export interface IHSElite {
  _id: string;
  name: string;
  code: string;
}

export class HSElite {
  public _id: string;
  public name: string;
  public code: string;

  constructor();
  constructor(hse: IHSElite);
  constructor(hse?: any) {
    this._id = hse && hse._id || undefined;
    this.name = hse && hse.name || '';
    this.code = hse && hse.code || '';
  }
}

//Mongodb中其他Schema中可能引用的HierarchyScope Schema
export interface IHSProfile {
  _id: string;
  name: string;
  code: string;
  path: string;
}

export class HSProfile {
  public _id: string;
  public name: string;
  public code: string;
  public path: string;

  constructor();
  constructor(hsp: IHSProfile);
  constructor(hsp?: any) {
    this._id = hsp && hsp._id || undefined;
    this.name = hsp && hsp.name || '';
    this.code = hsp && hsp.code || '';
    this.path = hsp && hsp.path || ',';
  }
}

