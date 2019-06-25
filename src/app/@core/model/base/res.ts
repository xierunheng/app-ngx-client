import * as _ from 'lodash';
import { IQuantity, Quantity, IElite, IMaterialOp } from '../common';
import { MaterialData } from '../../data/util.service';
import { IJOpLog } from './oplog';

export abstract class Response {
  /**
   * [计算 IMaterialOp 数组的产出]
   * @param  {IMaterialOp[]} arrMO [description]
   * @return {any}                 [description]
   */
  public calcOutput(arrMO: IMaterialOp[]): any {
    return _.mapValues(_.groupBy(arrMO, 'mdef.oid'), items => {
      return items.map(item => item.qty ? item.qty.quantity : 0).reduce((prev, curr) => prev + curr);
    });
  }

	/**
	 * [计算 IMaterialOp 带 成型工的 产出]
	 * @param  {IMaterialOp[]} arrMO [description]
	 * @return {any}                 [description]
	 */
  public calcOutputWithMolder(arrMO: IMaterialOp[]): any {
    return _.mapValues(_.groupBy(arrMO, 'subLot[0].molder.oid'), datas => {
      return this.calcOutput(datas);
    });
  }

  /**
   * [获取工单的缺陷项]
   * like {针孔: 2, 成变: 2, 硬裂: 1, 粗糙: 1, 变形: 1}
   * 1.mAct -> 有缺陷的 mAct
   * 2. map 缺陷
   * 3. countby, 统计缺陷数量
   * 4. toPairs,转换为数组，为排序做准备
   * 5. 按照数组的 第 ‘1’ 个字段排序，降序, desc for 降序
   * 6. 还原为 object
   * @param  {IMaterialOp[]} arrMO [description]
   * @return {any}                 [description]
   */
  public calcQCI(arrMO: IMaterialOp[]): any {
    return _.fromPairs(_.orderBy(_.toPairs(_.countBy(_.flatten(
      arrMO
        .filter(mo => mo.opState === MaterialData.BodyOps.reject.state)
        .map(mo => mo.reason)), 'oid')), ['1'], ['desc']));
  }

  /**
   * [工单通过日志中的记录，计算工单的缺陷项]
   * like {针孔: 2, 成变: 2, 硬裂: 1, 粗糙: 1, 变形: 1}
   * 1.oplog -> 有缺陷的oplog
   * 1.5 去除重复项，例如：对一个坯体又undo，又scrap
   * 2. map 缺陷
   * 3. countby, 统计缺陷数量
   * 4. toPairs,转换为数组，为排序做准备
   * 5. 按照数组的 第 ‘1’ 个字段排序，降序, desc for 降序
   * 6. 还原为 object
   * @param  {IJOpLog[]} arrLog [description]
   * @return {any}              [description]
   */
  public calcJobQCI(arrLog: IJOpLog[]): any {
    return _.fromPairs(_.orderBy(_.toPairs(_.countBy(_.flatten(_.uniqBy(
      arrLog
        .filter(log => log.op === MaterialData.BodyOps.undo.text ||
          log.op === MaterialData.BodyOps.scrap.text ||
          log.op === MaterialData.BodyOps.reject.text), 'subLot.oid')
        .map(log => log.reason)), 'oid')), ['1'], ['desc']));
  }

	/**
	 * [计算 IMaterialOp 的QCI pareto]
	 * @param  {IMaterialOp[]} arrMO [description]
	 * @return {any}                 [description]
	 */
  public calcQCIPareto(arrMO: IMaterialOp[]): any {
    let pareto = [];
    let qci = this.calcQCI(arrMO);
    pareto.push(qci);
    let total = _.sum(_.toArray(qci));
    let count = 0;
    let ratio = _.mapValues(qci, item => {
      count += item;
      return Math.round(count / total * 100);
    });
    pareto.push(ratio);
    return pareto;
  }

  /**
   * [计算 IMaterialOp 的QCI parato]
   * @param  {IMaterialOp[]} arrMO [description]
   * @return {any}                 [description]
   */
  public calcJobQCIPareto(arrLog: IJOpLog[]): any {
    let pareto = [];
    let qci = this.calcJobQCI(arrLog);
    console.log(qci);
    pareto.push(qci);
    let total = _.sum(_.toArray(qci));
    let count = 0;
    let ratio = _.mapValues(qci, item => {
      count += item;
      return Math.round(count / total * 100);
    });
    pareto.push(ratio);
    return pareto;
  }

  /**
   * [计算 IMateraloOp 带时间戳的产出]
   * @param  {IMaterialOp[]} arrMO [description]
   * @return {any}                 [description]
   */
  public calcOutputWithTime(arrMO: IMaterialOp[]): any {
    let count = 0;
    return arrMO.map(mo => {
      count += mo.qty.quantity;
      return [mo.date, count];
    });
  }

  /**
   * [用oplog呈现待时间戳的日志]
   * @param  {IJOpLog[]} arrLog [description]
   * @return {any}              [description]
   */
  public calcOpLog(arrLog: IJOpLog[]): any {
    let count = 0;
    return arrLog.map(log => {
      if(log.op === MaterialData.BodyOps.undo.text ||
        log.op === MaterialData.BodyOps.scrap.text ||
        log.op === MaterialData.BodyOps.reject.text) {
        count -= 1;
      } else {
        count += 1;
      }
      return [log.date, count, log];
    });
  }

}
