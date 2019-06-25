import { IUser } from './user';
import { IHierarchyScope } from './hs';
import { IProsegElite } from './proseg';

export interface ITerminalUser extends IUser {
  ps?: IProsegElite;
  hs?: IHierarchyScope;
}

//MongoDB里的EquipmentClass Schema
export class TerminalUser {
  public _id: string;
  public name: string;
  public email: string;
  public role: string;
  public password: string;
  public provider?: string;
  public salt?: string;
  public ps?: IProsegElite;
  public hs?: IHierarchyScope;

  constructor();
  constructor(user: ITerminalUser);
  constructor(user?: any) {
    this._id = user && user._id || undefined;
    this.name = user && user.name ||  '';
    this.email = user && user.email ||  '';
    this.role = user && user.role ||  '';
    this.password = user && user.password || '';
    this.provider = user && user.privider || '';
    this.salt = user && user.salt || '';
    this.ps = user && user.ps ||  undefined;
    this.hs = user && user.hs || undefined;
  }

}
