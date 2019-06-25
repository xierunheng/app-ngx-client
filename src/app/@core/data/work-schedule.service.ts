import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IWorkSchedule, WorkSchedule,
         IWorkScheduleElite, IWorkScheduleProfile } from '../model/work-schedule';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkScheduleService implements IExistService {
  private baseUrl = '/api/workSchedules';

  private eliteFields = '_id oid';
  private profileFields = '-workReq';

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
    this.messageService.add(`WorkScheduleService: ${message}`);
  }

  /**
   * 获取所有的操作请求
   * @return {Observable<IWorkSchedule[]>} [操作请求Array]
   */
  getWorkSchedules(field: string = '', sort: string = '-_id'): Observable<IWorkSchedule[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkSchedule[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched WorkSchedule')),
        catchError(this.handleError('getWorkSchedules', []))
      );
  }

  /** GET WorkSchedule by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWorkScheduleNo404<Data>(query: any): Observable<IWorkSchedule> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkSchedule[]>(url)
      .pipe(
        map(wss => wss[0]), // returns a {0|1} element array
        tap(ws => {
          const outcome = ws ? `fetched` : `did not find`;
          this.log(`${outcome} WorkSchedule _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkSchedule>(`getWorkSchedule ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WorkSchedules，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkSchedule[]>}       [查询结果，WorkSchedule数组]
   */
  searchWorkSchedules(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkSchedule[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkSchedule[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkSchedules matching "${qstr}"`)),
        catchError(this.handleError<IWorkSchedule[]>('searchWorkSchedules', []))
      );
  }

  /**
   * [通过过滤条件查询WorkSchedules，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkSchedule[]>}       [查询结果，WorkSchedule数组]
   */
  searchWorkSchedulesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkSchedule[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkSchedule[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkSchedules matching "${query}"`)),
        catchError(this.handleError<IWorkSchedule[]>('searchWorkSchedules', []))
      );
  }

  /**
   * [getOpRequestsBy 通过简单的查询条件，获取相应的操作请求信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IWorkSchedule[]>}   [description]
   */
  getWorkSchedulesBy(query: any = {}): Observable<IWorkSchedule[]> {
    return this.searchWorkSchedules(query);
  }

  /**
   * [getWorkOpSchedulesElite 获取所有的 WorkSchedule 关键信息]
   * @return {Observable<IWorkScheduleElite[]>} [description]
   */
  getWorkOpSchedulesElite(): Observable<IWorkScheduleElite[]> {
    return this.getWorkSchedules(this.eliteFields);
  }

  /**
   * [getWorkOpSchedulesProfile 获取所有的 WorkSchedule Profile 信息]
   * @return {Observable<IWorkScheduleProfile[]>} [description]
   */
  getWorkOpSchedulesProfile(): Observable<IWorkScheduleProfile[]> {
    return this.getWorkSchedules(this.profileFields);
  }

  /**
   * [getNewWorkSchedule 从数据库获取一个全新的 WorkSchedule,自带 _id]
   * @return {Observable<IWorkSchedule>} [description]
   */
  getNewWorkSchedule(): Observable<IWorkSchedule> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkSchedule>(url)
      .pipe(
        tap(_ => this.log('fetch new WorkSchedule ')),
        catchError(this.handleError<IWorkSchedule>('getNewWorkSchedule'))
      );
  }

  /**
   * 根据 _id 获取单个操作请求
   * @param  {string}                 id [操作请求的_id]
   * @return {Observable<IOpRequest>}    [单个操作请求]
   */
  getWorkSchedule(id: string): Observable<IWorkSchedule> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkSchedule>(url)
      .pipe(
        tap(_ => this.log('fetch WorkSchedule id=${id}')),
        catchError(this.handleError<IWorkSchedule>('getWorkSchedule'))
      );
  }

  /**
   * [getWorkScheduleBy 通过简单的查询条件，从数据库中获取单个 WorkSchedule 信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IWorkSchedule>}   [description]
   */
  getWorkScheduleBy(query: any = {}): Observable<IWorkSchedule> {
    return this.getWorkScheduleNo404(query);
  }

  /**
   * [getWorkSchedulesEliteBy 通过简单的查询条件，获取所有的 WorkSchedule 关键信息]
   * @param  {any                           = {}}        query [description]
   * @return {Observable<IWorkScheduleElite[]>}   [description]
   */
  getWorkSchedulesEliteBy(query: any = {}): Observable<IWorkScheduleElite[]> {
    return this.searchWorkSchedules(query, this.eliteFields);
  }

  /**
   * [getWorkSchedulesProfileBy 通过简单的查询条件，获取所有的 WorkSchedule Profile 信息]
   * @param  {any                             = {}}        query [description]
   * @return {Observable<IWorkScheduleProfile[]>}   [description]
   */
  getWorkSchedulesProfileBy(query: any = {}): Observable<IWorkScheduleProfile[]> {
    return this.searchWorkSchedules(query, this.profileFields);
  }

  /**
   * [判断操作请求是否存在，根据 field 和 value]
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
    return this.http.get<IWorkSchedule[]>(url)
      .pipe(
        map(wss => wss[0]), // returns a {0|1} element array
        tap(ws => {
          const outcome = ws ? `fetched` : `did not find`;
          this.log(`${outcome} WorkSchedule _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkSchedule>(`getWorkSchedule ${qstr}`))
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
    prex = prex ? prex : 'CZCG0-CG';
    console.log("prex",prex);
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
        tap(_ => this.log(`releaseMany WorkSchedule id=${strIds}`)),
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
        tap(_ => this.log(`unrelease WorkSchedule id=${id}`)),
        catchError(this.handleError<any>('unrelease'))
      );
  }

  /**
   * 布产操作，把所选 OpRequest 列表进行布产
   *
   * @param  {IWorkSchedule[]}     oprs [OpRequest 列表]
   * @return {Observable<any>}      [description]
   */
  release(id: string): Observable<any> {
    const url = `${this.baseUrl}/release/${id}`;
    return this.http
      .put(url, {}, httpOptions)
      .pipe(
        tap(_ => this.log(`release WorkSchedule id=${id}`)),
        catchError(this.handleError<any>('release'))
      );
  }

  /**
   * 在数据库中，创建新的OpRequest操作请求
   * @param  {IWorkSchedule}             opr [待创建的OpRequest]
   * @return {Observable<IWorkSchedule>}     [新创建的OpRequest]
   */
  createWorkSchedule(ws: IWorkSchedule): Observable<IWorkSchedule> {
    return this.http
      .post<IWorkSchedule>(this.baseUrl, ws, httpOptions)
      .pipe(
        tap((newWorkSchedule: IWorkSchedule) => this.log(`added WorkSchedule w/ id=${newWorkSchedule._id}`)),
        catchError(this.handleError<IWorkSchedule>('createWorkSchedule'))
      );
  }

  /**
   * 在数据库中，更新某个OpRequest
   * @param  {IWorkSchedule}             opr [待更新的OpRequest]
   * @return {Observable<IWorkSchedule>}     [更新后的OpRequest]
   */
  updateWorkSchedule(ws: IWorkSchedule): Observable<IWorkSchedule> {
    const url = `${this.baseUrl}/${ws._id}`;
    return this.http
      .put(url, ws, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WorkSchedule id=${ws._id}`)),
        catchError(this.handleError<any>('updateWorkSchedule'))
      );
  }

  patchWorkSchedule(id: string, patch: any): Observable<IWorkSchedule> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkSchedule id=${id}`)),
        catchError(this.handleError<any>('patchWorkSchedule'))
      );
  }

  patchWorkSchedules(id: string, patch: any): Observable<IWorkSchedule[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('patch WorkSchedules')),
        catchError(this.handleError<any>('patchWorkSchedules'))
      );
  }

  /**
   * [updateOpRequestState description]
   * @param  {string[]}               ids      [description]
   * @param  {string}                 newstate [description]
   * @return {Observable<IWorkSchedule>}          [description]
   */
  updateWorkScheduleState(ids: string[], newstate: string): Observable<IWorkSchedule> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log(`update WorkSchedule newstate=${newstate}`)),
        catchError(this.handleError<any>('updateWorkScheduleState'))
      );
  }

  patchWorkScheduleState(ids: string[], newstate: string, patch: any): Observable<IWorkSchedule> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkSchedule newstate=${newstate}`)),
        catchError(this.handleError<any>('patchWorkScheduleState'))
      );
  }

  /**
   * 在数据库中，删除某个OpRequest
   * @param  {IWorkSchedule}       opr [待删除的OpRequest操作请求]
   * @return {Observable<void>}     [description]
   */
  deleteWorkSchedule(ws: IWorkSchedule): Observable<IWorkSchedule> {
    const id = typeof ws === 'string' ? ws : ws._id;
    const url = `${this.baseUrl}/${ws._id}`;
    return this.http.delete<IWorkSchedule>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WorkSchedule id=${id}`)),
        catchError(this.handleError<IWorkSchedule>('deleteWorkSchedule'))
      );
  }

}
