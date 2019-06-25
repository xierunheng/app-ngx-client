import { Observable, Subject } from 'rxjs';

import { IHierarchyScope } from './hs';
import { IMclass } from './mclass';
import { IMdef, IMdefProfile } from './mdef';
import { IPclass } from './pclass';
import { IEclass } from './eclass';
import { IParameter } from './parameter';
import { TreeviewItem } from 'ngx-treeview';

export class GlobalData {

	/**
	 * [层级结构的静态数据，]
	 * @type {IHerarchyScope[]}
	 */
	public static hss: IHierarchyScope[] = [];

  public static hss$: Observable<IHierarchyScope[]>;
	/**
	 * [层级结构树，用于所有界面中的 hierarchyScope 的选择]
	 * @type {any[]}
	 */
	public static hstree: TreeviewItem[] = [];

  /**
   * [物料类型的静态数据，包括 material elite 列表]
   * @type {IMclass[]}
   */
  public static mcs: IMclass[] = [];

  /**
   * [物料定义选择树，物料定义层面上是静态数据]
   * @type {TreeviewItem[]}
   */
  public static mtree: TreeviewItem[] = [];

  /**
   * [物料定义的profile，用于物料定义的选择 和 装配项的选择]
   * @type {IMdefProfile[]}
   */
  public static mdp: IMdefProfile[] = [];

  /**
   * [虚拟的坯体，用于条码领用时，赋予坯体的物料定义]
   * @type {IMdef}
   */
  public static dummyBody: IMdef = undefined;

  /**
   * [员工类型的静态数据，包括 person elite 列表]
   * @type {IPclass[]}
   */
  public static pcs: IPclass[] = [];

  /**
   * [员工类型的静态数据，包括 person elite 列表]
   * @type {IEclass[]}
   */
  public static ecs: IEclass[] = [];

	/**
	 * [属性项数组，用于所有界面中的 parameter 或 prop 的选择 ]
	 * @type {any[]}
	 */
	public static paras: IParameter[] = [];

	/**
	 * [是否显示同样的属性，在选择了属性后，该属性是否可再选]
	 * @type {boolean}
	 */
	public static showSamePara: boolean = false;

}
