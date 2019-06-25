import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import { IOrderElite, IOrder, IOrderItem, IOrderProfile } from '../model/order';
import { IExistService } from './common.service';
import * as _ from 'lodash';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class OrderService implements IExistService {

  os: IOrder[] = [];

  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/orders';
  private eliteFields = '_id oid priority deliveryTime opDef';
  private profileFields = '-items -para';
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
    this.messageService.add(`OrderService: ${message}`);
  }

  /**
   * 获取所有的Order订单信息
   * @return {Observable<IOrder[]>} [Order订单信息 Array]
   */
  getOrders(field: string = '', sort: string = '-_id'): Observable<IOrder[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOrder[]>(url)
      .pipe(
        tap(_ => this.log('fetcht getOrders')),
        catchError(this.handleError<IOrder[]>('getOrders', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getOrdersNo404<Data>(query: any): Observable<IOrder> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOrder[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} data _id=${qstr}`);
        }),
        catchError(this.handleError<IOrder>(`getOrders ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询Order，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询忽略的数量]
   * @return {Observable<IOrder[]>}       [查询结果，IOrder数组]
   */
  searchOrder(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOrder[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOrder[]>(url)
      .pipe(
        tap(_ => this.log(`found Order matching "${qstr}"`)),
        catchError(this.handleError<IOrder[]>('searchOrder', []))
      );
  }

  /**
   * [通过过滤条件查询Order，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOrder[]>}       [查询结果，hs数组]
   */
  searchOrderEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOrder[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOrder[]>(url)
      .pipe(
        tap(_ => this.log(`found Order matching "${query}"`)),
        catchError(this.handleError<IOrder[]>('searchOrder', []))
      );
  }

  /**
   *根据 _id 获取单个Order
   * @return {Observable<IOrder>} [Order订单信息 Array]
   */
  getOrder(id: string): Observable<IOrder> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOrder>(url)
      .pipe(
        tap(_ => this.log('fetch Order id=${id}')),
        catchError(this.handleError<IOrder>('getOrder'))
      );
  }

  /**
   * 获取所有的Order订单信息
   * @return {Observable<IOrder[]>} [Order订单信息 Array]
   */
  getOrdersBy(query: any = {}): Observable<IOrder[]> {
    return this.searchOrder(query);
  }

  /**
   * 获取所有的工单关键信息
   * @return {Observable<IJobOrderElite[]>} [工单关键信息 Array]
   */
  getOrdersElite(): Observable<IOrderElite[]> {
      return this.getOrders(this.eliteFields);
  }

  /**
   * [getOrdersEliteBy 通过简单的查询条件，获取相应的工单关键信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IOrderElite[]>}   [description]
   */
  getOrdersEliteBy(query: any = {}): Observable<IOrderElite[]> {
      return this.searchOrder(query);
  }

  /**
   * [getOrdersProfile 获取相应的工单 Profile]
   * @return {Observable<IOrder[]>} [description]
   */
  getOrdersProfile(): Observable<IOrder[]> {
    return this.getOrders(this.profileFields);
  }

  /**
   * [getOrdersProfileBy 通过简单的查询条件，获取相应的工单 Profile]
   * @param  {any               = {}}        query [description]
   * @return {Observable<IOrder[]>}   [description]
   */
  getOrdersProfileBy(query: any = {}): Observable<IOrder[]> {
    return this.searchOrder(query,this.profileFields);
  }

  /**
   * [getNewOrder 从数据库获取一个全新的 order,自带 _id]
   * @return {Observable<IOrder>} [description]
   */
  getNewOrder(): Observable<IOrder> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOrder>(url)
      .pipe(
        tap(_ => this.log('fetcht getNewOrder')),
        catchError(this.handleError<IOrder>('getNewOrder'))
      )
  }



  getAggregateItems(): Observable<IOrderItem[]> {
    const url = `${this.baseUrl}/aggr/items`;
    return this.http.get<IOrderItem[]>(url)
      .pipe(
        tap(_ => this.log('fetcht getAggregateItems')),
        catchError(this.handleError<IOrderItem[]>('getAggregateItems', []))
      )
  }
  /**
  * [判断订单请求是否存在，根据 field 和 value]
  * @param  {string}           field [description]
  * @param  {any}              value [description]
  * @return {Observable<void>}       [description]
  */
  exist(query: any): Observable<any> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}&field=null&limit=1`;
    return this.http.get<IOrder[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Order _id=${qstr}`);
        }),
        catchError(this.handleError<IOrder>(`getOrder ${qstr}`))
      );
  }

  /**
  * [判断订单请求名称是否存在，根据 field 和 value]
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
        tap(_ => this.log('fetcht getOrders')),
        catchError(this.handleError<string>('getOrders'))
      )
  }

  /**
   * 在数据库中，创建新的JobOrder
   * @param  {IOrder}             jo [待创建的JobOrder]
   * @return {Observable<IOrder>}    [新创建的JobOrder]
   */
  createOrder(o: IOrder): Observable<IOrder> {
    return this.http
      .post<IOrder>(this.baseUrl, o, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht createOrder')),
        catchError(this.handleError<IOrder>('createOrder'))
      )
  }

  /**
   * 在数据库中，更新某个JobOrder
   * @param  {IOrder}             jo [待更新的JobOrder]
   * @return {Observable<IOrder>}    [新更新的JobOrder]
   */
  updateOrder(o: IOrder): Observable<IOrder> {
    const url = `${this.baseUrl}/${o._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IOrder>(url, o)
      .pipe(
        tap(_ => this.log('fetcht updateOrder')),
        catchError(this.handleError<IOrder>('updateOrder'))
      )
  }

  patchOrder(o: IOrder, patch: any): Observable<IOrder> {
    const url = `${this.baseUrl}/${o._id}`;
    return this.http
      .patch<IOrder> (url, patch)
      .pipe(
        tap(_ => this.log('fetcht patchOrder')),
        catchError(this.handleError<IOrder>('patchOrder'))
      )
  }

  /**
   * 在数据库中，删除某个JobOrder
   * @param  {IOrder}        jo [待删除的JobOrder]
   * @return {Observable<void>}    [description]
   */
  deleteOrder(o: IOrder): Observable<IOrder> {
    const url = `${this.baseUrl}/${o._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IOrder>(url)
      .pipe(
        tap(_ => this.log(`deleteOrder id=${o._id}`)),
        catchError(this.handleError<IOrder> ('deleteOrder'))
      );
  }

  /**
   * [发布一个订单]
   * @param  {string[]}        ids [description]
   * @return {Observable<any>}     [description]
   */
  release(id: string): Observable<any> {
    const url = `${this.baseUrl}/release/${id}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log('fetcht release')),
        catchError(this.handleError('release'))
      )
  }

  /**
 * [多个同时生成布产单]
 * @param  {string[]}        ids [description]
 * @return {Observable<any>}     [description]
 */
  releaseMany(ids: string[]): Observable<any> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/releasemany/${strIds}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log('fetcht releaseMany')),
        catchError(this.handleError('releaseMany'))
      )
  }
  /**
   * 撤销发布
   * @param  {string}          id [description]
   * @return {Observable<any>}    [description]
   */
  unrelease(id: string): Observable<any> {
    const url = `${this.baseUrl}/unrelease/${id}`;
    return this.http
      .put(url, {})
      .pipe(
        tap(_ => this.log('fetcht unrelease')),
        catchError(this.handleError('unrelease'))
      )
  }
  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
