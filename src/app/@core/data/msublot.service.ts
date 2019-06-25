import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { MaterialData } from './util.service';
import { IMlot, IMlotElite } from '../model/mlot';
import { IMdefElite } from '../model/mdef';
import { IEquipmentElite } from '../model/equipment';
import { IMsubLot, MsubLot, IMsubLotElite, IMsubLotProfile } from '../model/msublot';
import { ITerminal } from '../model/terminal';
import { IPerson } from '../model/person';
import { IExistService } from './common.service';
import { IElite } from '../model/common';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MsubLotService implements IExistService {
  private baseUrl = '/api/materialSubLots';

  private eliteFields = '_id oid usedOid mlot mdef mclass molder ';
  private profileFields = '_id oid usedOid desc hs status mlot mdef mclass molder loc qty assSubLot opState repairType';

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private socketService: SocketService) {
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better jobOrder of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MsubLotService: ${message}`);
  }

  /**
   * 获取所有的物料子批次信息
   * @return {Observable<IMsubLot[]>} [物料子批次 Array]
   */
  getMsubLots(field: string = '', sort: string = '-_id'): Observable<IMsubLot[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IMsubLot[]>(url)
      .pipe(
        tap(_ => this.log('fetched MsubLots')),
        catchError(this.handleError('getMsubLots', []))
      );
  }

  /**
   * 获取所有的物料子批次关键信息
   * @return {Observable<IMsubLotElite[]>} [物料子批次关键信息 Array]
   */
  getMsubLotsElite(): Observable<IMsubLotElite[]> {
    return this.getMsubLots(this.eliteFields);
  }

  /**
   * 获取所有的物料子批次 profile 信息
   * @return {Observable<IMsubLotProfile[]>} [物料子批次 profile 信息 Array]
   */
  getMsubLotsProfile(): Observable<IMsubLotProfile[]> {
    return this.getMsubLots(this.profileFields);
  }

  /**
   * 通过查询条件，获取 Msullot 信息
   * 当查询不到时，返回 undefined
   */
  getMsublotNo404<Data>(query: any): Observable<IMsubLot> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IMsubLot[]>(url)
      .pipe(
        map(Msublots => Msublots[0]), // returns a {0|1} element array
        tap(Msublot => {
          const outcome = Msublot ? `fetched` : `did not find`;
          this.log(`${outcome} Msublot _id=${qstr}`);
        }),
        catchError(this.handleError<IMsubLot>(`getMsublot ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询 Msublots，可设定查询的相关选项]
   * @param  {any}                    query [查询条件，key-value object]
   * @param  {string              =     ''}          field [查询返回的字段]
   * @param  {string              =     '-_id'}      sort  [排序字段]
   * @param  {number              =     0}           limit [查询返回的数量限制]
   * @param  {number              =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMsubLot[]>}       [查询结果，Msublot 数组]
   */
  searchMsublots(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMsubLot[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMsubLot[]>(url)
      .pipe(
        tap(_ => this.log(`found MsubLots matching "${qstr}"`)),
        catchError(this.handleError<IMsubLot[]>('searchMsublots', []))
      );
  }

  /**
   * [通过过滤条件查询 Msublots，可设定查询的相关选项]
   * @param  {any}                    query [查询条件，key-value object]
   * @param  {string              =     ''}          field [查询返回的字段]
   * @param  {string              =     '-_id'}      sort  [排序字段]
   * @param  {number              =     0}           limit [查询返回的数量限制]
   * @param  {number              =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMsubLot[]>}       [查询结果，Msublot 数组]
   */
  searchMsublotsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 1000, skip: number = 0): Observable<IMsubLot[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMsubLot[]>(url)
      .pipe(
        tap(_ => this.log(`found Msublots matching "${query}"`)),
        catchError(this.handleError<IMsubLot[]>('searchMsublots', []))
      );
  }

  /**
   * [统计设备类型的工作信息]
   * @param  {any}               hs        [层级结构]
   * @param  {Date}              startTime [统计开始时间]
   * @param  {Date}              endTime   [统计结束时间]
   * @return {Observable<any[]>}           [返回的统计结果]
   */
  aggrClass(hs: any, startTime: Date, endTime: Date) : Observable<any[]> {
    let query = {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    };
    const url = `${this.baseUrl}/aggrclass/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate msublot class matching "${query}"`)),
        catchError(this.handleError<any[]>('aggrQty', []))
      );
  }

  aggregate(timefield:string, statistic: any, query: any, group: any, unwind=''): Observable<any[]> {
    const url = `${this.baseUrl}/aggregate/?timefield=${timefield}&statistic=${encodeURIComponent(JSON.stringify(statistic))}&filters=${encodeURIComponent(JSON.stringify(query))}&group=${encodeURIComponent(JSON.stringify(group))}&$unwind=${unwind}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate msublot matching "${query}"`)),
        catchError(this.handleError<any[]>('aggregate', []))
      );
  }

  /**
   * [统计设备的具体工作信息]
   * @param  {string}            group     [分组项]
   * @param  {any}               hs        [层级结构]
   * @param  {Date}              startTime [统计开始时间]
   * @param  {Date}              endTime   [统计结束时间]
   * @param  {any            =         {}}        others [其他过滤条件]
   * @return {Observable<any[]>}           [返回的统计结果]
   */
  aggrQty(group: string, hs: any, startTime: Date, endTime: Date, others: any = {}) : Observable<any[]> {
    let query = _.merge(others, {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    });
    const url = `${this.baseUrl}/aggr/${group}/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate msublot matching "${query}"`)),
        catchError(this.handleError<any[]>('aggr', []))
      );
  }

  /**
   * 判断物料子批次是否存在，根据 field 和 value
   */
  exist<Data>(query: any): Observable<any> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}&field=null&limit=1`;
    return this.http.get<IMsubLot[]>(url)
      .pipe(
        map(MsubLots => MsubLots[0]), // returns a {0|1} element array
        tap(MsubLot => {
          const outcome = MsubLot ? `fetched` : `did not find`;
          this.log(`${outcome} MsubLot _id=${qstr}`);
        }),
        catchError(this.handleError<IMsubLot>(`getMsubLot ${qstr}`))
      );
  }

  /**
   * [判断物料子批次是否存在，根据 field 和 value]
   * @param  {string}           field [description]
   * @param  {any}              value [description]
   * @return {Observable<void>}       [description]
   */
  existField(field: string, value: any): Observable<boolean> {
    let body = {};
    body[field] = value;
    return this.exist(body);
  }

  /**
   * 获取所有的物料子批次关键信息，查询条件有 Client 提供
   * @param  {{}}                          query   [description]
   * @return {Observable<IMsubLotElite[]>} [物料子批次关键信息 Array]
   */
  getMsubLotsEliteBy(query: {}): Observable<IMsubLotElite[]> {
    return this.searchMsublots(query, this.eliteFields);
  }

  /**
   * [getMsubLotsProfileBy 获取所有的物料子批次 profile 信息，查询条件有 Client 提供]
   * @param  {{}}                          query   [description]
   * @return {Observable<IMsubLotProfile[]>}       [物料子批次主要信息 Array]
   */
  getMsubLotsProfileBy(query: {}): Observable<IMsubLotProfile[]> {
    return this.searchMsublotsEncode(query, this.profileFields);
  }

  /**
   * [获取生产相关的物料子批次]
   * @return {Observable<IMsubLotElite[]>} [description]
   */
  getMsubLotsProfileProd(): Observable<IMsubLotElite[]> {
    let query = {opState: { $in: _.values(MaterialData.BodyOps).map(item => item.state)}};
    return this.getMsubLotsProfileBy(query);
  }

  /**
   * [getNewMsubLot 从数据库获取一个全新的 MsubLot,自带 _id]
   * @return {Observable<IMsubLot>} [description]
   */
  getNewMsubLot(): Observable<IMsubLot> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IMsubLot>(url)
      .pipe(
        tap(_ => this.log('fetched new MsubLot')),
        catchError(this.handleError<IMsubLot>('getNewMsubLot'))
      );
  }

  /**
   * 根据 _id 获取单个物料子批次信息
   * @param  {string}               id [物料子批次的 _id]
   * @return {Observable<IMsubLot>}    [单个物料子批次信息]
   */
  getMsubLot(id: string): Observable<IMsubLot> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IMsubLot>(url)
      .pipe(
        tap(_ => this.log('fetched MsubLot id=${id}')),
        catchError(this.handleError<IMsubLot>('getMsubLot'))
      );
  }
    /**
   * 根据 _id 获取单个物料子批次及其assSubLot的更多信息
   * @param  {string}               id [物料子批次的 _id]
   * @return {Observable<IMsubLot>}    [单个物料子批次信息]
   */
  getMsubLotAssDetail(id: string): Observable<IMsubLot> {
    const url = `${this.baseUrl}/assdetail/${id}`;
    return this.http.get<IMsubLot>(url)
      .pipe(
        tap(_ => this.log('fetched MsubLot id=${id}')),
        catchError(this.handleError<IMsubLot>('getMsubLotAssDetail'))
      );
  }

    /**
   * 根据 oid 获取单个物料子批次及其assSubLot的更多信息
   * @param  {string}               id [物料子批次的 _id]
   * @return {Observable<IMsubLot>}    [单个物料子批次信息]
   */
  getMsubLotAssDetailByOid(oid: string): Observable<IMsubLot> {
    const url = `${this.baseUrl}/assdetail/oid/${oid}`;
    return this.http.get<IMsubLot>(url)
      .pipe(
        tap(_ => this.log('fetched MsubLot id=${id}')),
        catchError(this.handleError<IMsubLot>('getMsubLotAssDetailByOid'))
      );
  }

  /**
   * [通过oid查询msublot]
   * @param  {string}               oid [description]
   * @return {Observable<IMsubLot>}     [description]
   */
  getMsubLotByOid(oid: string): Observable<IMsubLot> {
    const url = `${this.baseUrl}/oid/${oid}`;
    return this.http.get<IMsubLot>(url)
      .pipe(
        tap(_ => this.log('fetched MsubLot by oid oid=${oid}')),
        catchError(this.handleError<IMsubLot>('getMsubLotByOid'))
      );
  }

  /**
   * [getMsubLotsBy 获取所有的物料子批次信息, 查询条件由 client 提供]
   * @param  {any                 = {}}        query [description]
   * @return {Observable<IMsubLot[]>}   [description]
   */
  getMsubLotsBy(query: any = {}): Observable<IMsubLot[]> {
    return this.searchMsublots(query);
  }

  getMsubLotBy(query: any = {}): Observable<IMsubLot> {
    return this.getMsublotNo404(query);
  }

  getOrderBy(query: any = {}): Observable<any> {
    const url = `${this.baseUrl}/orderby`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError<any>('getOrderBy'))
      );
  }

  next(prex: string): Observable<string> {
    prex = prex ? prex : '0000';
    const url = `${this.baseUrl}/next/${prex}`;
    return this.http.get<string>(url, httpOptions)
      .pipe(
        catchError(this.handleError<any>('getOrderBy'))
      );
  }

  /**
   * [根据查询条件获取可交坯坯体]
   * @param  {any}             query [description]
   * @return {Observable<any>}       [description]
   */
  getTrimableBodies(query: any): Observable<any> {
    const url = `${this.baseUrl}/aggr/trim`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        tap(_ => this.log('fetched TrimableBodies')),
        catchError(this.handleError('getTrimableBodies', []))
      );
  }

  //获取各个层级结构的子批次数
  aggregateLocationSublot(query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/inventory/locSublot`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggregateLocationSublot', []))
      );
  }

  /**
   * [获取某个时间段的坯体当前操作状态的大致情况]
   * @param  {any}             molder [description]
   * @return {Observable<any>}        [description]
   */
  aggrOPTimely(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/opstate/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
    return this.http
      .post(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggrOPTimely', []))
      );
  }


  /**
   * [获取某个时间段的坯体质检的大致情况]
   * @param  {any}             molder [description]
   * @return {Observable<any>}        [description]
   */
  aggrQCTimely(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/qcstate/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
    return this.http
      .post(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggrQCTimely', []))
      );
  }

  /**
   * [获取某个时间段的坯体质检的大致情况]
   * @param  {any}             molder [description]
   * @return {Observable<any>}        [description]
   */
  aggrQC(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/qcstateTime/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
    return this.http
      .post(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggrQCTimely', []))
      );
  }

  // /**
  //  * [获取某个时间段的坯体质检的大致情况]
  //  * @param  {any}             molder [description]
  //  * @return {Observable<any>}        [description]
  //  */
  // aggrQC(query:any): Observable<any> {
  //   const url = `${this.baseUrl}/aggregateQC`;
  //   return this.http
  //     .post(url, query, httpOptions)
  //     .pipe(
  //       catchError(this.handleError('aggrQC', []))
  //     );
  // }

  /**
   * [获取某个时间段的坯体干燥的大致情况]
   * @param  {any}             molder [description]
   * @return {Observable<any>}        [description]
   */
  aggrDriedTimely(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/dried/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
    return this.http
      .post(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggrDriedTimely', []))
      );
  }

  /**
   * [获取某个时间段的坯体的盘点统计信息]
   * @return {Observable<any>} [description]
   */
  aggrInventoryTimely(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/inventory/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
    return this.http
      .post(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggrInventoryTimely', []))
      );
  }

  /**
   * [获取某个时间段的坯体的窑烧统计信息]
   * @return {Observable<any>} [description]
   */
  aggrKilnTimely(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/kiln/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
    return this.http
      .post(url, query, httpOptions)
      .pipe(
        catchError(this.handleError('aggrKilnTimely', []))
      );
  }

  /**
   * [操作所有类型的条码]
   * @param  {string}          state [description]
   * @param  {ITerminal}       body  [description]
   * @return {Observable<any>}       [description]
   */
  opall(state: string, body: ITerminal): Observable<any> {
    const url = `${this.baseUrl}/opall/${state}`;
    return this.http
      .put(url, body, httpOptions)
      .pipe(
        catchError(this.handleError('opall', []))
      );
  }

  /**
   * [针对一些物料子批次做操作]
   * @param  {any}             body [description]
   * @return {Observable<any>}      [description]
   */
  ops(body: ITerminal): Observable<any> {
    const url = `${this.baseUrl}/ops`;
    return this.http
      .put(url, body, httpOptions)
      .pipe(
        catchError(this.handleError('ops', []))
      );
  }

  /**
   * [针对一个物料子批次做操作]
   * @param  {string}          oid  [description]
   * @param  {any}             body [description]
   * @return {Observable<any>}      [description]
   */
  op(body: ITerminal): Observable<any> {
    const url = `${this.baseUrl}/op`;
    return this.http
      .put(url, body, httpOptions)
      .pipe(
        catchError(this.handleError('op', []))
      );
  }

  /**
   * 在数据库中，创建新的物料子批次
   * @param  {IMsubLot}             sl [待创建的物料子批次信息]
   * @param  {number            =  1}           count [description]
   * @return {Observable<IMsubLot>}    [新创建的物料子批次信息]
   */
  createMsubLot(sl: IMsubLot, count: number = 1): Observable<IMsubLot> {
    const url = `${this.baseUrl}/${count}`;
    return this.http
      .post<IMsubLot>(url, sl, httpOptions)
      .pipe(
        tap((NewMsubLot: IMsubLot) => this.log(`added MsubLot w/ id=${NewMsubLot._id}`)),
        catchError(this.handleError<IMsubLot>('createMsubLot'))
      );
  }

  /**
   * 在数据库中，创建新的物料子批次
   * @param  {IMsubLot}             sl [待创建的物料子批次信息]
   * @param  {number            =  1}           count [description]
   * @return {Observable<IMsubLot>}    [新创建的物料子批次信息]
   */
  createMsubLotMJ(sl: IMsubLot ): Observable<IMsubLot> {
    const url = `${this.baseUrl}/mj`;
    return this.http
      .post<IMsubLot>(url, sl, httpOptions)
      .pipe(
        catchError(this.handleError<IMsubLot>('createMsubLotMJ'))
      );
  }

  /**
   * 在数据库中，更新某个物料子批次信息
   * @param  {IMsubLot}             sl [待更新的物料子批次信息]
   * @return {Observable<IMsubLot>}    [更新后的物料子批次信息]
   */
  updateMsubLot(sl: IMsubLot): Observable<IMsubLot> {
    const url = `${this.baseUrl}/${sl._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IMsubLot>(url, sl, httpOptions)
      .pipe(
        tap(_ => this.log(`updated MsubLot id=${sl._id}`)),
        catchError(this.handleError<any>('updateMsubLot'))
      );
  }

  /**
   * [更新物料子批次的窑炉数据]
   * @param  {string}               id   [description]
   * @param  {any}                  kiln [description]
   * @return {Observable<IMsubLot>}      [description]
   */
  updateKiln(id: string, kiln: IEquipmentElite): Observable<IMsubLot> {
    const url = `${this.baseUrl}/kiln/${id}`;
    return this.http
      .put<IMsubLot>(url, kiln, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Kiln id=${id}`)),
        catchError(this.handleError<IMsubLot>('updateKiln'))
      );
  }

  /**
   * [更新物料子批次的物料定义]
   * @param  {string}               id   [description]
   * @param  {any}                  kiln [description]
   * @return {Observable<IMsubLot>}      [description]
   */
  updateMdef(id: string, mdef: IMdefElite): Observable<IMsubLot> {
    const url = `${this.baseUrl}/mdef/${id}`;
    return this.http
      .put<IMsubLot>(url, mdef, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Mdef id=${id}`)),
        catchError(this.handleError<IMsubLot>('updateMdef'))
      );
  }

  patchMsubLot(id: string, patch: any): Observable<IMsubLot> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IMsubLot>(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch MsubLot id=${id}`)),
        catchError(this.handleError<any>('patchMsubLot'))
      );
  }

  updateBy(query: any): Observable<IMsubLot[]> {
    const url = `${this.baseUrl}/updateby`;
    return this.http
      .post<IMsubLot[]>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError<IMsubLot[]>('updateBy'))
      );
  }

  /**
   * 在数据库中，删除某个物料子批次信息
   * @param  {IMsubLot}         sl [待删除的物料子批次信息]
   * @return {Observable<void>}    [description]
   */
  deleteMsubLot(sl: IMsubLot): Observable<IMsubLot> {
    const id = typeof sl === 'string' ? sl : sl._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IMsubLot>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete MsubLot id=${id}`)),
        catchError(this.handleError<IMsubLot>('deleteMsubLot'))
      );
  }

  /**
   * [用一个物料子批次创建树形结构，便于呈现]
   * @param  {IMsubLot}       msl [description]
   * @return {TreeviewItem[]}     [description]
   */
  newMsublotTree(msl: IMsubLot): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if(msl) {
      rntree.push(new TreeviewItem({
        text: msl.mclass[0].oid,
        value: msl.mclass,
        children: [{
          text: msl.mdef.oid,
          value: msl.mdef,
          children: [{
            text: msl.mlot.oid,
            value: msl.mlot,
            children: [{
              text: msl.oid,
              value: msl,
              checked: true
            }]
          }]
        }]
      }));
    }
    return rntree;
  }

  /**
   * 创建新的树状
   * @param  {IMlotElite[]}       mlots    [description]
   * @param  {IMsubLotElite[]}    msublots [description]
   * @param  {IMsubLotElite[] =        []}          sels [description]
   * @return {TreeviewItem[]}              [description]
   */
  newTreeArray(mlots: IMlotElite[],
    msublots: IMsubLotElite[],
    sels: IMsubLotElite[] = []): TreeviewItem[] {
    if (mlots && msublots) {
      //mlot 层
      let arrmlot = mlots.map(item => {
        return {
          text: item.oid,
          value: item,
          checked: false,
          children: []
        };
      });
      //msublot 层
      for (let mlot of arrmlot) {
        msublots.forEach(item => {
          // if(item.mlot._id === mlot.value._id) {
          //   let exist = sels ? sels.findIndex(sel => sel._id === item._id) >= 0 : false;
          //   mlot.children.push({
          //     text: item.oid,
          //     value: item,
          //     checked: exist,
          //     children: []
          //   });
          // }
        });
      }
      return arrmlot.map(item => {
        return new TreeviewItem(item);
      });
    } else {
      return [];
    }
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
