import { IHierarchyScope } from './hs';
import { IProsegElite } from './proseg';
import { IPersonElite } from './person';
import { IPsubProfile } from './psub';

export interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  //登陆的人员信息
  person?: IPersonElite;
  //登陆的操作信息，属于终端登录 
  op?: string;
  //登陆的工序，属于终端登录
  ps?: IProsegElite;
  //登陆的工位
  hs?: IHierarchyScope;
  //登陆后，员工的作业段
  psub?: IPsubProfile;
  rememberMe?: boolean;
  id?: string;
  provider?: string;
  salt?: string;
}

//MongoDB里的EquipmentClass Schema
export class User {
  public _id: string;
  public name: string;
  public email: string;
  public role: string;
  public password: string;
  public op: string;
  public person?: IPersonElite;
  public ps?: IProsegElite;
  public hs?: IHierarchyScope;
  public psub?: IPsubProfile;
  public rememberMe?: boolean;
  public id?: string;
  public provider?: string;
  public salt?: string;

  constructor();
  constructor(user: IUser);
  constructor(user?: any) {
    this._id = user && user._id || undefined;
    this.name = user && user.name || '';
    this.email = user && user.email || '';
    this.role = user && user.role || '';
    this.password = user && user.password || '';
    this.op = user && user.op || '';
    this.person = user && user.person || undefined;
    this.ps = user && user.ps || undefined;
    this.psub = user && user.psub || undefined;
    this.rememberMe = user && user.rememberMe || false;
    this.id = user && user.id || '';
    this.provider = user && user.privider || '';
    this.salt = user && user.salt || '';
  }

}
