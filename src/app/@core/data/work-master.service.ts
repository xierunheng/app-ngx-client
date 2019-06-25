import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IOpseg } from '../model/op-def';
import { IWorkMasterElite, IWorkMaster, WorkMaster } from '../model/work-master';
import * as _ from 'lodash';
import {IExistService} from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkMasterService implements IExistService {
  private baseUrl = '/api/workMasters';
  private eliteFields = '_id oid ver proseg opDef';
  private profileFields = '-pSpec -eSpec -mSpec -para -wfSpec';

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
    this.messageService.add(`WorkMasterService: ${message}`);
  }

  /**
   * 获取所有的作业定义信息
   * @return {Observable<IWorkMaster[]>} [作业定义信息Array]
   */
  getWorkMasters(field: string = '', sort: string = '-_id'): Observable<IWorkMaster[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkMaster[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched WorkMasters')),
        catchError(this.handleError('getWorkMasters', []))
      );
  }

  /** GET WorkMaster by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取作业定义信息
   * 当查询不到时，返回 undefined
   */
  getWorkMasterNo404<Data>(query: any): Observable<IWorkMaster> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkMaster[]>(url)
      .pipe(
        map(wms => wms[0]), // returns a {0|1} element array
        tap(wm => {
          const outcome = wm ? `fetched` : `did not find`;
          this.log(`${outcome} WorkMaster _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkMaster>(`getWorkMaster ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WorkMasters，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IHierarchyScope[]>}       [查询结果，WorkMaster数组]
   */
  searchWorkMasters(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkMaster[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkMaster[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkMasters matching "${qstr}"`)),
        catchError(this.handleError<IWorkMaster[]>('searchWorkMasters', []))
      );
  }

  /**
   * [通过过滤条件查询WorkMasters，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IHierarchyScope[]>}       [查询结果，WorkMaster数组]
   */
  searchWorkMastersEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkMaster[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkMaster[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkMasters matching "${query}"`)),
        catchError(this.handleError<IWorkMaster[]>('searchWorkMasters', []))
      );
  }


  /**
   * [获取所有的作业定义关键信息]
   * @return {Observable<IWorkMasterElite[]>} [作业定义关键信息Array]
   */
  getWorkMastersElite(): Observable<IWorkMasterElite[]> {
    return this.getWorkMasters(this.eliteFields);
  }

  /**
   * [getWorkMastersProfile 获取所有的作业定义 Profile 信息]
   * @return {Observable<IWorkMaster[]>} [description]
   */
  getWorkMastersProfile(): Observable<IWorkMaster[]> {
    return this.getWorkMasters(this.profileFields);
  }

/**
 * [getNewWorkMaster 从数据库获取一个全新的 WorkMaster,自带 _id]
 * @return {Observable<IWorkMaster>} [description]
 */
  getNewWorkMaster(): Observable<IWorkMaster> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkMaster>(url)
      .pipe(
        tap(_ => this.log('fetch new WorkMaster ')),
        catchError(this.handleError<IWorkMaster>('getNewWorkMaster'))
      );
  }

  /**
   * 根据 _id 获取单个作业定义信息
   * @param  {string}                  id [作业定义的_id]
   * @return {Observable<IWorkMaster>}    [单个作业定义信息]
   */
  getWorkMaster(id: string): Observable<IWorkMaster> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkMaster>(url)
      .pipe(
        tap(_ => this.log('fetch WorkMaster id=${id}')),
        catchError(this.handleError<IWorkMaster>('getWorkMaster'))
      );
  }

  /**
   * [getWorkMastersBy 通过简单的查询条件，获取相应的作业定义信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IWorkMaster[]>}   [description]
   */
  getWorkMastersBy(query: any = {}): Observable<IWorkMaster[]> {
    return this.searchWorkMasters(query);
  }

  /**
   * [getWorkMastersEliteBy 通过简单的查询条件，获取相应的作业定义关键信息]
   * @param  {any                         = {}}        query [description]
   * @return {Observable<IWorkMasterElite[]>}   [description]
   */
  getWorkMastersEliteBy(query: any = {}): Observable<IWorkMasterElite[]> {
    return this.searchWorkMasters(query, this.eliteFields);
  }

  /**
   * [getWorkMastersProfileBy 通过简单的查询条件，获取相应的作业定义 Profile 信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IWorkMaster[]>}   [description]
   */
  getWorkMastersProfileBy(query: any = {}): Observable<IWorkMaster[]> {
    return this.searchWorkMasters(query, this.profileFields);
  }

  geWorkMaster(id: string): Observable<IWorkMaster> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkMaster>(url)
      .pipe(
        tap(_ => this.log('fetch WorkMaster id=${id}')),
        catchError(this.handleError<IWorkMaster>('geWorkMaster'))
      );
  }

  getWorkMasterBy(query: any = {}): Observable<IWorkMaster> {
    return this.getWorkMasterNo404(query);
  }

   /**
   * [判断WorkMaster是否存在，根据 field 和 value]
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
    return this.http.get<IWorkMaster[]>(url)
      .pipe(
        map(wms => wms[0]), // returns a {0|1} element array
        tap(wm => {
          const outcome = wm ? `fetched` : `did not find`;
          this.log(`${outcome} WorkMaster _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkMaster>(`getWorkMaster ${qstr}`))
      );
  }

  /**
   * [判断工单是否存在，根据 field 和 value]
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
   * [在数据库中，创建新的作业定义]
   * @param  {IWorkMaster}             wm [待创建的作业定义]
   * @return {Observable<IWorkMaster>}    [新创建的作业定义]
   */
  createWorkMaster(wm: IWorkMaster): Observable<IWorkMaster> {
    return this.http
      .post<IWorkMaster>(this.baseUrl, wm, httpOptions)
      .pipe(
        tap((newWorkMaster: IWorkMaster) => this.log(`added WorkMaster w/ id=${newWorkMaster._id}`)),
        catchError(this.handleError<IWorkMaster>('createWorkMaster'))
      );
  }

  /**
   * [在数据库中，更新某个作业定义]
   * @param  {IWorkMaster}             wm [待更新的作业定义]
   * @return {Observable<IWorkMaster>}    [已更新的作业定义]
   */
  updateWorkMaster(wm: IWorkMaster): Observable<IWorkMaster> {
    const url = `${this.baseUrl}/${wm._id}`;
    return this.http
      .put(url, wm, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WorkMaster id=${wm._id}`)),
        catchError(this.handleError<any>('updateWorkMaster'))
      );
  }

  patchWorkMaster(id:string, patch:any): Observable<IWorkMaster> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkMaster id=${id}`)),
        catchError(this.handleError<any>('patchWorkMaster'))
      );
  }

  /**
   * [在数据库中，删除某个作业定义]
   * @param  {IWorkMaster}      wm [待删除的作业定义]
   * @return {Observable<void>}    [description]
   */
  deleteWorkMaster(wm: IWorkMaster): Observable<IWorkMaster> {
    const id = typeof wm === 'string' ? wm : wm._id;
    const url = `${this.baseUrl}/${wm._id}`;
    return this.http.delete<IWorkMaster>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WorkMaster id=${id}`)),
        catchError(this.handleError<IWorkMaster>('deleteWorkMaster'))
      );
  }

}
