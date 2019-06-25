import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IWorkAlert, WorkAlert, IWorkAlertProfile, IWorkAlertElite } from '../model/work-alert';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class WorkAlertService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/workAlerts';
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
    this.messageService.add(`WorkAlertService: ${message}`);
  }


  /**
   * 获取所有的报警信息
   * @return {Observable<IWorkAlert[]>} [报警信息Array]
   */
  getWorkAlerts(field: string = '', sort: string = '-_id'): Observable<IWorkAlert[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkAlert[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched getWorkAlerts')),
        catchError(this.handleError<IWorkAlert[]>('getWorkAlerts', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getWorkAlertNo404<Data>(query: any): Observable<IWorkAlert> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IWorkAlert[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} WorkAlert _id=${qstr}`);
        }),
        catchError(this.handleError<IWorkAlert>(`getWorkAlert ${qstr}`))
      );
  }

    /**
   * [通过过滤条件查询WorkAlert，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkAlert[]>}       [查询结果，WorkAlert数组]
   */
  searchWorkAlert(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkAlert[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkAlert[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkAlert matching "${qstr}"`)),
        catchError(this.handleError<IWorkAlert[]>('searchWorkAlert', []))
      );
  }

  /**
   * [通过过滤条件查询WorkAlert，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkAlert[]>}       [查询结果，hs数组]
   */
  searchWorkAlertEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkAlert[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkAlert[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkAlert matching "${query}"`)),
        catchError(this.handleError<IWorkAlert[]>('searchWorkAlert', []))
      );
  }

  /**
   * 获取所有的报警信息关键信息
   * @return {Observable<IWorkAlertProfile[]>} [报警信息关键信息 + Context's Array]
   */
  getWorkAlertsElite(): Observable<IWorkAlertElite[]> {
    return this.getWorkAlerts(this.eliteFields);
  }

  /**
   * 获取所有的报警信息关键信息 + Context
   * @return {Observable<IWorkAlertProfile[]>} [报警信息关键信息 + Context's Array]
   */
  getWorkAlertsProfile(): Observable<IWorkAlertProfile[]> {
    return this.getWorkAlerts(this.profileFields);
  }

  /**
   * [getNewWorkAlert 从数据库获取一个全新的 WorkAlert,自带 _id]
   * @return {Observable<IWorkAlert>} [description]
   */
  getNewWorkAlert(): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IWorkAlert>(url)
      .pipe(
        tap(_ => this.log('fetched getNewWorkAlert')),
        catchError(this.handleError<IWorkAlert>('getNewWorkAlert'))
      )
  }

  /**
   * 根据 _id 获取单个报警信息
   * @param  {string}                 id [报警信息的 _id]
   * @return {Observable<IWorkAlert>}    [单个报警信息]
   */
  getWorkAlert(id: string): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IWorkAlert>(url)
      .pipe(
        tap(_ => this.log('fetched getWorkAlert')),
        catchError(this.handleError<IWorkAlert>('getWorkAlert'))
      )
  }

  /**
   * [getEndefsBy 获取所有的报警信息，查询条件由 Client 提供]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IWorkAlert[]>}   [description]
   */
  getWorkAlertsBy(query: any = {}): Observable<IWorkAlert[]> {
    return this.searchWorkAlert(query);
  }



  /**
   * [getEndefsEliteBy 获取所有的报警信息关键信息，查询条件由 Client 提供]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IWorkAlertElite[]>}   [报警关键信息 Array]
   */
  getWorkAlertsEliteBy(query: any = {}): Observable<IWorkAlertElite[]> {
    return this.searchWorkAlert(query,this.eliteFields);
  }

  /**
   * [getEndefsProfileBy 获取所有的报警关键信息 + Context, 查询条件由 Client 提供]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IEnergyProfile[]>}   [description]
   */
  getWorkAlertsProfileBy(query: any = {}): Observable<IWorkAlertProfile[]> {
    return this.searchWorkAlert(query,this.profileFields);
  }

  getWorkAlertBy(query: any = {}): Observable<IWorkAlert> {
    return this.getWorkAlertNo404(query);
  }

  /**
   * [判断报警信息是否存在，根据 field 和 value]
   * @param  {string}              field [description]
   * @param  {any}                 value [description]
   * @return {Observable<boolean>}       [description]
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
    return this.http.get<WorkAlert[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} WorkAlert _id=${qstr}`);
        }),
        catchError(this.handleError<WorkAlert>(`getWorkAlert ${qstr}`))
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
   * 在数据库中，创建新的报警信息
   * @param  {IWorkAlert}             a [待创建的报警信息]
   * @return {Observable<IWorkAlert>}   [新创建的报警信息]
   */
  createWorkAlert(a: IWorkAlert): Observable<IWorkAlert> {
    return this.http
      .post<IWorkAlert>(this.baseUrl, a)
      .pipe(
        tap(_ => this.log('fetched createWorkAlert')),
        catchError(this.handleError<IWorkAlert>('createWorkAlert'))
      )
  }

  /**
   * [在数据库中，更新某个报警信息]
   * @param  {IAlertDefinition}             en [description]
   * @return {Observable<IEnergy>}   [description]
   */
  updateWorkAlert(wa: IWorkAlert): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/${wa._id}`;
    return this.http
      .put<IWorkAlert>(url, wa)
      .pipe(
        tap(_ => this.log('fetched updateWorkAlert')),
        catchError(this.handleError<IWorkAlert>('updateWorkAlert'))
      )
  }

  /**
   * [在数据库中，处理某个报警信息]
   * @param  {IAlertDefinition}             en [description]
   * @return {Observable<IEnergy>}   [description]
   */
  releaseWorkAlert(id: string): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/release/${id}`;
    return this.http
      .put<IWorkAlert>(url, {})
      .pipe(
        tap(_ => this.log('fetched releaseWorkAlert')),
        catchError(this.handleError<IWorkAlert>('releaseWorkAlert'))
      )
  }

  patchWorkAlert(id: string, patch: any): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IWorkAlert>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchWorkAlert')),
        catchError(this.handleError<IWorkAlert>('patchWorkAlert'))
      )
  }

  /**
   * 在数据库中，删除某个报警信息
   * @param  {IWorkAlert}       a [待删除的报警信息]
   * @return {Observable<void>}   [description]
   */
  deleteWorkAlert(a: IWorkAlert): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/${a._id}`;
    return this.http.delete<IWorkAlert>(url)
      .pipe(
        tap(_ => this.log(`delete hs id=${a._id}`)),
        catchError(this.handleError<IWorkAlert> ('deleteEnDef'))
      );
  }

/**
 * [获取某个时间段的报警统计信息]
 * @param  {string}          start      [description]
 * @param  {string}          end        [description]
 * @param  {string[]}        groups     [description]
 * @param  {[type]}          query={} [description]
 * @param  {string       =          'nil'}       unwind [description]
 * @return {Observable<any>}            [description]
 */
  // aggrAlertTimely(start: string, end: string, groups: string[], query={}, unwind: string = 'nil'): Observable<any> {
  //   let groupStr = _.join(groups, ',');
  //   const url = `${this.baseUrl}/aggr/Alert/time/${start}/${end}/group/${groupStr}/unwind/${unwind}`;
  //   return this.http
  //     .post(url, query)
  //     .pipe(
  //       tap(_ => this.log('fetched getWorkAlerts')),
  //       catchError(this.handleError('getWorkAlerts'))
  //     )
  // }
  aggrAlertTimely(hs: any, startTime: string, endTime: string, groups: string[], others: any = {}, unwind: string = 'nil'): Observable<any> {
    let query = _.merge(others, {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    });
    let groupStr = _.join(groups, ',');
    const url = `${this.baseUrl}/aggr/Alert/${groupStr}/unwind/${unwind}/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log('fetched getWorkAlerts')),
        catchError(this.handleError<any[]>('getWorkAlerts',[]))
      )
  }

  formatOid(item: IWorkAlert): string {
    return (item.workAlertDef ? item.workAlertDef.oid : '') +
      (item.person ? item.person.oid : '') +
      (item.equipment ? item.equipment.oid : '') +
      moment().format('YYMMDDHHmmss');
  }

}
