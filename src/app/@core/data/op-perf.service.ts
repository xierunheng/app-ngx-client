import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IOpPerformance, OpPerformance,
       IOpPerformanceElite, IOpPerformanceProfile } from '../model/op-perf';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OpPerformanceService implements IExistService {
  private baseUrl = '/api/opPerformances';
  private eliteFields = '_id oid';
  private profileFields = '-opRes';

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
    this.messageService.add(`OpPerformanceService: ${message}`);
  }

  /**
   * 获取所有的操作请求
   * @return {Observable<IOpPerformance[]>} [操作请求Array]
   */
  getOpPerformances(field: string = '', sort: string = '-_id'): Observable<IOpPerformance[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOpPerformance[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched OpPerformances')),
        catchError(this.handleError('getOpPerformances', []))
      );
  }

  /**
   * [通过过滤条件查询OpPerformances，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpPerformance[]>}       [查询结果，OpPerformance数组]
   */
  searchOpPerformances(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpPerformance[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpPerformance[]>(url)
      .pipe(
        tap(_ => this.log(`found OpPerformances matching "${qstr}"`)),
        catchError(this.handleError<IOpPerformance[]>('searchOpPerformances', []))
      );
  }

  /**
   * [通过过滤条件查询OpPerformances，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpPerformance[]>}       [查询结果，OpPerformance数组]
   */
  searchOpPerformancesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpPerformance[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpPerformance[]>(url)
      .pipe(
        tap(_ => this.log(`found OpPerformances matching "${query}"`)),
        catchError(this.handleError<IOpPerformance[]>('searchOpPerformances', []))
      );
  }

  /** GET OpPerformance by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取操作执行信息
   * 当查询不到时，返回 undefined
   */
  getOpPerformanceNo404<Data>(query: any): Observable<IOpPerformance> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOpPerformance[]>(url)
      .pipe(
        map(opps => opps[0]), // returns a {0|1} element array
        tap(opp => {
          const outcome = opp ? `fetched` : `did not find`;
          this.log(`${outcome} OpPerformance _id=${qstr}`);
        }),
        catchError(this.handleError<IOpPerformance>(`getOpPerformanceNo404 ${qstr}`))
      );
  }

  /**
   * [getOpPerformancesElite 获取所有的 OpPerformance 关键信息]
   * @return {Observable<IOpPerformanceElite[]>} [description]
   */
  getOpPerformancesElite(): Observable<IOpPerformanceElite[]> {
    return this.getOpPerformances(this.eliteFields);
  }

  /**
   * [getOpPerformancesProfile 获取所有的 OpPerformance Profile 信息]
   * @return {Observable<IOpPerformance[]>} [description]
   */
  getOpPerformancesProfile(): Observable<IOpPerformanceProfile[]> {
    return this.getOpPerformances(this.profileFields);
  }

  /**
   * [getOpRequestsBy 通过简单的查询条件，获取相应的操作请求信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IOpPerformance[]>}   [description]
   */
  getOpPerformancesBy(query: any = {}): Observable<IOpPerformance[]> {
    return this.searchOpPerformances(query);
  }

  /**
   * [getNewOpPerformance 从数据库获取一个全新的 OpPerformance,自带 _id]
   * @return {Observable<IOpPerformance>} [description]
   */
  getNewOpPerformance(): Observable<IOpPerformance> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOpPerformance>(url)
      .pipe(
        tap(_ => this.log('fetch new OpPerformance ')),
        catchError(this.handleError<IOpPerformance>('getNewOpPerformance'))
      );
  }

  /**
   * 根据 _id 获取单个操作请求
   * @param  {string}                 id [操作请求的_id]
   * @return {Observable<IOpRequest>}    [单个操作请求]
   */
  getOpPerformance(id: string): Observable<IOpPerformance> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOpPerformance>(url)
      .pipe(
        tap(_ => this.log('fetch OpPerformance id=${id}')),
        catchError(this.handleError<IOpPerformance>('getOpPerformance'))
      );
  }

  /**
   * [getOpPerformanceBy description]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IOpPerformance>}   [description]
   */
  getOpPerformanceBy(query: any = {}): Observable<IOpPerformance> {
    return this.getOpPerformanceNo404(query);
  }

  /**
   * [getOpPerformancesEliteBy 通过简单的查询条件，获取所有的 OpPerformance 关键信息]
   * @param  {any                            = {}}        query [description]
   * @return {Observable<IOpPerformanceElite[]>}   [description]
   */
  getOpPerformancesEliteBy(query: any = {}): Observable<IOpPerformanceElite[]> {
    return this.searchOpPerformances(query, this.eliteFields);
  }

  /**
   * [getOpPerformancesProfileBy 通过简单的查询条件，获取所有的 OpPerformance Profile 信息]
   * @param  {any                       = {}}        query [description]
   * @return {Observable<IOpPerformance[]>}   [description]
   */
  getOpPerformancesProfileBy(query: any = {}): Observable<IOpPerformance[]> {
    return this.searchOpPerformances(query, this.profileFields);
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
    return this.http.get<IOpPerformance[]>(url)
      .pipe(
        map(opps => opps[0]), // returns a {0|1} element array
        tap(opp => {
          const outcome = opp ? `fetched` : `did not find`;
          this.log(`${outcome} OpPerformance _id=${qstr}`);
        }),
        catchError(this.handleError<IOpPerformance>(`getOpPerformance ${qstr}`))
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
   * 在数据库中，创建新的OpRequest操作请求
   * @param  {IOpPerformance}             opr [待创建的OpRequest]
   * @return {Observable<IOpPerformance>}     [新创建的OpRequest]
   */
  createOpPerformance(opp: IOpPerformance): Observable<IOpPerformance> {
    return this.http
      .post<IOpPerformance>(this.baseUrl, opp, httpOptions)
      .pipe(
        tap((newOpPerf: IOpPerformance) => this.log(`added OpPerformance w/ id=${newOpPerf._id}`)),
        catchError(this.handleError<IOpPerformance>('createOpPerformance'))
      );
  }

  /**
   * 在数据库中，更新某个OpRequest
   * @param  {IOpPerformance}             opr [待更新的OpRequest]
   * @return {Observable<IOpPerformance>}     [更新后的OpRequest]
   */
  updateOpPerformance(opp: IOpPerformance): Observable<IOpPerformance> {
    const url = `${this.baseUrl}/${opp._id}`;
    return this.http
      .put(url, opp, httpOptions)
      .pipe(
        tap(_ => this.log(`updated ps id=${opp._id}`)),
        catchError(this.handleError<any>('updateOpPerformance'))
      );
  }

  patcheOpPerformance(id: string, patch: any): Observable<IOpPerformance> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch OpPerformance id=${id}`)),
        catchError(this.handleError<any>('patcheOpPerformance'))
      );
  }

  patchOpPerformances(id: string, patch: any): Observable<IOpPerformance[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('patch OpPerformances')),
        catchError(this.handleError<any>('patchOpPerformances'))
      );
  }

  /**
   * [updateOpRequestState description]
   * @param  {string[]}               ids      [description]
   * @param  {string}                 newstate [description]
   * @return {Observable<IOpPerformance>}          [description]
   */
  updateOpPerformanceState(ids: string[], newstate: string): Observable<IOpPerformance> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log(`update OpPerformance newstate=${newstate}`)),
        catchError(this.handleError<any>('updateOpPerformanceState'))
      );
  }

  patchOpPerformanceState(ids: string[], newstate: string, patch: any): Observable<IOpPerformance> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch OpPerformance newstate=${newstate}`)),
        catchError(this.handleError<any>('patchOpPerformanceState'))
      );
  }

  /**
   * 在数据库中，删除某个OpRequest
   * @param  {IOpPerformance}       opr [待删除的OpRequest操作请求]
   * @return {Observable<void>}     [description]
   */
  deleteOpPerformance(opp: IOpPerformance): Observable<IOpPerformance> {
    const id = typeof opp === 'string' ? opp : opp._id;
    const url = `${this.baseUrl}/${opp._id}`;
    return this.http.delete<IOpPerformance>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete OpPerformance id=${id}`)),
        catchError(this.handleError<IOpPerformance>('deleteOpPerformance'))
      );
  }

}
