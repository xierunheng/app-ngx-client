import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import * as _ from 'lodash';

import { IOrderDefElite, IOrderDef } from '../model/order-def';
import {IExistService} from './common.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OrderDefService implements IExistService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/orderDefinitions';
  private eliteFields = '_id oid ver';
  private profileFields = '-opDef -items -para';

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
    this.messageService.add(`OrderDefService: ${message}`);
  }

  /**
   * 获取所有的操作定义信息
   * @return {Observable<IOrderDef[]>} [操作定义信息 Array]
   */
  getOrderDefs(field: string = '', sort: string = '-_id'): Observable<IOrderDef[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOrderDef[]>(url)
      .pipe(
        tap(_ => this.log('fetched getOrderDefs')),
        catchError(this.handleError<IOrderDef[]>('getOrderDefs', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getOrderDefs404<Data>(query: any): Observable<IOrderDef> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOrderDef[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} OrderDefs _id=${qstr}`);
        }),
        catchError(this.handleError<IOrderDef>(`getOrderDefs ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询忽略的数量]
   * @return {Observable<IOrderDef[]>}       [查询结果，hs数组]
   */
  searchOrderDefs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOrderDef[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOrderDef[]>(url)
      .pipe(
        tap(_ => this.log(`found OrderDefs matching "${qstr}"`)),
        catchError(this.handleError<IOrderDef[]>('searchOrderDefs', []))
      );
  }

  /**
   * [通过过滤条件查询OrderDef，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOrderDef[]>}       [查询结果，OrderDef数组]
   */
  searchOrderDefEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOrderDef[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOrderDef[]>(url)
      .pipe(
        tap(_ => this.log(`found OrderDef matching "${query}"`)),
        catchError(this.handleError<IOrderDef[]>('searchOrderDef', []))
      );
  }

  /**
   * 获取所有的操作定义关键信息
   * @return {Observable<IOrderDefElite[]>} [操作定义关键信息 Array]
   */
  getOrderDefsElite(): Observable<IOrderDefElite[]> {
      return this.getOrderDefs(this.eliteFields);
  }

  /**
   * [getOrderDefsProfile 获取所有的操作定义 Profile 信息]
   * @return {Observable<IOrderDef[]>} [description]
   */
  getOrderDefsProfile(): Observable<IOrderDef[]> {
          return this.getOrderDefs(this.profileFields);

  }

  /**
   * [getNewOrderDef 从数据库获取一个全新的 OrderDef,自带 _id]
   * @return {Observable<IOrderDef>} [description]
   */
  getNewOrderDef(): Observable<IOrderDef> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOrderDef>(url)
      .pipe(
        tap(_ => this.log('fetched getNewOrderDef')),
        catchError(this.handleError<IOrderDef>('getNewOrderDef'))
      )
  }

  /**
   * 根据 _id 获取单个操作定义信息
   * @param  {string}             id [操作定义的_id]
   * @return {Observable<IOrderDef>}    [单个操作定义信息]
   */
  getOrderDef(id: string): Observable<IOrderDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOrderDef>(url)
      .pipe(
        tap(_ => this.log('fetched getOrderDef')),
        catchError(this.handleError<IOrderDef>('getOrderDef'))
      )
  }

  /**
   * [getOrderDefsBy 通过简单的查询条件，获取相应的操作定义信息]
   * @param  {any                  = {}}        query [description]
   * @return {Observable<IOrderDef[]>}   [description]
   */
  getOrderDefsBy(query: any = {}): Observable<IOrderDef[]> {
     return this.searchOrderDefs(query);
  }

  /**
   * [getOrderDefsEliteBy 通过简单的查询条件，获取相应的操作定义关键信息]
   * @param  {any                       = {}}        query [description]
   * @return {Observable<IOrderDefElite[]>}   [description]
   */
  getOrderDefsEliteBy(query: any = {}): Observable<IOrderDefElite[]> {
    return this.searchOrderDefs(query,this.eliteFields);
  }

  /**
   * [getOrderDefsProfileBy 通过简单的查询条件，获取相应的操作 Profile]
   * @param  {any                  = {}}        query [description]
   * @return {Observable<IOrderDef[]>}   [description]
   */
  getOrderDefsProfileBy(query: any = {}): Observable<IOrderDef[]> {
      return this.searchOrderDefs(query, this.profileFields);
  }


  /**
   * [判断操作定义是否存在，根据 field 和 value]
   * @param  {any}           query [description]
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
    return this.http.get<IOrderDef[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} OrderDefs _id=${qstr}`);
        }),
        catchError(this.handleError<IOrderDef>(`getOrderDefs ${qstr}`))
      );
  }

  /**
   * [判断操作定义名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的操作定义信息
   * @param  {IOrderDef}             od [待创建的操作定义信息]
   * @return {Observable<IOrderDef>}     [新创建的操作定义信息]
   */
  createOrderDef(od: IOrderDef): Observable<IOrderDef> {
    return this.http
      .post<IOrderDef>(this.baseUrl, od, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createOrderDef')),
        catchError(this.handleError<IOrderDef>('createOrderDef'))
      )
  }

  /**
   * 在数据库中，更新某个操作定义信息
   * @param  {IOpDef}             od [待更新的操作定义信息]
   * @return {Observable<IOpDef>}     [更新后的操作定义信息]
   */
  updateOrderDef(od: IOrderDef): Observable<IOrderDef> {
    const url = `${this.baseUrl}/${od._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IOrderDef>(url, od)
      .pipe(
        tap(_ => this.log('fetched updateOrderDef')),
        catchError(this.handleError<IOrderDef>('updateOrderDef'))
      )
  }

  patchOrderDef(id: string, patch: any): Observable<IOrderDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IOrderDef>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchOrderDef')),
        catchError(this.handleError<IOrderDef>('patchOrderDef'))
      )
  }

  /**
   * 在数据库中，删除某个操作定义信息
   * @param  {IOrderDef}           od [待删除的操作定义信息]
   * @return {Observable<void>}     [description]
   */
  deleteOrderDef(od: IOrderDef): Observable<IOrderDef> {
    const url = `${this.baseUrl}/${od._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IOrderDef>(url)
      .pipe(
        tap(_ => this.log(`deleteOrderDef id=${od._id}`)),
        catchError(this.handleError<IOrderDef> ('deleteOrderDef'))
      );
  }


  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
