import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IOpCapabilityElite, IOpCapability } from '../model/op-cap';
import * as _ from 'lodash';
import {IExistService} from './common.service';
import { MessageService } from './message.service';

function handleError(err) {
  return Observable.throw(err.json().error || 'Server error');
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OpCapabilityService implements IExistService {
  private baseUrl = '/api/opCapabilitys';
  private eliteFields = '_id oid';
  private profileFields = '-pCap -eCap -mCap -prosegCap';

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
    this.messageService.add(`OpCapabilityService: ${message}`);
  }

  /**
   * 获取所有的操作产能
   * @return {Observable<IOpCapability[]>} [操作产能Array]
   */
  getOpCapabilitys(field: string = '', sort: string = '-_id'): Observable<IOpCapability[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOpCapability[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched OpCapabilitys')),
        catchError(this.handleError('getOpCapabilitys', []))
      );
  }

  /**
   * [通过过滤条件查询OpCapabilitys，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpCapability[]>}       [查询结果，OpCapability数组]
   */
  searchOpCapabilitys(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpCapability[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found OpCapabilitys matching "${qstr}"`)),
        catchError(this.handleError<IOpCapability[]>('searchOpCapabilitys', []))
      );
  }

  /**
   * [通过过滤条件查询OpCapabilitys，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpCapability[]>}       [查询结果，OpCapability数组]
   */
  searchOpCapabilitysEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpCapability[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found OpCapabilitys matching "${query}"`)),
        catchError(this.handleError<IOpCapability[]>('searchOpCapabilitys', []))
      );
  }

  /** GET OpCapability by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getOpCapabilityNo404<Data>(query: any): Observable<IOpCapability> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOpCapability[]>(url)
      .pipe(
        map(opcs => opcs[0]), // returns a {0|1} element array
        tap(opc => {
          const outcome = opc ? `fetched` : `did not find`;
          this.log(`${outcome} OpCapability _id=${qstr}`);
        }),
        catchError(this.handleError<IOpCapability>(`getOpCapability ${qstr}`))
      );
  }

  /**
   * 获取所有的操作产能关键信息
   * @return {Observable<IOpCapabilityElite[]>} [操作产能关键信息Array]
   */
  getOpCapabilitysElite(): Observable<IOpCapabilityElite[]> {
    return this.getOpCapabilitys(this.eliteFields);
  }

  /**
   * [getOpCapabilitysProfile 获取所有的操作产能 Profile 信息]
   * @return {Observable<IOpCapability[]>} [description]
   */
  getOpCapabilitysProfile(): Observable<IOpCapability[]> {
    return this.getOpCapabilitys(this.profileFields);
  }

  /**
   * [getNewOpCapability 从数据库获取一个全新的 OpCapability,自带 _id]
   * @return {Observable<IOpCapability>} [description]
   */
  getNewOpCapability(): Observable<IOpCapability> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOpCapability>(url)
      .pipe(
        tap(_ => this.log('fetch new OpCapability ')),
        catchError(this.handleError<IOpCapability>('getNewOpCapability'))
      );
  }

  /**
   * 根据 _id 获取单个操作产能信息
   * @param  {string}                    id [操作产能的 _id]
   * @return {Observable<IOpCapability>}    [单个操作产能信息]
   */
  getOpCapability(id: string): Observable<IOpCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOpCapability>(url)
      .pipe(
        tap(_ => this.log('fetch OpCapability id=${id}')),
        catchError(this.handleError<IOpCapability>('getOpCapability'))
      );
  }

  /**
   * [getOpCapabilitysByQuery 通过简单的查询条件，获取相应的 OpCapabilitys]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IOpCapability[]>}   [description]
   */
  getOpCapabilitysByQuery(query: any = {}): Observable<IOpCapability[]> {
    return this.searchOpCapabilitys(query);
  }

  /**
   * [getOpCapabilitysEliteBy 通过简单的查询条件，获取相应的 OpCapabilitys 关键信息]
   * @param  {any                           = {}}        query [description]
   * @return {Observable<IOpCapabilityElite[]>}   [description]
   */
  getOpCapabilitysEliteBy(query: any = {}): Observable<IOpCapabilityElite[]> {
    return this.searchOpCapabilitys(query, this.eliteFields);
  }

  /**
   * [getOpCapabilitysProfileBy 通过简单的查询条件，获取相应的 OpCapabilitys Profile 信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IOpCapability[]>}   [description]
   */
  getOpCapabilitysProfileBy(query: any = {}): Observable<IOpCapability[]> {
    return this.searchOpCapabilitys(query, this.profileFields);
  }

  getOpCapabilityByQuery(query: any = {}): Observable<IOpCapability> {
    return this.getOpCapabilityNo404(query);
  }

  /**
   * [判断操作定义是否存在，根据 field 和 value]
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
    return this.http.get<IOpCapability[]>(url)
      .pipe(
        map(opcs => opcs[0]), // returns a {0|1} element array
        tap(opc => {
          const outcome = opc ? `fetched` : `did not find`;
          this.log(`${outcome} OpCapability _id=${qstr}`);
        }),
        catchError(this.handleError<IOpCapability>(`getOpCapability ${qstr}`))
      );
  }

  /**
   * [判断操作名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的操作产能信息
   * @param  {IOpCapability}             opc [待创建的操作产能信息]
   * @return {Observable<IOpCapability>}     [新创建的操作产能信息]
   */
  createOpCapability(opc: IOpCapability): Observable<IOpCapability> {
    return this.http
      .post<IOpCapability>(this.baseUrl, opc, httpOptions)
      .pipe(
        tap((newOpCap: IOpCapability) => this.log(`added OpCapability w/ id=${newOpCap._id}`)),
        catchError(this.handleError<IOpCapability>('createOpCapability'))
      );
  }

  /**
   * 在数据库中，更新某个操作产能信息
   * @param  {IOpCapability}             opc [待更新的操作产能信息]
   * @return {Observable<IOpCapability>}     [更新后的操作产能信息]
   */
  updateOpCapability(opc: IOpCapability): Observable<IOpCapability> {
    const url = `${this.baseUrl}/${opc._id}`;
    return this.http
      .put(url, opc, httpOptions)
      .pipe(
        tap(_ => this.log(`updated ops id=${opc._id}`)),
        catchError(this.handleError<any>('updateOpCapability'))
      );
  }

  patchOpCapability(id: string, patch: any): Observable<IOpCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch opc id=${id}`)),
        catchError(this.handleError<any>('patchOpCapability'))
      );
  }

  /**
   * 在数据库中，删除某个操作产能信息
   * @param  {IOpCapability}    opc [待删除的操作产能信息]
   * @return {Observable<void>}     [description]
   */
  deleteOpCapability(opc: IOpCapability): Observable<IOpCapability> {
    const id = typeof opc === 'string' ? opc : opc._id;
    const url = `${this.baseUrl}/${opc._id}`;
    return this.http.delete<IOpCapability>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete opc id=${id}`)),
        catchError(this.handleError<IOpCapability>('deleteOpCapability'))
      );
  }

}
