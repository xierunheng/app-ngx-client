import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IWorkAlertDef, WorkAlertDef,
  IWorkAlertDefProfile, IWorkAlertDefElite } from '../model/work-alert-def';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkAlertDefService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/workAlertDefinitions';
  private eliteFields = '_id oid';
  private profileFields = '-prop';

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
    this.messageService.add(`WorkAlertDefService: ${message}`);
  }

  /**
   * 获取所有的报警定义
   * @return {Observable<IWorkAlertDef[]>} [报警定义Array]
   */
  getWorkAlertDefs(field: string = '', sort: string = '-_id'): Observable<IWorkAlertDef[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkAlertDef[]>(url)
      .pipe(
        tap(_ => this.log('fetcht getWorkAlertDefs')),
        catchError(this.handleError<IWorkAlertDef[]>('getWorkAlertDefs', []))
      )
  }



  /**
   * 通过查询条件，获取WorkAlertDef
   * 当查询不到时，返回 undefined
   */
  getWorkAlertDefNo404<Data>(query: any): Observable<IWorkAlertDef> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkAlertDef[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} IWorkAlertDef _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkAlertDef>(`getIWorkAlertDef ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询WorkAlertDe，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkAlertDef[]>}       [查询结果，WorkAlertDef数组]
   */
  searchWorkAlertDef(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkAlertDef[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkAlertDef[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkAlertDef matching "${qstr}"`)),
        catchError(this.handleError<IWorkAlertDef[]>('searchWorkAlertDef', []))
      );
  }

  /**
   * [通过过滤条件查询WorkAlertDe，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkAlertDef[]>}       [查询结果，hs数组]
   */
  searchWorkAlertDefEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkAlertDef[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkAlertDef[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkAlertDe matching "${query}"`)),
        catchError(this.handleError<IWorkAlertDef[]>('searchWorkAlertDe', []))
      );
  }

  /**
   * 获取所有的作业报警定义关键信息
   * @return {Observable<IWorkAlertDefProfile[]>} [报警定义关键信息 + Context's Array]
   */
  getWorkAlertDefsElite(): Observable<IWorkAlertDefElite[]> {
    return this.getWorkAlertDefs(this.eliteFields);
  }

  /**
   * 获取所有的作业报警定义关键信息 + Context
   * @return {Observable<IWorkAlertDefProfile[]>} [报警定义关键信息 + Context's Array]
   */
  getWorkAlertDefsProfile(): Observable<IWorkAlertDefProfile[]> {
    return this.getWorkAlertDefs(this.profileFields);
  }

  /**
   * [getNewWorkAlertDef 从数据库获取一个全新的 WorkAlertDef,自带 _id]
   * @return {Observable<IWorkAlertDef>} [description]
   */
  getNewWorkAlertDef(): Observable<IWorkAlertDef> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkAlertDef>(url)
      .pipe(
        tap(_ => this.log('fetcht getNewWorkAlertDef')),
        catchError(this.handleError<IWorkAlertDef>('getNewWorkAlertDef'))
      )
  }

  /**
   * 根据 _id 获取单个作业报警定义
   * @param  {string}                 id [报警定义的 _id]
   * @return {Observable<IWorkAlertDef>}    [单个作业报警定义]
   */
  getWorkAlertDef(id: string): Observable<IWorkAlertDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkAlertDef>(url)
      .pipe(
        tap(_ => this.log('fetcht getWorkAlertDef')),
        catchError(this.handleError<IWorkAlertDef> ('getWorkAlertDef'))
      )
  }

  /**
   * [getEndefsBy 获取所有的报警定义，查询条件由 Client 提供]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IWorkAlertDef[]>}   [description]
   */
  getWorkAlertDefsBy(query: any = {}): Observable<IWorkAlertDef[]> {
    return this.searchWorkAlertDef(query);

  }

  /**
   * [getEndefsEliteBy 获取所有的报警定义关键信息，查询条件由 Client 提供]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IWorkAlertDefElite[]>}   [设备关键信息 Array]
   */
  getWorkAlertDefsEliteBy(query: any = {}): Observable<IWorkAlertDefElite[]> {
    return this.searchWorkAlertDef(query,this.eliteFields);
  }

  /**
   * [getEndefsProfileBy 获取所有的报警定义关键信息 + Context, 查询条件由 Client 提供]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IEnergyDefProfile[]>}   [description]
   */
  getWorkAlertDefsProfileBy(query: any = {}): Observable<IWorkAlertDefProfile[]> {
    return this.searchWorkAlertDef(query,this.profileFields);
  }

  getWorkAlertDefBy(query: any = {}): Observable<IWorkAlertDef> {
    return this.getWorkAlertDefNo404(query);
  }

  /**
   * [判断报警定义是否存在，根据 field 和 value]
   * @param  {string}              field [description]
   * @param  {any}                 value [description]
   * @return {Observable<any>}       [description]
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
    return this.http.get<WorkAlertDef[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} WorkAlertDef _id=${qstr}`);
        }),
        catchError(this.handleError<WorkAlertDef>(`getWorkAlertDef ${qstr}`))
      );
  }

  next(prex: string): Observable<string> {
    prex = prex ? prex : '000000';
    const url = `${this.baseUrl}/next/${prex}`;
    return this.http.get<string>(url)
      .pipe(
        tap(_ => this.log('fetcht next')),
        catchError(this.handleError<string>('next'))
      )
  }

  /**
   * 在数据库中，创建新的报警定义
   * @param  {IWorkAlertDef}             aldef [待创建的报警定义]
   * @return {Observable<IWorkAlertDef>}   [新创建的报警定义]
   */
  createWorkAlertDef(aldef: IWorkAlertDef): Observable<IWorkAlertDef> {
    return this.http
      .post<IWorkAlertDef>(this.baseUrl, aldef)
      .pipe(
        tap(_ => this.log('fetcht createWorkAlertDef')),
        catchError(this.handleError<IWorkAlertDef>('createWorkAlertDef'))
      )
  }

  /**
   * [在数据库中，更新某个报警定义]
   * @param  {IWorkAlertDef}             en [description]
   * @return {Observable<IEnergyDefinition>}   [description]
   */
  updateWorkAlertDef(aldef: IWorkAlertDef): Observable<IWorkAlertDef> {
    const url = `${this.baseUrl}/${aldef._id}`;
    return this.http
      .put<IWorkAlertDef>(url, aldef)
      .pipe(
        tap(_ => this.log('fetcht updateWorkAlertDef')),
        catchError(this.handleError<IWorkAlertDef>('updateWorkAlertDef'))
      )
  }

  patchWorkAlertDef(id: string, patch: any): Observable<IWorkAlertDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IWorkAlertDef>(url, patch)
      .pipe(
        tap(_ => this.log('fetcht patchWorkAlertDef')),
        catchError(this.handleError<IWorkAlertDef>('patchWorkAlertDef'))
      )
  }

  /**
   * 在数据库中，删除某个报警定义
   * @param  {IWorkAlertDef}       aldef [待删除的报警定义]
   * @return {Observable<void>}   [description]
   */
  deleteWorkAlertDef(aldef: IWorkAlertDef): Observable<IWorkAlertDef> {
    const url = `${this.baseUrl}/${aldef._id}`;
    return this.http.delete<IWorkAlertDef>(url)
      .pipe(
        tap(_ => this.log(`deleteWorkAlertDef id=${aldef._id}`)),
        catchError(this.handleError<IWorkAlertDef> ('deleteWorkAlertDef'))
      );
  }

}
