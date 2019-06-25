import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IWorkPerformance, WorkPerformance,
         IWorkPerformanceElite, IWorkPerformanceProfile } from '../model/work-perf';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkPerformanceService implements IExistService {
  private baseUrl = '/api/workPerformances';

  private eliteFields = '_id oid';
  private profileFields = '-workRes';

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
    this.messageService.add(`WorkPerformanceService: ${message}`);
  }


  /**
   * 获取所有的操作请求
   * @return {Observable<IWorkPerformance[]>} [操作请求Array]
   */
  getWorkPerformances(field: string = '', sort: string = '-_id'): Observable<IWorkPerformance[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkPerformance[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched WWorkPerformances')),
        catchError(this.handleError('getWorkRequests', []))
      );
  }

  /** GET WorkPerformance by q. Return `undefined` when id not found */
  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWorkPerformanceNo404<Data>(query: any): Observable<IWorkPerformance> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkPerformance[]>(url)
      .pipe(
        map(wps => wps[0]), // returns a {0|1} element array
        tap(wp => {
          const outcome = wp ? `fetched` : `did not find`;
          this.log(`${outcome} WorkPerformance _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkPerformance>(`getWorkPerformance ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WorkPerformances，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkPerformance[]>}       [查询结果，WorkPerformance数组]
   */
  searchWorkPerformances(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkPerformance[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkPerformance[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkPerformances matching "${qstr}"`)),
        catchError(this.handleError<IWorkPerformance[]>('searchWorkPerformances', []))
      );
  }

  /**
   * [通过过滤条件查询WorkPerformances，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkPerformance[]>}       [查询结果，WorkPerformance数组]
   */
  searchWorkPerformancesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkPerformance[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkPerformance[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkPerformances matching "${query}"`)),
        catchError(this.handleError<IWorkPerformance[]>('searchWorkPerformances', []))
      );
  }

  /**
   * [getOpRequestsBy 通过简单的查询条件，获取相应的操作请求信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IWorkPerformance[]>}   [description]
   */
  getWorkPerformancesBy(query: any = {}): Observable<IWorkPerformance[]> {
    return this.searchWorkPerformances(query);
  }

  /**
   * [getWorkPerformancesElite 获取所有的 WorkPerformance 关键信息]
   * @return {Observable<IWorkPerformanceElite[]>} [description]
   */
  getWorkPerformancesElite(): Observable<IWorkPerformanceElite[]> {
    return this.getWorkPerformances(this.eliteFields);
  }

  /**
   * [getWorkPerformancesProfile 获取所有的 WorkPerformance Profile 信息]
   * @return {Observable<IWorkPerformanceProfile[]>} [description]
   */
  getWorkPerformancesProfile(): Observable<IWorkPerformanceProfile[]> {
    return this.getWorkPerformances(this.profileFields);
  }

  /**
   * [getNewWorkPerformance 从数据库获取一个全新的 WorkPerformance,自带 _id]
   * @return {Observable<IWorkPerformance>} [description]
   */
  getNewWorkPerformance(): Observable<IWorkPerformance> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkPerformance>(url)
      .pipe(
        tap(_ => this.log('fetch new WorkPerformance ')),
        catchError(this.handleError<IWorkPerformance>('getNewWorkPerformance'))
      );
  }

  /**
   * 根据 _id 获取单个操作请求
   * @param  {string}                 id [操作请求的_id]
   * @return {Observable<IOpRequest>}    [单个操作请求]
   */
  getWorkPerformance(id: string): Observable<IWorkPerformance> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkPerformance>(url)
      .pipe(
        tap(_ => this.log('fetch WorkPerformance id=${id}')),
        catchError(this.handleError<IWorkPerformance>('getWorkPerformance'))
      );
  }

  /**
   * [getWorkPerformanceBy 通过简单的查询条件，从数据库中获取单个 WorkPerformance 信息]
   * @param  {any                       = {}}        query [description]
   * @return {Observable<IWorkPerformance>}   [description]
   */
  getWorkPerformanceBy(query: any = {}): Observable<IWorkPerformance> {
    return this.getWorkPerformanceNo404(query);
  }

  /**
   * [getWorkPerformancesEliteBy 过简单的查询条件，获取所有的WorkPerformance 关键信息]
   * @param  {any                              = {}}        query [description]
   * @return {Observable<IWorkPerformanceElite[]>}   [description]
   */
  getWorkPerformancesEliteBy(query: any = {}): Observable<IWorkPerformanceElite[]> {
    return this.searchWorkPerformances(query, this.eliteFields);
  }

  /**
   * [getWorkPerformancesProfileBy 通过简单的查询条件，获取所有的 WorkPerformance Profile 信息]
   * @param  {any                                = {}}        query [description]
   * @return {Observable<IWorkPerformanceProfile[]>}   [description]
   */
  getWorkPerformancesProfileBy(query: any = {}): Observable<IWorkPerformanceProfile[]> {
    return this.searchWorkPerformances(query, this.profileFields);

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
    return this.http.get<IWorkPerformance[]>(url)
      .pipe(
        map(wps => wps[0]), // returns a {0|1} element array
        tap(wp => {
          const outcome = wp ? `fetched` : `did not find`;
          this.log(`${outcome} WorkPerformance _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkPerformance>(`getWorkPerformance ${qstr}`))
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
   * @param  {IWorkPerformance}             opr [待创建的OpRequest]
   * @return {Observable<IWorkPerformance>}     [新创建的OpRequest]
   */
  createWorkPerformance(wp: IWorkPerformance): Observable<IWorkPerformance> {
    return this.http
      .post<IWorkPerformance>(this.baseUrl, wp, httpOptions)
      .pipe(
        tap((newWp: IWorkPerformance) => this.log(`added WorkPerformance w/ id=${newWp._id}`)),
        catchError(this.handleError<IWorkPerformance>('createWorkPerformance'))
      );
  }

  /**
   * 在数据库中，更新某个OpRequest
   * @param  {IWorkPerformance}             opr [待更新的OpRequest]
   * @return {Observable<IWorkPerformance>}     [更新后的OpRequest]
   */
  updateWorkPerformance(wp: IWorkPerformance): Observable<IWorkPerformance> {
    const url = `${this.baseUrl}/${wp._id}`;
    return this.http
      .put(url, wp, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WorkPerformance id=${wp._id}`)),
        catchError(this.handleError<any>('updateWorkPerformance'))
      );
  }

  patcheWorkPerformance(id: string, patch: any): Observable<IWorkPerformance> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkPerformance id=${id}`)),
        catchError(this.handleError<any>('patcheWorkPerformance'))
      );
  }

  patchWorkPerformances(id: string, patch: any): Observable<IWorkPerformance[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('patch WorkPerformance')),
        catchError(this.handleError<any>('patchWorkPerformances'))
      );
  }

  /**
   * [updateOpRequestState description]
   * @param  {string[]}               ids      [description]
   * @param  {string}                 newstate [description]
   * @return {Observable<IWorkPerformance>}          [description]
   */
  updateWorkPerformanceState(ids: string[], newstate: string): Observable<IWorkPerformance> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log(`update WorkPerformance newstate=${newstate}`)),
        catchError(this.handleError<any>('updateWorkPerformanceState'))
      );
  }

  patchWorkPerformanceState(ids: string[], newstate: string, patch: any): Observable<IWorkPerformance> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkPerformance newstate=${newstate}`)),
        catchError(this.handleError<any>('patchWorkPerformanceState'))
      );
  }

  /**
   * 在数据库中，删除某个OpRequest
   * @param  {IWorkPerformance}       opr [待删除的OpRequest操作请求]
   * @return {Observable<void>}     [description]
   */
  deleteWorkPerformance(wp: IWorkPerformance): Observable<IWorkPerformance> {
    const id = typeof wp === 'string' ? wp : wp._id;
    const url = `${this.baseUrl}/${wp._id}`;
    return this.http.delete<IWorkPerformance>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WorkPerformance id=${id}`)),
        catchError(this.handleError<IWorkPerformance>('deleteWorkPerformance'))
      );
  }

}
