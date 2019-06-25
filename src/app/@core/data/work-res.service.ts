import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TreeItem, TreeviewItem } from 'ngx-treeview';


import * as _ from 'lodash';

import { IWorkResponseElite, IWorkResponse, IWork } from '../model/work-res';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkResponseService {
  private baseUrl = '/api/workResponses';

  private eliteFields = '_id oid state';
  private profileFields = '-jobResponse';

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
    this.messageService.add(`WorkResponseService: ${message}`);
  }

  /**
   * [获取所有的作业执行信息]
   * @return {Observable<IWorkResponse[]>} [作业执行信息Array]
   */
  getWorkResponses(field: string = '', sort: string = '-_id'): Observable<IWorkResponse[]> {
    return this.http.get<IWorkResponse[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched WorkResponses')),
        catchError(this.handleError('getWorkResponses', []))
      );
  }

  /** GET WorkResponse by q. Return `undefined` when id not found */
  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWorkResponseNo404<Data>(query: any): Observable<IWorkResponse> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkResponse[]>(url)
      .pipe(
        map(wrss => wrss[0]), // returns a {0|1} element array
        tap(wrs => {
          const outcome = wrs ? `fetched` : `did not find`;
          this.log(`${outcome} WorkResponse _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkResponse>(`getWorkResponse ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WorkResponses，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkResponse[]>}       [查询结果，WorkResponse数组]
   */
  searchWorkResponses(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkResponse[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkResponse[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkResponses matching "${qstr}"`)),
        catchError(this.handleError<IWorkResponse[]>('searchWorkResponses', []))
      );
  }

  /**
   * [通过过滤条件查询WorkResponses，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkResponse[]>}       [查询结果，WorkResponse数组]
   */
  searchWorkResponsesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkResponse[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkResponse[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkResponses matching "${query}"`)),
        catchError(this.handleError<IWorkResponse[]>('searchWorkResponses', []))
      );
  }

  /**
   * [统计作业的状态信息]
   * @param  {any}               query [description]
   * @return {Observable<any[]>}       [description]
   */
  aggr(group: string, hs: any, startTime: Date, endTime: Date) : Observable<any[]> {
    let query = {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    };
    const url = `${this.baseUrl}/aggr/${group}/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate work state matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggr', []))
      );
  }

  /**
   * [获取所有的作业执行关键信息]
   * @return {Observable<IWorkResponseElite[]>} [作业执行关键信息Array]
   */
  getWorkResponsesElite(): Observable<IWorkResponseElite[]> {
    return this.getWorkResponses(this.eliteFields);
  }

  /**
   * [getWorkResponsesProfile 获取所有的作业执行 Profile 信息]
   * @return {Observable<IWorkResponse[]>} [description]
   */
  getWorkResponsesProfile(): Observable<IWorkResponse[]> {
    return this.getWorkResponses(this.profileFields);
  }

  /**
   * [getNewWorkResponse 从数据库获取一个全新的 WorkResponse,自带 _id]
   * @return {Observable<IWorkResponse>} [description]
   */
  getNewWorkResponse(): Observable<IWorkResponse> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkResponse>(url)
      .pipe(
        tap(_ => this.log('fetch new WorkResponse ')),
        catchError(this.handleError<IWorkResponse>('getNewWorkResponse'))
      );
  }

  /**
   * [根据 _id 获取单个作业执行信息]
   * @param  {string}                    id [作业执行的_id]
   * @return {Observable<IWorkResponse>}    [单个作业执行信息]
   */
  getWorkResponse(id: string): Observable<IWorkResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkResponse>(url)
      .pipe(
        tap(_ => this.log('fetch WorkResponse id=${id}')),
        catchError(this.handleError<IWorkResponse>('getWorkResponse'))
      );
  }

  /**
   * [根据 _id 获取单个作业的详细信息，包括作业请求和作业执行]
   * @param  {string}            id [description]
   * @return {Observable<IWork>}    [description]
   */
  getWork(query: any): Observable<IWork> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/work/?${qstr}`;
    console.log(url);
    return this.http.get<IWork>(url)
      .pipe(
        tap(_ => this.log('fetch Work id=${id}')),
        catchError(this.handleError<IWork>('getWork'))
      );
  }

  /**
   * [getWorkResponsesByQuery 通过简单的查询条件，获取相应的作业执行信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IWorkResponse[]>}   [description]
   */
  getWorkResponsesBy(query: any = {}): Observable<IWorkResponse[]> {
    return this.searchWorkResponses(query);
  }

  /**
   * [getWorkResponsesEliteBy 通过简单的查询条件，获取相应的作业执行关键信息]
   * @param  {any                           = {}}        query [description]
   * @return {Observable<IWorkResponseElite[]>}   [description]
   */
  getWorkResponsesEliteBy(query: any = {}): Observable<IWorkResponseElite[]> {
    return this.searchWorkResponses(query, this.eliteFields);
  }

  /**
   * [getWorkResponsesProfileBy 通过简单的查询条件，获取相应的作业执行 Profile 信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IWorkResponse[]>}   [description]
   */
  getWorkResponsesProfileBy(query: any = {}): Observable<IWorkResponse[]> {
    return this.searchWorkResponses(query, this.profileFields);
  }

  getWorkResponseBy(query: any = {}): Observable<IWorkResponse> {
    return this.getWorkResponseNo404(query);
  }

  /**
   * [判断workresponse是否存在，根据 field 和 value]
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
    return this.http.get<IWorkResponse[]>(url)
      .pipe(
        map(wrss => wrss[0]), // returns a {0|1} element array
        tap(wrs => {
          const outcome = wrs ? `fetched` : `did not find`;
          this.log(`${outcome} WorkResponse _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkResponse>(`getWorkResponse ${qstr}`))
      );
  }

  /**
   * [判断作业响应名称是否存在，根据 field 和 value]
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
   * [在数据库中，创建新的作业执行信息]
   * @param  {IWorkResponse}             wr [待创建的作业执行信息]
   * @return {Observable<IWorkResponse>}    [新创建的作业执行信息]
   */
  createWorkResponse(wr: IWorkResponse): Observable<IWorkResponse> {
    //这里不能删除JobResponse 的 _id 属性，因为这里只是一个关联
    return this.http
      .post<IWorkResponse>(this.baseUrl, wr, httpOptions)
      .pipe(
        tap((newProseg: IWorkResponse) => this.log(`added WorkResponse w/ id=${newProseg._id}`)),
        catchError(this.handleError<IWorkResponse>('createWorkResponse'))
      );
  }

  /**
   * [在数据库中，更新某个作业执行信息]
   * @param  {IWorkResponse}             wr [待更新的作业执行信息]
   * @return {Observable<IWorkResponse>}    [已更新的作业执行信息]
   */
  updateWorkResponse(wr: IWorkResponse): Observable<IWorkResponse> {
    const url = `${this.baseUrl}/${wr._id}`;
    return this.http
      .put(url, wr, httpOptions)
      .pipe(
        tap(_ => this.log(`updated WorkResponse id=${wr._id}`)),
        catchError(this.handleError<any>('updateWorkResponse'))
      );
  }

/**
 * [新增patch方法，用于更新作业执行信息]
 * @param  {string}                    id    [description]
 * @param  {any}                       patch [description]
 * @return {Observable<IWorkResponse>}       [description]
 */
  patchWorkResponse(id:string, patch:any): Observable<IWorkResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch WorkResponse id=${id}`)),
        catchError(this.handleError<any>('patchWorkResponse'))
      );
  }

  /**
   * [在数据库中，删除某个作业执行信息]
   * @param  {IWorkResponse}    wr [待删除的作业执行信息]
   * @return {Observable<void>}    [description]
   */
  deleteWorkResponse(wr: IWorkResponse): Observable<IWorkResponse> {
    const id = typeof wr === 'string' ? wr : wr._id;
    const url = `${this.baseUrl}/${wr._id}`;
    return this.http.delete<IWorkResponse>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete WorkResponse id=${id}`)),
        catchError(this.handleError<IWorkResponse>('deleteWorkResponse'))
      );
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }

  createWresTree(wres: IWorkResponse[], collapsed: boolean = true, withJoborder: boolean = true): TreeviewItem[] {
    let wrestree: TreeviewItem[] = wres && wres.length > 0 ? wres.map(wres => {
      return new TreeviewItem({
        text: wres.oid,
        value: wres,
        checked: false,
        collapsed: collapsed,
        children: withJoborder ? _.sortBy(wres.jobResponse, 'oid').map(jres => {
          return {
            text: `${jres.oid}`,
            value: jres,
            checked: false,
          };
        }) : undefined,
      });
    }) : [];

    return wrestree;
  }
}
