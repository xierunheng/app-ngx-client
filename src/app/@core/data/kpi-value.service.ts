import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IKpiValue, IKpiValueElite, IKpiValueProfile } from '../model/kpi-value'
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class KpiValueService implements IExistService {
  private baseUrl = '/api/kpiValues';

  private eliteFields = '_id oid name';
  private profileFields = '-prop';

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
    this.messageService.add(`KpiValueService: ${message}`);
  }


  /**
   * 获取所有的KPIValue信息
   * @return {Observable<IKpiValue[]>} [KPIValue Array]
   */
  getKpiValues(field: string = '', sort: string = '-_id'): Observable<IKpiValue[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IKpiValue[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched kpivs')),
        catchError(this.handleError('getKpiValues', []))
      );
  }

  /** GET KpiValue by q. Return `undefined` when id not found */
  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getKpiValueNo404<Data>(query: any): Observable<IKpiValue> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IKpiValue[]>(url)
      .pipe(
        map(kvs => kvs[0]), // returns a {0|1} element array
        tap(kv => {
          const outcome = kv ? `fetched` : `did not find`;
          this.log(`${outcome} KpiValue _id=${qstr}`);
        }),
        catchError(this.handleError<IKpiValue>(`getKpiValue ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询KpiValues，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IKpiValue[]>}       [查询结果，KpiValue数组]
   */
  searchKpiValues(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IKpiValue[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IKpiValue[]>(url)
      .pipe(
        tap(_ => this.log(`found KpiValues matching "${qstr}"`)),
        catchError(this.handleError<IKpiValue[]>('searchKpiValues', []))
      );
  }

  /**
   * [通过过滤条件查询KpiValues，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IKpiValue[]>}       [查询结果，KpiValue数组]
   */
  searchKpiValuesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IKpiValue[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IKpiValue[]>(url)
      .pipe(
        tap(_ => this.log(`found KpiValues matching "${query}"`)),
        catchError(this.handleError<IKpiValue[]>('searchKpiValues', []))
      );
  }

  /**
   * 获取所有的KPI关键信息
   * @return {Observable<IKpiValueElite[]>} [KPI关键信息Array]
   */
  getKpiValuesElite(): Observable<IKpiValueElite[]> {
    return this.getKpiValues(this.eliteFields);
  }

  /**
   * 获取所有的KPI Profile信息
   * @return {Observable<IKpiValueProfile[]>} [KPI Profile信息Array]
   */
  getKpiValuesProfile(): Observable<IKpiValueProfile[]> {
    return this.getKpiValues(this.profileFields);
  }

  /**
   * 根据 _id 获取单个IKpiValue
   * @param  {string}            id [IKpiValue的_id]
   * @return {Observable<IKpiValue>}    [单个IKpiValue]
   */
  getKpiValue(id: string): Observable<IKpiValue> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IKpiValue>(url)
      .pipe(
        tap(_ => this.log('fetch kpiv id=${id}')),
        catchError(this.handleError<IKpiValue>('getKpiValue'))
      );
  }

  /**
   * [判断IKpiValue是否存在，根据 field 和 value]
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
    return this.http.get<IKpiValue[]>(url)
      .pipe(
        map(kvs => kvs[0]), // returns a {0|1} element array
        tap(kv => {
          const outcome = kv ? `fetched` : `did not find`;
          this.log(`${outcome} KpiValue _id=${qstr}`);
        }),
        catchError(this.handleError<IKpiValue>(`getKpiValue ${qstr}`))
      );
  }

  /**
   * [判断IKpiValue是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的IKpiValue
   * @param  {IKpiValue}             kpi [待创建的IKpiValue]
   * @return {Observable<IKpiValue>}    [新创建的IKpiValue]
   */
  createKpiValue(kpiv: IKpiValue): Observable<IKpiValue> {
    return this.http
      .post<IKpiValue>(this.baseUrl, kpiv, httpOptions)
      .pipe(
        tap((newKpiValue: IKpiValue) => this.log(`added kpiv w/ id=${newKpiValue._id}`)),
        catchError(this.handleError<IKpiValue>('createKpiValue'))
      );
  }

  /**
   * 在数据库中，更新某个IKpiValue信息
   * @param  {IKpiValue}             kpi [待更新的IKpiValue]
   * @return {Observable<IMTestSpec>}    [更新后的IKpiValue]
   */
  updateKpiValue(kpiv: IKpiValue): Observable<IKpiValue> {
    const url = `${this.baseUrl}/${kpiv._id}`;
    return this.http
      .put(url, kpiv, httpOptions)
      .pipe(
        tap(_ => this.log(`updated kpiv id=${kpiv._id}`)),
        catchError(this.handleError<any>('updateKpiValue'))
      );
  }

  patchKpiValue(id: string, patch: any): Observable<IKpiValue> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch kpiv id=${id}`)),
        catchError(this.handleError<any>('patchKpiValue'))
      );
  }

  /**
   * 在数据库中，删除某个IKpiValue
   * @param  {IKpiValue}            kpi [description]
   * @return {Observable<void>}    [description]
   */
  deleteKpiValue(kpiv: IKpiValue): Observable<IKpiValue> {
    const id = typeof kpiv === 'string' ? kpiv : kpiv._id;
    const url = `${this.baseUrl}/${kpiv._id}`;
    return this.http.delete<IKpiValue>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete kpiv id=${id}`)),
        catchError(this.handleError<IKpiValue>('deleteKpiValue'))
      );
  }
}

