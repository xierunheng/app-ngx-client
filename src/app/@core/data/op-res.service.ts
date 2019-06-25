import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';

import { IOpsegResponse,
  IOpResponseElite, IOpResponse, OpResponse } from '../model/op-res';
import {IExistService} from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OpResponseService implements IExistService {
  private baseUrl = '/api/opResponses';
  private eliteFields = '_id oid state';
  private profileFields = '-opReq -segRes';

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
    this.messageService.add(`OpResponseService: ${message}`);
  }

  /**
   * 获取所有的操作响应
   * @return {Observable<IOpResponse[]>} [操作响应Array]
   */
  getOpResponses(field: string = '', sort: string = '-_id'): Observable<IOpResponse[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOpResponse[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched OpResponses')),
        catchError(this.handleError('getOpResponses', []))
      );
  }

  /**
   * 获取所有的操作响应关键信息
   * @return {Observable<IOpResponseElite[]>} [操作响应关键信息Array]
   */
  getOpResponsesElite(): Observable<IOpResponseElite[]> {
    return this.getOpResponses(this.eliteFields);
  }

  /**
   * [getOpResponsesProfile 获取所有的操作响应 Profile]
   * @return {Observable<IOpResponse[]>} [description]
   */
  getOpResponsesProfile(): Observable<IOpResponse[]> {
    return this.getOpResponses(this.eliteFields);
  }

  /**
   * [getNewOpResponse 从数据库获取一个全新的 OpResponse,自带 _id]
   * @return {Observable<IOpResponse>} [description]
   */
  getNewOpResponse(): Observable<IOpResponse> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOpResponse>(url)
      .pipe(
        tap(_ => this.log('fetch new ops ')),
        catchError(this.handleError<IOpResponse>('getNewOpResponse'))
      );
  }

  /** GET OpResponse by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取操作响应信息
   * 当查询不到时，返回 undefined
   */
  getOpResponseNo404<Data>(query: any): Observable<IOpResponse> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOpResponse[]>(url)
      .pipe(
        map(oprss => oprss[0]), // returns a {0|1} element array
        tap(oprs => {
          const outcome = oprs ? `fetched` : `did not find`;
          this.log(`${outcome} OpResponse _id=${qstr}`);
        }),
        catchError(this.handleError<IOpResponse>(`getOpResponse ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个操作响应
   * @param  {string}                  id [操作响应的_id]
   * @return {Observable<IOpResponse>}    [单个操作响应]
   */
  getOpResponse(id: string): Observable<IOpResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOpResponse>(url)
      .pipe(
        tap(_ => this.log('fetch ps id=${id}')),
        catchError(this.handleError<IOpResponse>('getOpResponse'))
      );
  }

  /**
   * [通过过滤条件查询OpResponses，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpResponse[]>}       [查询结果，IOpResponse数组]
   */
  searchOpResponses(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpResponse[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpResponse[]>(url)
      .pipe(
        tap(_ => this.log(`found OpResponses matching "${qstr}"`)),
        catchError(this.handleError<IOpResponse[]>('searchOpResponses', []))
      );
  }

  /**
   * [通过过滤条件查询OpResponses，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpResponse[]>}       [查询结果，OpResponse数组]
   */
  searchOpResponsesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpResponse[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpResponse[]>(url)
      .pipe(
        tap(_ => this.log(`found OpResponses matching "${query}"`)),
        catchError(this.handleError<IOpResponse[]>('searchOpResponses', []))
      );
  }

  /**
   * [getOpResponsesBy 通过简单的查询条件，获取相应的操作响应信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IOpResponse[]>}   [description]
   */
  getOpResponsesBy(query: any = {}): Observable<IOpResponse[]> {
    return this.searchOpResponses(query);
  }

  /**
   * [getOpResponsesEliteBy 通过简单的查询条件，获取相应的操作响应关键信息]
   * @param  {any                         = {}}        query [description]
   * @return {Observable<IOpResponseElite[]>}   [description]
   */
  getOpResponsesEliteBy(query: any = {}): Observable<IOpResponseElite[]> {
    return this.searchOpResponses(query, this.eliteFields);
  }

/**
 * [getOpResponsesProfileBy 通过简单的查询条件，获取相应的操作响应 Profile]
 * @param  {any                    = {}}        query [description]
 * @return {Observable<IOpResponse[]>}   [description]
 */
  getOpResponsesProfileBy(query: any = {}): Observable<IOpResponse[]> {
    return this.searchOpResponses(query, this.profileFields);
  }

  getOpResponseBy(query: any = {}): Observable<IOpResponse> {
    return this.getOpResponseNo404(query);
  }

  /**
   * [判断操作响应是否存在，根据 field 和 value]
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
    return this.http.get<IOpResponse[]>(url)
      .pipe(
        map(oprss => oprss[0]), // returns a {0|1} element array
        tap(oprs => {
          const outcome = oprs ? `fetched` : `did not find`;
          this.log(`${outcome} OpResponse _id=${qstr}`);
        }),
        catchError(this.handleError<IOpResponse>(`getOpResponse ${qstr}`))
      );
  }

  /**
   * [判断操作响应是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的操作响应
   * @param  {IOpResponse}             opr [待创建的操作响应]
   * @return {Observable<IOpResponse>}     [新创建的操作响应]
   */
  createOpResponse(ops: IOpResponse): Observable<IOpResponse> {
    return this.http
      .post<IOpResponse>(this.baseUrl, ops, httpOptions)
      .pipe(
        tap((newProseg: IOpResponse) => this.log(`added ops w/ id=${newProseg._id}`)),
        catchError(this.handleError<IOpResponse>('createOpResponse'))
      );
  }

  /**
   * 在数据库中，更新某个操作响应
   * @param  {IOpResponse}             opr [待更新的操作响应]
   * @return {Observable<IOpResponse>}     [更新后的操作响应]
   */
  updateOpResponse(ops: IOpResponse): Observable<IOpResponse> {
    const url = `${this.baseUrl}/${ops._id}`;
    return this.http
      .put(url, ops, httpOptions)
      .pipe(
        tap(_ => this.log(`updated ps id=${ops._id}`)),
        catchError(this.handleError<any>('updateOpResponse'))
      );
  }

  /**
   * [新增patch]
   * @param  {string}                  id    [description]
   * @param  {any}                     patch [description]
   * @return {Observable<IOpResponse>}       [description]
   */
  patchOpResponse(id: string, patch: any): Observable<IOpResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch ops id=${id}`)),
        catchError(this.handleError<any>('patchOpResponse'))
      );
  }

  /**
   * 在数据库中，删除某个操作响应
   * @param  {IOpResponse}      opr [待删除的操作响应]
   * @return {Observable<void>}     [description]
   */
  deleteOpResponse(ops: IOpResponse): Observable<IOpResponse> {
    const id = typeof ops === 'string' ? ops : ops._id;
    const url = `${this.baseUrl}/${ops._id}`;
    return this.http.delete<IOpResponse>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete ops id=${id}`)),
        catchError(this.handleError<IOpResponse>('deleteOpResponse'))
      );
  }

  /**
   * 获取操作段规格
   * @param  {string}                  id    [description]
   * @param  {string}                  segid [description]
   * @return {Observable<IOpResponse>}       [description]
   */
  getOpSegRes(segid: string): Observable<IOpResponse> {
    const url = `${this.baseUrl}/opsegres/${segid}`;
    return this.http.get<IOpResponse>(url)
      .pipe(
        tap(_ => this.log('fetch OpSegRes id=${segid}')),
        catchError(this.handleError<IOpResponse>('getOpSegRes'))
      );
  }

  /**
   * 创建操作段规格
   * @param  {string}                     id  [description]
   * @param  {IOpsegResponse}             ops [description]
   * @return {Observable<IOpsegResponse>}     [description]
   */
  createSegRes(id: string, ops: IOpsegResponse): Observable<IOpsegResponse> {
    const url = `${this.baseUrl}/${id}/seg`;
    return this.http
      .post<IOpsegResponse>(this.baseUrl, ops, httpOptions)
      .pipe(
        tap((newOpsegRes: IOpsegResponse) => this.log(`added ops w/ id=${newOpsegRes._id}`)),
        catchError(this.handleError<IOpsegResponse>('createSegRes'))
      );
  }

  /**
   * 更新操作段规格
   * @param  {string}                  id  [description]
   * @param  {IOpsegResponse}          ops [description]
   * @return {Observable<IOpResponse>}     [description]
   */
  updateSegRes(id: string, ops: IOpsegResponse): Observable<IOpResponse> {
    console.log(ops);
    const url = `${this.baseUrl}/${id}/seg/${ops._id}`;
    return this.http
      .put(url, ops, httpOptions)
      .pipe(
        tap(_ => this.log(`updated opSegRes id=${ops._id}`)),
        catchError(this.handleError<any>('updateSegRes'))
      );
  }

  /**
   * 删除操作段规格
   * @param  {string}           id  [description]
   * @param  {IOpsegResponse}   ops [description]
   * @return {Observable<void>}     [description]
   */
  deleteSegRes(id: string, ops: IOpsegResponse): Observable<IOpsegResponse> {
    const url = `${this.baseUrl}/${id}/seg/${ops._id}`;
    return this.http.delete<IOpsegResponse>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete segReq id=${id}`)),
        catchError(this.handleError<IOpsegResponse>('deleteSegRes'))
      );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
