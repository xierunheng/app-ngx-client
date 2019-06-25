import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import { IProsegCapabilityElite, IProsegCapability } from '../model/proseg-cap';
import {IExistService} from './common.service';
import * as _ from 'lodash';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ProsegCapabilityService implements IExistService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/prosegCapabilitys';
  private eliteFields = '_id oid';
  private profileFields = '-pCap -eCap -mCap';

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
    this.messageService.add(`ProsegCapabilityService: ${message}`);
  }


  /**
   * [获取所有的工艺段产能信息]
   * @return {Observable<IProsegCapability[]>} [工艺段产能信息Array]
   */
  getProsegCapabilitys(field: string = '', sort: string = '-_id'): Observable<IProsegCapability[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IProsegCapability[]>(url)
      .pipe(
        tap(_ => this.log('fetched getProsegCapabilitys')),
        catchError(this.handleError<IProsegCapability[]>(`getProsegCapabilitys`,[]))
      );

  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getProsegCapabilitysNo404<Data>(query: any): Observable<IProsegCapability> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IProsegCapability[]>(url)
      .pipe(
        map(data => data[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} data _id=${qstr}`);
        }),
        catchError(this.handleError<IProsegCapability>(`getProsegCapabilitys ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询ProsegCaps，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询忽略的数量]
   * @return {Observable<IProsegCapability[]>}       [查询结果，IProsegCapability数组]
   */
  searchProsegCaps(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IProsegCapability[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IProsegCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found ProsegCaps matching "${qstr}"`)),
        catchError(this.handleError<IProsegCapability[]>('searchProsegCaps', []))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IProsegCapability[]>}       [查询结果，ProsegCaps数组]
   */
  searchProsegCapsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IProsegCapability[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IProsegCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found ProsegCaps matching "${query}"`)),
        catchError(this.handleError<IProsegCapability[]>('searchProsegCaps', []))
      );
  }

  /**
   * [获取所有的工艺段产能关键信息]
   * @return {Observable<IProsegCapabilityElite[]>} [工艺段产能关键信息Array]
   */
  getProsegCapsElite(): Observable<IProsegCapabilityElite[]> {
    return this.getProsegCapabilitys(this.eliteFields)

  }

  /**
   * [getProsegCapsProfile 获取所有的工艺段产能 Profile 信息]
   * @return {Observable<IProsegCapability[]>} [description]
   */
  getProsegCapsProfile(): Observable<IProsegCapability[]> {
    return this.getProsegCapabilitys(this.profileFields);
  }

  /**
   * [getProsegCapsBy 通过简单的查询条件，获取相应的工艺段产能信息]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IProsegCapability[]>}   [description]
   */
  getProsegCapsBy(query: any = {}): Observable<IProsegCapability[]> {
    return this.searchProsegCaps(query);
  }

  /**
   * [getProsegCapsEliteBy 通过简单的查询条件，获取相应的工艺段产能关键信息]
   * @param  {any                               = {}}        query [description]
   * @return {Observable<IProsegCapabilityElite[]>}   [description]
   */
  getProsegCapsEliteBy(query: any = {}): Observable<IProsegCapabilityElite[]> {
    return this.searchProsegCaps(query, this.eliteFields);
  }

  /**
   * [getProsegCapsProfileBy 通过简单的查询条件，获取相应的工艺段产能 Profifle 信息]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IProsegCapability[]>}   [description]
   */
  getProsegCapsProfileBy(query: any = {}): Observable<IProsegCapability[]> {
    return this.searchProsegCaps(query, this.profileFields);

  }

  /**
   * [getNewProsegCapability 从数据库获取一个全新的 ProsegCapability,自带 _id]
   * @return {Observable<IProsegCapability>} [description]
   */
  getNewProsegCapability(): Observable<IProsegCapability> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IProsegCapability>(url)
      .pipe(
        tap(_ => this.log('fetched getNewProsegCapability')),
        catchError(this.handleError<IProsegCapability>('getNewProsegCapability'))
      )
  }


  /**
   * 根据 _id 获取单个工艺段产能信息
   * @param  {string}                        id [工艺段产能的_id]
   * @return {Observable<IProsegCapability>}    [单个工艺段产能信息]
   */
  getProsegCapability(id: string): Observable<IProsegCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IProsegCapability>(url)
      .pipe(
        tap(_ => this.log('fetched getProsegCapability')),
        catchError(this.handleError<IProsegCapability>('getProsegCapability'))
      )
  }

  /**
   * [判断操作段名称是否存在，根据 field 和 value]
   * @param  {any}           query [description]
   * @return {Observable<void>}       [description]
   */
  exist(query: any): Observable<any> {
    // const url = `${this.baseUrl}/exist`;
    // return this.http
    //   .post(url, query, httpOptions)
    //   .pipe(
    //     map((res: HttpResponse<any>) => res.status === 204),
    //     tap(_ => this.log('exist proseg-cap')),
    //     catchError(this.handleError<boolean>('exist'))
    //   )
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}&field=null&limit=1`;
    return this.http.get<IProsegCapability[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} data _id=${qstr}`);
        }),
        catchError(this.handleError<IProsegCapability>(`getProsegCapability> ${qstr}`))
      );

  }


  /**
   * [判断操作段名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的工艺段产能信息
   * @param  {IProsegCapability}             psc [待创建的工艺段产能信息]
   * @return {Observable<IProsegCapability>}     [新创建的工艺段产能信息]
   */
  createProsegCapability(psc: IProsegCapability): Observable<IProsegCapability> {
    return this.http
      .post<IProsegCapability>(this.baseUrl, psc)
      .pipe(
        tap(_ => this.log('fetched createProsegCapability')),
        catchError(this.handleError<IProsegCapability>('createProsegCapability'))
      );
  }

  /**
   * 在数据库中，更新某个工艺段产能信息
   * @param  {IProsegCapability}             psc [待更新的工艺段产能信息]
   * @return {Observable<IProsegCapability>}     [已更新的工艺段产能信息]
   */
  updateProsegCapability(psc: IProsegCapability): Observable<IProsegCapability> {
    const url = `${this.baseUrl}/${psc._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IProsegCapability>(url, psc)
      .pipe(
        tap(_ => this.log('fetched updateProsegCapability')),
        catchError(this.handleError<IProsegCapability>('updateProsegCapability'))
      );
  }

  patchProsegCapability(id: string, patch: any): Observable<IProsegCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IProsegCapability>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchProsegCapability')),
        catchError(this.handleError<IProsegCapability>('patchProsegCapability'))
      );
  }


  /**
   * 在数据库中，删除某个工艺段产能信息
   * @param  {IProsegCapability} psc [待删除的工艺段产能信息]
   * @return {Observable<void>}      [description]
   */
  deleteProsegCapability(psc: IProsegCapability): Observable<IProsegCapability> {
    const url = `${this.baseUrl}/${psc._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IProsegCapability>(url, httpOptions)
    .pipe(
      tap(_ => this.log(`deleteProsegCapability id=${psc._id}`)),
      catchError(this.handleError<IProsegCapability>('deleteHs'))
    );
  }


  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
