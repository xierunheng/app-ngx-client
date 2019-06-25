import { IHierarchyScope } from '../hs';
import { IProsegElite } from '../proseg';
import { IPsubProfile } from '../psub';
import { IEsubProfile } from '../esub';
import { IJobResponseElite } from '../job-response';
import { IParameter } from '../parameter';
import { IMsubLotProfile } from '../msublot';

/**
 * 终端操作日志，记录终端的常规操作，
 * 除了人。机。料之外的其他基本操作信息
 * 包括操作名称，操作工序，操作工位，操作时间，操作所在的工单，操作的结果或原因等
 */
export interface IOpLog {
  //操作名称
  op: string;
  //工序，
  proseg: IProsegElite;
  //工位
  hs: IHierarchyScope,
  //时间
  date: Date;
  //缺陷项或其他
  reason: IParameter[];
}

/**
 * 从物料的维度，对终端操作日志进行记录
 */
export interface IMOpLog extends IOpLog {
  //员工
  psub: IPsubProfile;
  //操作的设备，后续会替代 person 的重要性
  esub: IEsubProfile;
  //工单
  jr: IJobResponseElite;
}

/**
 * 从员工的维度，对终端操作日志进行记录
 */
export interface IPOpLog extends IOpLog {
  //物料，用profile，不仅仅是elite信息
  subLot: IMsubLotProfile;
  //操作的设备，后续会替代 person 的重要性
  esub: IEsubProfile;
  //工单
  jr: IJobResponseElite;
}

/**
 * 从设备的维度，对终端操作日志进行记录
 */
export interface IEOpLog extends IOpLog {
  //物料，用profile，不仅仅是elite信息
  subLot: IMsubLotProfile;
  //员工
  psub: IPsubProfile;
  //工单
  jr: IJobResponseElite;
}

/**
 * 从工单的维度，对终端操作日志进行记录，
 * 记录操作过程中的整个的人/机/料资源
 */
export interface IJOpLog extends IOpLog {
  //员工
  psub: IPsubProfile;
  //操作的设备，后续会替代 person 的重要性
  esub: IEsubProfile;
  //物料，用profile，不仅仅是elite信息
  subLot: IMsubLotProfile;
}

