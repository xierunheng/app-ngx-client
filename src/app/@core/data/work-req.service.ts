import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import {IExistService} from './common.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IWorkRequestElite, IWorkRequest, WorkRequest } from '../model/work-req';
import { MessageService } from './message.service';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkRequestService implements IExistService {
  private baseUrl = '/api/workRequests';

  private eliteFields = '_id oid';
  private profileFields = '-jobOrder';

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
    this.messageService.add(`WorkRequestService: ${message}`);
  }


  /**
   * [获取所有的作业请求信息]
   * @return {Observable<IWorkRequest[]>} [作业请求信息Array]
   */
  getWorkRequests(field: string = '', sort: string = '-_id'): Observable<IWorkRequest[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        tap(_ => this.log('fetched WorkRequests')),
        catchError(this.handleError('getWorkRequests', []))
      );
  }

  /** GET WorkRequest by q. Return `undefined` when id not found */
  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWorkRequestNo404<Data>(query: any): Observable<IWorkRequest> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        map(wrs => wrs[0]), // returns a {0|1} element array
        tap(wr => {
          const outcome = wr ? `fetched` : `did not find`;
          this.log(`${outcome} WorkRequest _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkRequest>(`getWorkRequest ${qstr}`))
      );
  }


  /**
   * [通过过滤条件查询WorkRequests，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkRequest[]>}       [查询结果，WorkRequest数组]
   */
  searchWorkRequests(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkRequest[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkRequests matching "${qstr}"`)),
        catchError(this.handleError<IWorkRequest[]>('searchWorkRequests', []))
      );
  }

  /**
   * [通过过滤条件查询WorkRequests，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkRequest[]>}       [查询结果，WorkRequest数组]
   */
  searchWorkRequestsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkRequest[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkRequests matching "${query}"`)),
        catchError(this.handleError<IWorkRequest[]>('searchWorkRequests', []))
      );
  }

  /**
   * [获取所有的作业请求关键信息]
   * @return {Observable<IWorkRequestElite[]>} [作业请求关键信息Array]
   */
  getWorkRequestsElite(): Observable<IWorkRequestElite[]> {
    return this.getWorkRequests(this.eliteFields);
  }

  /**
   * [getWorkRequestsProfile 获取所有的作业请求 Profile 信息]
   * @return {Observable<IWorkRequest[]>} [description]
   */
  getWorkRequestsProfile(): Observable<IWorkRequest[]> {
    return this.getWorkRequests(this.profileFields);
  }

  /**
   * [getNewWorkRequest 从数据库获取一个全新的 WorkRequest,自带 _id]
   * @return {Observable<IWorkRequest>} [description]
   */
  getNewWorkRequest(): Observable<IWorkRequest> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkRequest>(url)
      .pipe(
        tap(_ => this.log('fetch new WorkRequest ')),
        catchError(this.handleError<IWorkRequest>('getNewWorkRequest'))
      );
  }

  /**
   * [根据 _id 获取单个作业请求信息]
   * @param  {string}                   id [作业请求的_id]
   * @return {Observable<IWorkRequest>}    [单个作业请求信息]
   */
  getWorkRequest(id: string): Observable<IWorkRequest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkRequest>(url)
      .pipe(
        tap(_ => this.log('fetch WorkRequest id=${id}')),
        catchError(this.handleError<IWorkRequest>('getWorkRequest'))
      );
  }

  /**
   * [getWorkRequestsBy 通过简单的查询条件，获取相应的作业请求信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IWorkRequest[]>}   [description]
   */
  getWorkRequestsBy(query: any = {}): Observable<IWorkRequest[]> {
    return this.searchWorkRequests(query);
  }

  /**
   * [getWorkRequestsEliteBy 通过简单的查询条件，获取相应的作业请求关键信息]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IWorkRequestElite[]>}   [description]
   */
  getWorkRequestsEliteBy(query: any = {}): Observable<IWorkRequestElite[]> {
    return this.searchWorkRequests(query, this.eliteFields);
  }

  /**
   * [getWorkRequestsProfileBy 通过简单的查询条件，获取相应的作业请求 Profile 信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IWorkRequest[]>}   [description]
   */
  getWorkRequestsProfileBy(query: any = {}): Observable<IWorkRequest[]> {
    return this.searchWorkRequests(query, this.eliteFields);
  }

  getWorkRequestBy(query: any = {}): Observable<IWorkRequest> {
    return this.getWorkRequestNo404(query);
  }

  /**
   * [判断作业请求名称是否存在，根据 field 和 value]
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
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        map(wrs => wrs[0]), // returns a {0|1} element array
        tap(wr => {
          const outcome = wr ? `fetched` : `did not find`;
          this.log(`${outcome} WorkRequest _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkRequest>(`getWorkRequest ${qstr}`))
      );
  }

  /**
   * [判断作业请求名称是否存在，根据 field 和 value]
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
   * [在数据库中，创建新的作业请求信息]
   * @param  {IWorkRequest}             wreq [待创建的作业请求信息]
   * @return {Observable<IWorkRequest>}      [新创建的作业请求信息]
   */
  createWorkRequest(wr: IWorkRequest): Observable<IWorkRequest> {
    //这里不能删除 jobOrder 的 _id 属性，否则后面的 _id 属性不能赋值
    //因为这里的jobOrder _id 属性，只是一个关联
    return this.http
      .post<IWorkRequest>(this.baseUrl, wr, httpOptions)
      .pipe(
        tap((newWorkRequest: IWorkRequest) => this.log(`added WorkRequest w/ id=${newWorkRequest._id}`)),
        catchError(this.handleError<IWorkRequest>('createWorkRequest'))
      );
  }

  /**
   * [在数据库中，更新某个作业请求信息]
   * @param  {IWorkRequest}             opr [待更新的作业请求信息]
   * @return {Observable<IWorkRequest>}     [已更新的作业请求信息]
   */
  updateWorkRequest(wr: IWorkRequest): Observable<IWorkRequest> {
    const url = `${this.baseUrl}/${wr._id}`;
    return this.http
      .put(url, wr, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WorkRequest id=${wr._id}`)),
        catchError(this.handleError<any>('updateWorkRequest'))
      );
  }

  patchWorkRequest(id:string, patch:any): Observable<IWorkRequest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkRequest id=${id}`)),
        catchError(this.handleError<any>('patchWorkRequest'))
      );
  }

  /**
   * [在数据库中，删除某个作业请求信息]
   * @param  {IWorkRequest}     opr [待删除的作业请求信息]
   * @return {Observable<void>}     [description]
   */
  deleteWorkRequest(wr: IWorkRequest): Observable<IWorkRequest> {
    const id = typeof wr === 'string' ? wr : wr._id;
    const url = `${this.baseUrl}/${wr._id}`;
    return this.http.delete<IWorkRequest>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WorkRequest id=${id}`)),
        catchError(this.handleError<IWorkRequest>('deleteWorkRequest'))
      );
  }

  createWreqTree(wreqs: IWorkRequest[], collapsed: boolean = true, withJoborder: boolean = true): TreeviewItem[] {
    let wreqtree: TreeviewItem[] = wreqs && wreqs.length > 0 ? wreqs.map(wreq => {
      return new TreeviewItem({
        text: wreq.oid,
        value: wreq,
        checked: false,
        collapsed: collapsed,
        children: withJoborder ? _.sortBy(wreq.jobOrder, 'oid').map(jr => {
          return {
            // text: `${jr.oid} ${jr.name}`,
            text: `${jr.oid}`,
            value: jr,
            checked: false,
          };
        }) : undefined,
      });
    }) : [];
    // let root: TreeviewItem = new TreeviewItem({
    //   text: UtilData.systemObj.workreq.name,
    //   value: UtilData.systemObj.workreq.name,
    //   checked: false,
    //   collapsed: false,
    //   children: wreqtree
    // });
    return wreqtree;
  }

}
