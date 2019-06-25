import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {IWmCapabilityElite, IWmCapability, WmCapability } from '../model/wm-cap';
import { IWorkMaster } from '../model/work-master';
import * as _ from 'lodash';

import {IExistService} from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WmCapabilityService implements IExistService {
  private baseUrl = '/api/workMasterCapabilitys';

  private eliteFields = '_id oid';
  private profileFields = '-pCap -eCap -mCap';

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
    this.messageService.add(`WmCapabilityService: ${message}`);
  }

  /**
   * 获取所有的作业能力信息
   * @return {Observable<IWmCapability[]>} [作业能力信息Array]
   */
  getWmCapabilitys(field: string = '', sort: string = '-_id'): Observable<IWmCapability[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWmCapability[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched WmCapabilitys')),
        catchError(this.handleError('getProsegs', []))
      );
  }


  /** GET WmCapability by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWmCapabilityNo404<Data>(query: any): Observable<IWmCapability> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWmCapability[]>(url)
      .pipe(
        map(wmcs => wmcs[0]), // returns a {0|1} element array
        tap(wmc => {
          const outcome = wmc ? `fetched` : `did not find`;
          this.log(`${outcome} WmCapability _id=${qstr}`);
        }),
        catchError(this.handleError<IWmCapability>(`getWmCapability ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WmCapabilitys，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWmCapability[]>}       [查询结果，WmCapability数组]
   */
  searchWmCapabilitys(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWmCapability[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWmCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found WmCapabilitys matching "${qstr}"`)),
        catchError(this.handleError<IWmCapability[]>('searchWmCapabilitys', []))
      );
  }

  /**
   * [通过过滤条件查询WmCapabilitys，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWmCapability[]>}       [查询结果，WmCapability数组]
   */
  searchWmCapabilitysEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWmCapability[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWmCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found WmCapabilitys matching "${query}"`)),
        catchError(this.handleError<IWmCapability[]>('searchWmCapabilitys', []))
      );
  }

  /**
   * 获取所有的作业能力关键信息
   * @return {Observable<IWmCapabilityElite[]>} [作业能力关键信息Array]
   */
  getWmCapsElite(): Observable<IWmCapabilityElite[]> {
    return this.getWmCapabilitys(this.eliteFields);
  }

  /**
   * [getWmCapsProfile 获取所有的作业能力 Profile 信息]
   * @return {Observable<IWmCapability[]>} [description]
   */
  getWmCapsProfile(): Observable<IWmCapability[]> {
    return this.getWmCapabilitys(this.profileFields);
  }

  /**
   * [getWmCapsBy 通过简单的查询条件，获取相应的作业能力信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IWmCapability[]>}   [description]
   */
  getWmCapsBy(query: any = {}): Observable<IWmCapability[]> {
    return this.searchWmCapabilitys(query);
  }

  getWmCapBy(query: any = {}): Observable<IWmCapability> {
    return this.getWmCapabilityNo404(query);
  }

  /**
   * [getWmCapsEliteBy 通过简单的查询条件，获取相应的作业能力关键信息]
   * @param  {any                           = {}}        query [description]
   * @return {Observable<IWmCapabilityElite[]>}   [description]
   */
  getWmCapsEliteBy(query: any = {}): Observable<IWmCapabilityElite[]> {
    return this.searchWmCapabilitys(query, this.eliteFields);
  }

  /**
   * [getWmCapsProfileBy 通过简单的查询条件，获取相应的作业能力 Profile 信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IWmCapability[]>}   [description]
   */
  getWmCapsProfileBy(query: any = {}): Observable<IWmCapability[]> {
    return this.searchWmCapabilitys(query, this.profileFields);
  }

  /**
   * [getNewWmCapability 从数据库获取一个全新的 WmCapability,自带 _id]
   * @return {Observable<IWmCapability>} [description]
   */
  getNewWmCapability(): Observable<IWmCapability> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWmCapability>(url)
      .pipe(
        tap(_ => this.log('fetch new WmCapability ')),
        catchError(this.handleError<IWmCapability>('getNewWmCapability'))
      );
  }

  /**
   * 根据 _id 获取单个作业能力信息
   * @param  {string}                    id [作业能力_id]
   * @return {Observable<IWmCapability>}    [单个作业能力信息]
   */
  getWmCapability(id: string): Observable<IWmCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWmCapability>(url)
      .pipe(
        tap(_ => this.log('fetch WmCapability id=${id}')),
        catchError(this.handleError<IWmCapability>('getWmCapability'))
      );
  }

  /**
   * 从单个的 WorkMaster 中继承相关的属性
   * @param  {IWmCapability} wc [原始的 作业能力信息]
   * @param  {IWorkMaster}   wm [WorkMaster作业定义]
   * @return {IWmCapability}    [新的作业能力信息]
   */
  getWmCapByWorkMaster(wc: IWmCapability, wm: IWorkMaster): IWmCapability {
    let model = new WmCapability(wc);
    model.DeriveFromSingleWorkMaster(wm);
    return model;
  }

  /**
   * [判断作业能力名称是否存在，根据 field 和 value]
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
    return this.http.get<IWmCapability[]>(url)
      .pipe(
        map(wmcs => wmcs[0]), // returns a {0|1} element array
        tap(wmc => {
          const outcome = wmc ? `fetched` : `did not find`;
          this.log(`${outcome} WmCapability _id=${qstr}`);
        }),
        catchError(this.handleError<IWmCapability>(`getWmCapability ${qstr}`))
      );
  }

  /**
   * [判断作业能力名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的作业能力信息
   * @param  {IWmCapability}             wmc [待创建的作业能力信息]
   * @return {Observable<IWmCapability>}     [新创建的作业能力信息]
   */
  createWmCapability(wmc: IWmCapability): Observable<IWmCapability> {
    return this.http
      .post<IWmCapability>(this.baseUrl, wmc, httpOptions)
      .pipe(
        tap((newProseg: IWmCapability) => this.log(`added ps w/ id=${newProseg._id}`)),
        catchError(this.handleError<IWmCapability>('createWmCapability'))
      );
  }

  /**
   * 在数据库中，更新某个作业能力信息
   * @param  {IWmCapability}             wmc [待更新的作业能力信息]
   * @return {Observable<IWmCapability>}     [已更新的作业能力信息]
   */
  updateWmCapability(wmc: IWmCapability): Observable<IWmCapability> {
    const url = `${this.baseUrl}/${wmc._id}`;
    return this.http
      .put(url, wmc, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WmCapability id=${wmc._id}`)),
        catchError(this.handleError<any>('updateWmCapability'))
      );
  }

  patchWmCapability(id: string, patch:any): Observable<IWmCapability> {
    const url = `${this.baseUrl}/${id}`;
   return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WmCapability id=${id}`)),
        catchError(this.handleError<any>('patchWmCapability'))
      );
  }


  /**
   * 在数据库中，删除某个作业能力信息
   * @param  {IWmCapability}    wmc [待删除的作业能力信息]
   * @return {Observable<void>}     [description]
   */
  deleteWmCapability(wmc: IWmCapability): Observable<IWmCapability> {
    const id = typeof wmc === 'string' ? wmc : wmc._id;
    const url = `${this.baseUrl}/${wmc._id}`;
    return this.http.delete<IWmCapability>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WmCapability id=${id}`)),
        catchError(this.handleError<IWmCapability>('deleteWmCapability'))
      );
  }

}
