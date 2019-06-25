import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import {
  IOpsegRequirement, OpsegRequirement,
  IOpRequestElite, IOpRequest, OpRequest, IReleasingMReq
} from '../model/op-req';
import { IOpsegResponse } from '../model/op-res';
import { IOpDef } from '../model/op-def';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OpRequestService implements IExistService {
  private baseUrl = '/api/opRequests';
  private eliteFields = '_id oid mlot reqState';
  private profileFields = '-segReq -segRes -opmb';

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
    this.messageService.add(`OpRequestService: ${message}`);
  }


  /**
   * 获取所有的操作请求
   * @return {Observable<IOpRequest[]>} [操作请求Array]
   */
  getOpRequests(field: string = '', sort: string = '-_id'): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOpRequest[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched oprs')),
        catchError(this.handleError('getOpRequests', []))
      );
  }

  /**
   * [通过过滤条件查询OpRequests，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpRequest[]>}       [查询结果，OpRequest数组]
   */
  searchOpRequests(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpRequest[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpRequest[]>(url)
      .pipe(
        tap(_ => this.log(`found OpRequests matching "${qstr}"`)),
        catchError(this.handleError<IOpRequest[]>('searchOpRequests', []))
      );
  }

  /**
   * [通过过滤条件查询OpRequests，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpRequest[]>}       [查询结果，OpRequest数组]
   */
  searchOpRequestsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpRequest[]>(url)
      .pipe(
        tap(_ => this.log(`found OpRequests matching "${query}"`)),
        catchError(this.handleError<IOpRequest[]>('searchOpRequests', []))
      );
  }

  /** GET tOpRequest by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取信息
   * 当查询不到时，返回 undefined
   */
  getOpRequestNo404<Data>(query: any): Observable<IOpRequest> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOpRequest[]>(url)
      .pipe(
        map(OpRequests => OpRequests[0]), // returns a {0|1} element array
        tap(tOpRequest => {
          const outcome = OpRequest ? `fetched` : `did not find`;
          this.log(`${outcome} tOpRequest _id=${qstr}`);
        }),
        catchError(this.handleError<IOpRequest>(`gettOpRequest ${qstr}`))
      );
  }


  /**
   * [getOpRequestsBy 通过简单的查询条件，获取相应的操作请求信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IOpRequest[]>}   [description]
   */
  getOpRequestsBy(query: any = {}): Observable<IOpRequest[]> {
    return this.searchOpRequests(query);
  }
  /**
   * 获取所有的操作请求Profile
   * @return {Observable<IOpRequest[]>} [操作请求Array]
   */
  getOpRequestsProfile(): Observable<IOpRequest[]> {
    return this.getOpRequests(this.profileFields);
  }
  /**
   * 通过简单的查询条件，获取所有的操作请求Profile
   * @return {Observable<IOpRequest[]>} [操作请求Array]
   */
  getOpRequestsProfileBy(query: any = {}): Observable<IOpRequest[]> {
    return this.searchOpRequests(query, this.profileFields);
  }

  /**
   * 根据状态获取操作请求
   * @param  {string}                   state [description]
   * @return {Observable<IOpRequest[]>}       [操作请求信息]
   */
  getOpRequestsProfileByState(state: string): Observable<IOpRequest[]> {
    let query = { reqState: state };
    return this.getOpRequestsProfileBy(query);
  }

  /**
   * 获取所有的操作请求关键信息
   * @return {Observable<IOpRequestElite[]>} [操作请求关键信息Array]
   */
  getOpRequestsElite(): Observable<IOpRequestElite[]> {
    return this.getOpRequests(this.eliteFields);
  }

  /**
   * [getOpRequestsEliteBy 通过简单的查询条件，获取所有的操作请求关键信息]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IOpRequestElite[]>}   [description]
   */
  getOpRequestsEliteBy(query: any = {}): Observable<IOpRequestElite[]> {
    return this.searchOpRequests(query, this.eliteFields);
  }

  /**
   * [getNewOpRequest 从数据库获取一个全新的 OpRequest,自带 _id]
   * @return {Observable<IOpRequest>} [description]
   */
  getNewOpRequest(): Observable<IOpRequest> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOpRequest>(url)
      .pipe(
        tap(_ => this.log('fetch new opr ')),
        catchError(this.handleError<IOpRequest>('getNewOpRequest'))
      );
  }

  /**
   * 根据 _id 获取单个操作请求
   * @param  {string}                 id [操作请求的_id]
   * @return {Observable<IOpRequest>}    [单个操作请求]
   */
  getOpRequest(id: string): Observable<IOpRequest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOpRequest>(url)
      .pipe(
        tap(_ => this.log('fetch opReq id=${id}')),
        catchError(this.handleError<IOpRequest>('getOpRequest'))
      );
  }

  getOpRequestBy(query: any = {}): Observable<IOpRequest> {
    return this.getOpRequestNo404(query);
  }

  /**
   * [获取需要布产的物料，用于布产]
   * @return {Observable<any>} [description]
   */
  getAggregateMReq(): Observable<IReleasingMReq[]> {
    const url = `${this.baseUrl}/aggr/mreq`;
    return this.http.get<IReleasingMReq[]>(url)
      .pipe(
        tap(_ => this.log('fetch rmr')),
        catchError(this.handleError<IReleasingMReq[]>('getAggregateMReq'))
      );
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
    return this.http.get<IOpRequest[]>(url)
      .pipe(
        map(ors => ors[0]), // returns a {0|1} element array
        tap(or => {
          const outcome = or ? `fetched` : `did not find`;
          this.log(`${outcome} OpRequest _id=${qstr}`);
        }),
        catchError(this.handleError<IOpRequest>(`getOpRequest ${qstr}`))
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
   * @param  {IOpRequest[]}     oprs [OpRequest 列表]
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
   * 在数据库中，创建新的OpRequest操作请求
   * @param  {IOpRequest}             opr [待创建的OpRequest]
   * @return {Observable<IOpRequest>}     [新创建的OpRequest]
   */
  createOpRequest(opr: IOpRequest): Observable<IOpRequest> {
    return this.http
      .post<IOpRequest>(this.baseUrl, opr, httpOptions)
      .pipe(
        tap((newOpRequest: IOpRequest) => this.log(`added opr w/ id=${newOpRequest._id}`)),
        catchError(this.handleError<IOpRequest>('createOpRequest'))
      );
  }

  /**
   * 同时创建多个OpRequest
   * @param  {IOpRequest[]}             oprs [description]
   * @return {Observable<IOpRequest[]>}      [description]
   */
  createOpRequests(oprs: IOpRequest[]): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<IOpRequest[]>(url, oprs, httpOptions)
      .pipe(
        tap((newOpRequests: IOpRequest[]) => this.log('added OpRequests')),
        catchError(this.handleError<IOpRequest[]>('createOpRequests'))
      );
  }

  /**
   * [同时选择多个订单，并创建多个OpRequest与之对应，主要用于包装
   * 由于包装不需要物料的装配项，所以 可以整个订单一起处理]
   * @param  {IOpRequest[]}             oprs [description]
   * @return {Observable<IOpRequest[]>}      [description]
   */
  createOpRequestsByOrder(oprs: IOpRequest[]): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/ordermany`;
    return this.http
      .post<IOpRequest[]>(url, oprs, httpOptions)
      .pipe(
        tap((newOpRequests: IOpRequest[]) => this.log('added OpRequests by order')),
        catchError(this.handleError<IOpRequest[]>('createOpRequestsByOrder'))
      );
  }

  /**
 * [同时选择多个窑炉，并创建多个OpRequest与之对应，主要用于质检
 * 由于质检需要与窑炉一一对应]
 * @param  {IOpRequest[]}             oprs [description]
 * @return {Observable<IOpRequest[]>}      [description]
 */
  createOpRequestsByEquip(oprs: IOpRequest[]): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/equipmany`;
    return this.http
      .post<IOpRequest[]>(url, oprs, httpOptions)
      .pipe(
        tap((newOpRequests: IOpRequest[]) => this.log('added OpRequests by equipment')),
        catchError(this.handleError<IOpRequest[]>('createOpRequestsByEquip'))
      );
  }
  /**
   * 在数据库中，更新某个OpRequest
   * @param  {IOpRequest}             opr [待更新的OpRequest]
   * @return {Observable<IOpRequest>}     [更新后的OpRequest]
   */
  updateOpRequest(opr: IOpRequest): Observable<IOpRequest> {
    const url = `${this.baseUrl}/${opr._id}`;
    return this.http
      .put(url, opr, httpOptions)
      .pipe(
        tap(_ => this.log(`updated opr id=${opr._id}`)),
        catchError(this.handleError<any>('updateOpRequest'))
      );
  }


  patchOpRequest(id: string, patch: any): Observable<IOpRequest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch opr id=${id}`)),
        catchError(this.handleError<any>('patchOpRequest'))
      );
  }

  /**
   * [updateOpRequests description]
   * @param  {IOpRequest[]}             oprs [description]
   * @return {Observable<IOpRequest[]>}      [description]
   */
  updateOpRequests(oprs: IOpRequest[]): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .put(url, oprs, httpOptions)
      .pipe(
        tap(_ => this.log('updated oprs')),
        catchError(this.handleError<any>('updateOpRequests'))
      );
  }


  patchOpRequests(id: string, patch: any): Observable<IOpRequest[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('patch oprs')),
        catchError(this.handleError<any>('patchOpRequests'))
      );
  }

  /**
   * [updateOpRequestState description]
   * @param  {string[]}               ids      [description]
   * @param  {string}                 newstate [description]
   * @return {Observable<IOpRequest>}          [description]
   */
  updateOpRequestState(ids: string[], newstate: string): Observable<IOpRequest> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log(`updateOpRequest newstate=${newstate}`)),
        catchError(this.handleError<any>('updateOpRequestState'))
      );
  }

  patchOpRequestState(ids: string[], newstate: string, patch: any): Observable<IOpRequest> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}/${newstate}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patchOpRequest newstate=${newstate}`)),
        catchError(this.handleError<any>('patchOpRequestState'))
      );
  }

  /**
   * 在数据库中，删除某个OpRequest
   * @param  {IOpRequest}       opr [待删除的OpRequest操作请求]
   * @return {Observable<void>}     [description]
   */
  deleteOpRequest(opr: IOpRequest): Observable<IOpRequest> {
    const id = typeof opr === 'string' ? opr : opr._id;
    const url = `${this.baseUrl}/${opr._id}`;
    return this.http.delete<IOpRequest>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete opr id=${id}`)),
        catchError(this.handleError<IOpRequest>('deleteOpRequest'))
      );
  }

  /**
 * 在数据库中，删除多个 OpRequest
 * @param  {string[]}       ids [待删除的OpRequests's _id]
 * @return {Observable<void>}     [description]
 */
  deleteOpRequests(ids: string[]): Observable<string[]> {
    if (ids && ids.length > 0) {
      let strIds = ids.join(',');
      const url = `${this.baseUrl}/many/${strIds}`;
      return this.http.delete<string[]>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete oprs ids=${ids}`)),
        catchError(this.handleError<string[]>('deleteOpRequests'))
      );
    } else {
      //需要多做这样的判断和 of 操作
      return of(null);
    }
  }

  /**
   * [getSegReq description]
   * @param  {string}                 id    [description]
   * @param  {string}                 segid [description]
   * @return {Observable<IOpRequest>}       [description]
   */
  getOpSegReq(segid: string): Observable<IOpRequest> {
    const url = `${this.baseUrl}/opsegreq/${segid}`;
    return this.http.get<IOpRequest>(url)
      .pipe(
        tap(_ => this.log('fetch opSegReq segid=${segid}')),
        catchError(this.handleError<IOpRequest>('getOpSegReq'))
      );
  }

  /**
   * 在数据库中，创建新的操作段计划
   * @param  {string}                       id  [OpRequest's _id]
   * @param  {IOpsegRequirement}            ops [description]
   * @return {Observable<OpsegRequirement>}     [description]
   */
  createSegReq(id: string, ops: IOpsegRequirement): Observable<OpsegRequirement> {
    const url = `${this.baseUrl}/${id}/segreq`;
    return this.http
      .post<OpsegRequirement>(url, ops, httpOptions)
      .pipe(
        tap((newSegReq: OpsegRequirement) => this.log(`added segReq w/ segid=${newSegReq._id}`)),
        catchError(this.handleError<OpsegRequirement>('createSegReq'))
      );
  }

  /**
   * 更新操作段计划
   * @param  {string}                 id  [description]
   * @param  {IOpsegRequirement}      ops [description]
   * @return {Observable<IOpRequest>}     [description]
   */
  updateSegReq(id: string, ops: IOpsegRequirement): Observable<IOpRequest> {
    const url = `${this.baseUrl}/${id}/segreq/${ops._id}`;
    return this.http
      .put(url, ops, httpOptions)
      .pipe(
        tap(_ => this.log(`updated segReq id=${ops._id}`)),
        catchError(this.handleError<any>('updateSegReq'))
      );
  }

  /**
   * 更新操作段计划
   * @param  {string}                 id  [description]
   * @param  {IOpsegRequirement}      ops [description]
   * @return {Observable<IOpRequest>}     [description]
   */
  updateOpSegReq(ops: IOpsegRequirement): Observable<IOpRequest> {
    const url = `${this.baseUrl}/segreq/${ops._id}`;
    return this.http
      .put(url, ops, httpOptions)
      .pipe(
        tap(_ => this.log(`updated opSegReq id=${ops._id}`)),
        catchError(this.handleError<any>('updateSegReq'))
      );
  }

  patchSegReq(id: string, opsid: string, patch: any): Observable<IOpRequest> {
    const url = `${this.baseUrl}/${id}/segreq/${opsid}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch segReq id=${opsid}`)),
        catchError(this.handleError<any>('patchSegReq'))
      );
  }

  /**
   * 删除操作段计划
   * @param  {string}            id  [description]
   * @param  {IOpsegRequirement} ops [description]
   * @return {Observable<void>}      [description]
   */
  deleteSegReq(id: string, ops: IOpsegRequirement): Observable<IOpsegRequirement> {
    const url = `${this.baseUrl}/${id}/segreq/${ops._id}`;
    return this.http.delete<IOpsegRequirement>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete segReq id=${id}`)),
        catchError(this.handleError<IOpsegRequirement>('deleteSegReq'))
      );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
