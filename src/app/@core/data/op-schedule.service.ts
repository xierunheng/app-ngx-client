import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IOpSchedule, OpSchedule,
         IOpScheduleElite, IOpScheduleProfile } from '../model/op-schedule';
import { IExistService } from './common.service';
import { MessageService } from './message.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OpScheduleService implements IExistService {
  private baseUrl = '/api/opSchedules';
  private eliteFields = '_id oid';
  private profileFields = '-opReq';

  constructor(private http: HttpClient,
    private messageService: MessageService) {
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
    this.messageService.add(`OpScheduleService: ${message}`);
  }

  /**
   * 获取所有的操作请求
   * @return {Observable<IOpSchedule[]>} [操作请求Array]
   */
  getOpSchedules(field: string = '', sort: string = '-_id'): Observable<IOpSchedule[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOpSchedule[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched OpSchedules')),
        catchError(this.handleError('getOpSchedules', []))
      );
  }

  /** GET OpSchedule by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getOpScheduleNo404<Data>(query: any): Observable<IOpSchedule> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOpSchedule[]>(url)
      .pipe(
        map(opss => opss[0]), // returns a {0|1} element array
        tap(ops => {
          const outcome = ops ? `fetched` : `did not find`;
          this.log(`${outcome} OpSchedule _id=${qstr}`);
        }),
        catchError(this.handleError<IOpSchedule>(`getIpScheduleNo404 ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询OpSchedules，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IHierarchyScope[]>}       [查询结果，OpSchedule数组]
   */
  searchOpSchedules(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpSchedule[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpSchedule[]>(url)
      .pipe(
        tap(_ => this.log(`found OpSchedules matching "${qstr}"`)),
        catchError(this.handleError<IOpSchedule[]>('searchOpSchedules', []))
      );
  }

  /**
   * [通过过滤条件查询OpSchedules，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpSchedule[]>}       [查询结果，IOpSchedule数组]
   */
  searchOpSchedulesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpSchedule[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpSchedule[]>(url)
      .pipe(
        tap(_ => this.log(`found OpSchedules matching "${query}"`)),
        catchError(this.handleError<IOpSchedule[]>('searchOpSchedules', []))
      );
  }

  /**
   * [getOpRequestsBy 通过简单的查询条件，获取相应的操作请求信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IOpSchedule[]>}   [description]
   */
  getOpSchedulesBy(query: any = {}): Observable<IOpSchedule[]> {
    return this.searchOpSchedules(query);
  }

/**
 * [getOpOpSchedulesElite 获取所有的 OpSchedule 关键信息]
 * @return {Observable<IOpScheduleElite[]>} [description]
 */
  getOpSchedulesElite(): Observable<IOpScheduleElite[]> {
    return this.getOpSchedules(this.eliteFields);
  }

  /**
   * [getOpOpSchedulesProfile 获取所有的 OpSchedule Profile 信息]
   * @return {Observable<IOpScheduleProfile[]>} [description]
   */
  getOpSchedulesProfile(): Observable<IOpScheduleProfile[]> {
    return this.getOpSchedules(this.profileFields);
  }

  /**
   * [getNewOpSchedule 从数据库获取一个全新的 OpSchedule,自带 _id]
   * @return {Observable<IOpSchedule>} [description]
   */
  getNewOpSchedule(): Observable<IOpSchedule> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOpSchedule>(url)
      .pipe(
        tap(_ => this.log('fetch new ps ')),
        catchError(this.handleError<IOpSchedule>('getNewOpSchedule'))
      );
  }

  /**
   * 根据 _id 获取单个操作请求
   * @param  {string}                 id [操作请求的_id]
   * @return {Observable<IOpRequest>}    [单个操作请求]
   */
  getOpSchedule(id: string): Observable<IOpSchedule> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOpSchedule>(url)
      .pipe(
        tap(_ => this.log('fetch ops id=${id}')),
        catchError(this.handleError<IOpSchedule>('getOpSchedule'))
      );
  }

  /**
   * [getOpScheduleBy 通过简单的查询条件，从数据库中获取单个 OpSchedule 信息]
   * @param  {any                  = {}}        query [description]
   * @return {Observable<IOpSchedule>}   [description]
   */
  getOpScheduleBy(query: any = {}): Observable<IOpSchedule> {
    return this.getOpScheduleNo404(query);
  }


  /**
   * [getOpSchedulesEliteBy 通过简单的查询条件，获取所有的 OpSchedule 关键信息]
   * @param  {any                         = {}}        query [description]
   * @return {Observable<IOpScheduleElite[]>}   [description]
   */
  getOpSchedulesEliteBy(query: any = {}): Observable<IOpScheduleElite[]> {
    return this.searchOpSchedules(query, this.eliteFields);
  }

  /**
   * [getOpSchedulesProfileBy 通过简单的查询条件，获取所有的 OpSchedule Profile 信息]
   * @param  {any                           = {}}        query [description]
   * @return {Observable<IOpScheduleProfile[]>}   [description]
   */
  getOpSchedulesProfileBy(query: any = {}): Observable<IOpScheduleProfile[]> {
    return this.searchOpSchedules(query, this.profileFields);
  }

  /**
   * [判断操作计划是否存在，根据 field 和 value]
 * @param  {string}           field [description]
 * @param  {any}              value [description]
 * @return {Observable<void>}       [description]
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
    return this.http.get<IOpSchedule[]>(url)
      .pipe(
        map(opss => opss[0]), // returns a {0|1} element array
        tap(ops => {
          const outcome = ops ? `fetched` : `did not find`;
          this.log(`${outcome} OpSchedule _id=${qstr}`);
        }),
        catchError(this.handleError<IOpSchedule>(`getOpSchedule ${qstr}`))
      );
  }

  /**
   * [判断操作请求名称（ID）是否存在，根据 field 和 value]
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
   * [根据前缀获取下一个 操作请求号，也算是下一个订单号]
   * @param  {string}             prex [description]
   * @return {Observable<string>}      [description]
   */
  next(prex: string): Observable<string> {
    //BC for 布产
    prex = prex ? prex : 'BC';
    const url = `${this.baseUrl}/next/${prex}`;
    return this.http.get<string>(url)
      .pipe(
        tap(_ => this.log('fetch next')),
        catchError(this.handleError<string>('next'))
      );
  }

  /**
   * [多个同时布产]
   * @param  {string[]}        ids [description]
   * @return {Observable<any>}     [description]
   */
  releaseMany(ids: string[]): Observable<any> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/releasemany/${strIds}`;
    return this.http
      .put(url, {}, httpOptions)
      .pipe(
        tap(_ => this.log(`releaseMany id=${strIds}`)),
        catchError(this.handleError<any>('releaseMany'))
      );
  }

  /**
   * 撤销布产
   * @param  {string}          id [description]
   * @return {Observable<any>}    [description]
   */
  unrelease(id: string): Observable<any> {
    const url = `${this.baseUrl}/unrelease/${id}`;
    return this.http
      .put(url, {}, httpOptions)
      .pipe(
        tap(_ => this.log(`unrelease id=${id}`)),
        catchError(this.handleError<any>('unrelease'))
      );
  }

  /**
   * 布产操作，把所选 OpRequest 列表进行布产
   *
   * @param  {IOpSchedule[]}     oprs [OpRequest 列表]
   * @return {Observable<any>}      [description]
   */
  release(id: string): Observable<any> {
    const url = `${this.baseUrl}/release/${id}`;
    return this.http
      .put(url, {}, httpOptions)
      .pipe(
        tap(_ => this.log(`release id=${id}`)),
        catchError(this.handleError<any>('release'))
      );
  }

  /**
   * 布产操作，把所选 OpRequest 列表进行布产
   *
   * @param  {IOpSchedule[]}     oprs [OpRequest 列表]
   * @return {Observable<any>}      [description]
   */
  insertRelease(id: string): Observable<any> {
    const url = `${this.baseUrl}/insertrelease/${id}`;
    return this.http
      .put(url, {}, httpOptions)
      .pipe(
        tap(_ => this.log(`insertRelease id=${id}`)),
        catchError(this.handleError<any>('insertRelease'))
      );
  }

  /**
   * 在数据库中，创建新的OpRequest操作请求
   * @param  {IOpSchedule}             opr [待创建的OpRequest]
   * @return {Observable<IOpSchedule>}     [新创建的OpRequest]
   */
  createOpSchedule(opr: IOpSchedule): Observable<IOpSchedule> {
    return this.http
      .post<IOpSchedule>(this.baseUrl, opr, httpOptions)
      .pipe(
        tap((newOpSchedule: IOpSchedule) => this.log(`added opr w/ id=${newOpSchedule._id}`)),
        catchError(this.handleError<IOpSchedule>('createOpSchedule'))
      );
  }

  /**
   * 在数据库中，更新某个OpRequest
   * @param  {IOpSchedule}             opr [待更新的OpRequest]
   * @return {Observable<IOpSchedule>}     [更新后的OpRequest]
   */
  updateOpSchedule(ops: IOpSchedule): Observable<IOpSchedule> {
    const url = `${this.baseUrl}/${ops._id}`;
    return this.http
      .put(url, ops, httpOptions)
      .pipe(
        tap(_ => this.log(`updated opr id=${ops._id}`)),
        catchError(this.handleError<any>('updateOpSchedule'))
      );
  }

  patcheOpSchedule(id: string, patch: any): Observable<IOpSchedule> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch ops id=${id}`)),
        catchError(this.handleError<any>('patcheOpSchedule'))
      );
  }

  patchOpSchedules(id: string, patch: any): Observable<IOpSchedule[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('patch opss')),
        catchError(this.handleError<any>('patchOpSchedules'))
      );
  }

  /**
   * [updateOpRequestState description]
   * @param  {string[]}               ids      [description]
   * @param  {string}                 newstate [description]
   * @return {Observable<IOpSchedule>}          [description]
   */
  updateOpScheduleState(ids: string[], newstate: string): Observable<IOpSchedule> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log(`updateOpSchedule newstate=${newstate}`)),
        catchError(this.handleError<any>('updateOpScheduleState'))
      );
  }

  patchOpScheduleState(ids: string[], newstate: string, patch: any): Observable<IOpSchedule> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patchOpSchedule newstate=${newstate}`)),
        catchError(this.handleError<any>('patchOpScheduleState'))
      );
  }

  /**
   * 在数据库中，删除某个OpRequest
   * @param  {IOpSchedule}       ops [待删除的OpRequest操作请求]
   * @return {Observable<void>}     [description]
   */
  deleteOpSchedule(ops: IOpSchedule): Observable<IOpSchedule> {
    const id = typeof ops === 'string' ? ops : ops._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IOpSchedule>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete OpSchedule id=${id}`)),
        catchError(this.handleError<IOpSchedule>('deleteOpSchedule'))
      );
  }

  createSchedTree(ops: IOpSchedule[], collapsed: boolean = true, withOpreq: boolean = true): TreeviewItem[] {
    let schedtree: TreeviewItem[] = ops && ops.length > 0 ? ops.map(sched => {
      return new TreeviewItem({
        text: sched.oid,
        value: sched,
        checked: false,
        collapsed: collapsed,
        children: withOpreq ? _.sortBy(sched.opReq, 'oid').map(req => {
          return {
            text: `${req.oid}`,
            value: req,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.sched.name,
      value: UtilData.systemObj.sched.name,
      checked: false,
      collapsed: false,
      children: schedtree
    });
    return [root];
  //  return schedtree;
  }

}
