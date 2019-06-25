import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { IJobOrderElite, IJobOrder, JobOrder } from '../model/job-order';
import { IWorkMaster } from '../model/work-master';
import { ITerminal } from '../model/terminal';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class JobOrderService implements IExistService {

  jos: IJobOrder[] = [];

  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private eliteFields = '_id oid';
  private profileFields = '-pReq -eReq -mReq -para -availableCmd';

  private baseUrl = '/api/jobOrders';

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
    this.messageService.add(`JobOrderService: ${message}`);
  }

  /**
   * 获取所有的 JobOrder 工单信息
   * @return {Observable<IJobOrder[]>} [JobOrder工单信息 Array]
   */
  getJobOrders(field: string = '', sort: string = '-_id'): Observable<IJobOrder[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IJobOrder[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched JobOrders')),
        catchError(this.handleError('getJobOrders', []))
      );
  }

  /**
   * 获取所有的工单关键信息
   * @return {Observable<IJobOrderElite[]>} [工单关键信息 Array]
   */
  getJobOrdersElite(): Observable<IJobOrderElite[]> {
    return this.getJobOrders(this.eliteFields);
  }

  /**
   * 获取所有的工单 Profile 信息
   * @return {Observable<IJobOrderElite[]>} [工单关键信息 Array]
   */
  getJobOrdersProfile(): Observable<IJobOrder[]> {
    return this.getJobOrders(this.profileFields);
  }

  /**
   * [getNewJobOrder 从数据库获取一个全新的 JobOrder,自带 _id]
   * @return {Observable<IJobOrder>} [description]
   */
  getNewJobOrder(): Observable<IJobOrder> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IJobOrder>(url)
      .pipe(
        tap(_ => this.log('fetch new JobOrder ')),
        catchError(this.handleError<IJobOrder>('getNewJobOrder'))
      );
  }

  /**
   * 根据 _id 获取单个工单信息
   * @param  {string}                id [工单的 _id]
   * @return {Observable<IJobOrder>}    [description]
   */
  getJobOrder(id: string): Observable<IJobOrder> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IJobOrder>(url)
      .pipe(
        tap(_ => this.log('fetch JobOrder id=${id}')),
        catchError(this.handleError<IJobOrder>('getJobOrder'))
      );
  }

  /**
   * [通过过滤条件查询JobOrders，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IJobOrder[]>}       [查询结果，JobOrder数组]
   */
  searchJobOrders(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IJobOrder[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IJobOrder[]>(url)
      .pipe(
        tap(_ => this.log(`found JobOrders matching "${qstr}"`)),
        catchError(this.handleError<IJobOrder[]>('searchJobOrders', []))
      );
  }

  /**
   * [通过过滤条件查询JobOrders，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IJobOrder[]>}       [查询结果，JobOrder数组]
   */
  searchJobOrdersEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IJobOrder[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IJobOrder[]>(url)
      .pipe(
        tap(_ => this.log(`found JobOrders matching "${query}"`)),
        catchError(this.handleError<IJobOrder[]>('searchJobOrders', []))
      );
  }

  /** GET JobOrder by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getJobOrderNo404<Data>(query: any): Observable<IJobOrder> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IJobOrder[]>(url)
      .pipe(
        map(jos => jos[0]), // returns a {0|1} element array
        tap(jo => {
          const outcome = jo ? `fetched` : `did not find`;
          this.log(`${outcome} JobOrder _id=${qstr}`);
        }),
        catchError(this.handleError<IJobOrder>(`getJobOrderNo404 ${qstr}`))
      );
  }

  /**
   * [getJobOrdersBy 获取所有的 JobOrder 工单信息，查询条件由 Client 提供]
   * @param  {any                  = {}}        query [description]
   * @return {Observable<IJobOrder[]>}   [description]
   */
  getJobOrdersBy(query: any = {}): Observable<IJobOrder[]> {
    return this.searchJobOrders(query);
  }

  /**
   * [getJobOrdersEliteBy 获取所有的 JobOrder 工单关键信息，查询条件由 Client 提供]
   * @param  {any                       = {}}        query [description]
   * @return {Observable<IJobOrderElite[]>}   [description]
   */
  getJobOrdersEliteBy(query: any = {}): Observable<IJobOrderElite[]> {
    return this.searchJobOrders(query, this.eliteFields);
  }

  /**
   * [getJobOrdersProfileBy 获取所有的 JobOrder 工单 Profile 信息，查询条件由 Client 提供]
   * @param  {any                  = {}}        query [description]
   * @return {Observable<IJobOrder[]>}   [description]
   */
  getJobOrdersProfileBy(query: any = {}): Observable<IJobOrder[]> {
    return this.searchJobOrders(query, this.profileFields);
  }

  getJobOrderBy(query: any = {}): Observable<IJobOrder> {
    return this.getJobOrderNo404(query);
  }

  /**
   * 通过jobOrder 的 _id数组 获取JobOrder数组
   * @param  {string[]}               ids [description]
   * @return {Observable<IJobOrder[]>}     [description]
   */
  getManyJobOrders(ids: string[]): Observable<IJobOrder[]> {
    let query = { _id: { $in: ids } };
    return this.getJobOrdersBy(query);
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  getAggregateSublot(oid: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/slot/${oid}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetch rmr')),
        catchError(this.handleError<any>('getAggregateSublot'))
      );
  }

   /**
    * [判断g工单请求是否存在，根据 field 和 value]
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
    return this.http.get<IJobOrder[]>(url)
      .pipe(
        map(jos => jos[0]), // returns a {0|1} element array
        tap(jo => {
          const outcome = jo ? `fetched` : `did not find`;
          this.log(`${outcome} JobOrder _id=${qstr}`);
        }),
        catchError(this.handleError<IJobOrder>(`getJobOrder ${qstr}`))
      );
  }

  /**
   * [判断工单请求名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的JobOrder
   * @param  {IJobOrder}             jo [待创建的JobOrder]
   * @return {Observable<IJobOrder>}    [新创建的JobOrder]
   */
  createJobOrder(jo: IJobOrder): Observable<IJobOrder> {
    return this.http
      .post<IJobOrder>(this.baseUrl, jo, httpOptions)
      .pipe(
        tap((newJobOrder: IJobOrder) => this.log(`added JobOrder w/ id=${newJobOrder._id}`)),
        catchError(this.handleError<IJobOrder>('createJobOrder'))
      );
  }

  /**
   * 在数据库中，更新某个JobOrder
   * @param  {IJobOrder}             jo [待更新的JobOrder]
   * @return {Observable<IJobOrder>}    [新更新的JobOrder]
   */
  updateJobOrder(jo: IJobOrder): Observable<IJobOrder> {
    const url = `${this.baseUrl}/${jo._id}`;
    return this.http
      .put(url, jo, httpOptions)
      .pipe(
        tap(_ => this.log(`updated JobOrder id=${jo._id}`)),
        catchError(this.handleError<any>('updateJobOrder'))
      );
  }

  patchJobOrder(jo: IJobOrder, patch: any): Observable<IJobOrder> {
    const url = `${this.baseUrl}/${jo._id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch JobOrder id=${jo._id}`)),
        catchError(this.handleError<any>('patchJobOrder'))
      );
  }

  /**
   * 在数据库中，删除某个JobOrder
   * @param  {IJobOrder}        jo [待删除的JobOrder]
   * @return {Observable<void>}    [description]
   */
  deleteJobOrder(jo: IJobOrder): Observable<IJobOrder> {
    const id = typeof jo === 'string' ? jo : jo._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IJobOrder>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete JobOrder id=${id}`)),
        catchError(this.handleError<IJobOrder>('deleteJobOrder'))
      );
  }

  /**
   * 当用户修改 JobOrder 的 HierarchyScope 后，同步更新资源的 HierarchyScope
   * @param  {IJobOrder} jo [description]
   * @return {IJobOrder}    [description]
   */
  changeHs(jo: IJobOrder): IJobOrder {
    jo.pReq.forEach((value, index, array) => value.hs = jo.hs);
    jo.eReq.forEach((value, index, array) => value.hs = jo.hs);
    jo.mReq.forEach((value, index, array) => value.hs = jo.hs);
    return jo;
  }

  /**
   * 根据JobOrder 创建 fullcalendar-schedule 使用的 events
   * TODO: 根据状态呈现不同的颜色
   * @param  {IJobOrder[]} jos [description]
   * @return {any[]}          [description]
   */
  createEvents(jos: IJobOrder[]): any[] {
    let events: any[] = jos.map(item => {
      return {
        id: item._id,
        resourceId: item.hs._id,
        start: item.startTime,
        end: item.endTime,
        title: item.oid,
        allDay: false
      };
    });

    return events;
  }

  do(model: ITerminal, cmd: string): Observable<any> {
    const url = `${this.baseUrl}/do/${cmd}`;
    return this.http
      .put(url, model, httpOptions)
      .pipe(
        catchError(this.handleError<any>('do'))
      );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
