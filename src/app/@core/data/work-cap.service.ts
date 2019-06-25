import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IWorkCapabilityElite, IWorkCapability } from '../model/work-cap';
import {IExistService} from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkCapabilityService implements IExistService {
  private baseUrl = '/api/workCapabilitys';
  private eliteFields = '_id oid';
  private profileFields = '-pCap -eCap -mCap -wmCap';

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
    this.messageService.add(`WorkCapabilityService: ${message}`);
  }

  /**
   * 获取所有的作业资源能力
   * @return {Observable<IWorkCapability[]>} [作业资源能力Array]
   */
  getWorkCapabilitys(field: string = '', sort: string = '-_id'): Observable<IWorkCapability[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkCapability[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched WorkCapabilitys')),
        catchError(this.handleError('getWorkCapabilitys', []))
      );
  }

  /** GET WorkCapability by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWorkCapabilityNo404<Data>(query: any): Observable<IWorkCapability> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkCapability[]>(url)
      .pipe(
        map(wcs => wcs[0]), // returns a {0|1} element array
        tap(wc => {
          const outcome = wc ? `fetched` : `did not find`;
          this.log(`${outcome} WorkCapability _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkCapability>(`getWorkCapability ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WorkCapabilitys，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkCapability[]>}       [查询结果，WorkCapability数组]
   */
  searchWorkCapabilitys(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkCapability[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkCapabilitys matching "${qstr}"`)),
        catchError(this.handleError<IWorkCapability[]>('searchWorkCapabilitys', []))
      );
  }

  /**
   * [通过过滤条件查询WorkCapabilitys，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkCapability[]>}       [查询结果，WorkCapability数组]
   */
  searchWorkCapabilitysEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkCapability[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkCapability[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkCapabilitys matching "${query}"`)),
        catchError(this.handleError<IWorkCapability[]>('searchWorkCapabilitys', []))
      );
  }

  /**
   * 获取所有的作业资源能力关键信息
   * @return {Observable<IWorkCapabilityElite[]>} [作业资源能力关键信息]
   */
  getWorkCapsElite(): Observable<IWorkCapabilityElite[]> {
    return this.getWorkCapabilitys(this.eliteFields);
  }

  /**
   * [getWorkCapsProfile 获取所有的作业资源能力 Profile 信息]
   * @return {Observable<IWorkCapability[]>} [description]
   */
  getWorkCapsProfile(): Observable<IWorkCapability[]> {
    return this.getWorkCapabilitys(this.profileFields);
  }

  /**
   * [getNewWorkCapability 从数据库获取一个全新的 WorkCapability,自带 _id]
   * @return {Observable<IWorkCapability>} [description]
   */
  getNewWorkCapability(): Observable<IWorkCapability> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkCapability>(url)
      .pipe(
        tap(_ => this.log('fetch new WorkCapability ')),
        catchError(this.handleError<IWorkCapability>('getNewProseg'))
      );
  }

  /**
   * 根据 _id 获取单个作业资源能力信息
   * @param  {string}                      id [作业资源能力的_id]
   * @return {Observable<IWorkCapability>}    [单个作业资源能力信息]
   */
  getWorkCapability(id: string): Observable<IWorkCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkCapability>(url)
      .pipe(
        tap(_ => this.log('fetch WorkCapability id=${id}')),
        catchError(this.handleError<IWorkCapability>('getProseg'))
      );
  }

  /**
   * [getWorkCapsBy 通过简单的查询条件，获取相应的作业资源能力信息]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IWorkCapability[]>}   [description]
   */
  getWorkCapsBy(query: any = {}): Observable<IWorkCapability[]> {
    return this.searchWorkCapabilitys(query);
  }

  /**
   * [getWorkCapsEliteBy 通过简单的查询条件，获取相应的作业资源能力关键信息]
   * @param  {any                             = {}}        query [description]
   * @return {Observable<IWorkCapabilityElite[]>}   [description]
   */
  getWorkCapsEliteBy(query: any = {}): Observable<IWorkCapabilityElite[]> {
    return this.searchWorkCapabilitys(query, this.eliteFields);
  }

  /**
   * [getWorkCapsProfileBy 通过简单的查询条件，获取相应的作业资源能力 Profile 信息]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IWorkCapability[]>}   [description]
   */
  getWorkCapsProfileBy(query: any = {}): Observable<IWorkCapability[]> {
    return this.searchWorkCapabilitys(query, this.profileFields);
  }

  getWorkCapBy(query: any = {}): Observable<IWorkCapability> {
    return this.getWorkCapabilityNo404(query);
  }

  /**
   * [判断作业资源能力名称是否存在，根据 field 和 value]
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
    return this.http.get<IWorkCapability[]>(url)
      .pipe(
        map(wcs => wcs[0]), // returns a {0|1} element array
        tap(wc => {
          const outcome = wc ? `fetched` : `did not find`;
          this.log(`${outcome} WorkCapability _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkCapability>(`getWorkCapability ${qstr}`))
      );
  }

  /**
   * [判断作业资源能力名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的作业资源能力信息
   * @param  {IWorkCapability}             wc [待创建的作业资源能力信息]
   * @return {Observable<IWorkCapability>}    [新创建的作业资源能力信息]
   */
  createWorkCapability(wc: IWorkCapability): Observable<IWorkCapability> {
    return this.http
      .post<IWorkCapability>(this.baseUrl, wc, httpOptions)
      .pipe(
        tap((newWorkCapability: IWorkCapability) => this.log(`added WorkCapability w/ id=${newWorkCapability._id}`)),
        catchError(this.handleError<IWorkCapability>('createWorkCapability'))
      );
  }

  /**
   * 在数据库中，更新某个作业资源能力信息
   * @param  {IWorkCapability}             wc [待更新的作业资源能力信息]
   * @return {Observable<IWorkCapability>}    [已更新的作业资源能力信息]
   */
  updateWorkCapability(wc: IWorkCapability): Observable<IWorkCapability> {
    const url = `${this.baseUrl}/${wc._id}`;
    return this.http
      .put(url, wc, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WorkCapability id=${wc._id}`)),
        catchError(this.handleError<any>('updateWorkCapability'))
      );
  }

  patchWorkCapability(id:string, patch:any): Observable<IWorkCapability> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkCapability id=${id}`)),
        catchError(this.handleError<any>('patchWorkCapability'))
      );
  }

  /**
   * 在数据库中，删除某个作业资源能力信息
   * @param  {IWorkCapability}  wc [待删除的作业资源能力信息]
   * @return {Observable<void>}    [description]
   */
  deleteWorkCapability(wc: IWorkCapability): Observable<IWorkCapability> {
    const id = typeof wc === 'string' ? wc : wc._id;
    const url = `${this.baseUrl}/${wc._id}`;
    return this.http.delete<IWorkCapability>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WorkCapability id=${id}`)),
        catchError(this.handleError<IWorkCapability>('deleteWorkCapability'))
      );
  }


  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
