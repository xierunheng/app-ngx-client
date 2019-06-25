import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IKpi, IKpiElite, IKpiProfile } from '../model/kpi'
import { IKpiDef, KpiDefElite } from '../model/kpi-def'
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class KpiService implements IExistService {
  private baseUrl = '/api/kpis';

  private eliteFields = '_id oid name';
  private profileFields = '-prop -kpiDefinition -kpiValue -notes';

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
    this.messageService.add(`KpiService: ${message}`);
  }

  /**
   * 获取所有的KPI信息
   * @return {Observable<IKpi[]>} [KPI Array]
   */
  getKpis(field: string = '', sort: string = '-_id'): Observable<IKpi[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IKpi[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched kpis')),
        catchError(this.handleError('getKpis', []))
      );
  }

  /** GET Kpi by q. Return `undefined` when id not found */
  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getKpiNo404<Data>(query: any): Observable<IKpi> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IKpi[]>(url)
      .pipe(
        map(kpis => kpis[0]), // returns a {0|1} element array
        tap(kpi => {
          const outcome = kpi ? `fetched` : `did not find`;
          this.log(`${outcome} Kpi _id=${qstr}`);
        }),
        catchError(this.handleError<IKpi>(`getKpi ${qstr}`))
      );
  }


  /**
   * [通过过滤条件查询Kpis，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IKpi[]>}       [查询结果，Kpi数组]
   */
  searchKpis(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IKpi[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IKpi[]>(url)
      .pipe(
        tap(_ => this.log(`found Kpis matching "${qstr}"`)),
        catchError(this.handleError<IKpi[]>('searchKpis', []))
      );
  }

  /**
   * [通过过滤条件查询Kpis，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IKpi[]>}       [查询结果，Kpi数组]
   */
  searchKpisEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IKpi[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IKpi[]>(url)
      .pipe(
        tap(_ => this.log(`found Kpis matching "${query}"`)),
        catchError(this.handleError<IKpi[]>('searchKpis', []))
      );
  }

  /**
   * [统计KPI的类型信息]
   * @param  {any}               query [description]
   * @return {Observable<any[]>}       [description]
   */
  aggrClass(hs: any) : Observable<any[]> {
    const url = `${this.baseUrl}/aggr/?filters=${encodeURIComponent(JSON.stringify(hs))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`found KPI matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggrClass', []))
      );
  }

  /**
   * 获取所有的KPI关键信息
   * @return {Observable<IKpiElite[]>} [KPI关键信息Array]
   */
  getKpisElite(): Observable<IKpiElite[]> {
    return this.getKpis(this.eliteFields);
  }

  /**
   * 获取所有的KPIprofile信息
   * @return {Observable<IKpiProfile[]>} [KPIprofile信息Array]
   */
  getKpisProfile(): Observable<IKpiProfile[]> {
    return this.getKpis(this.profileFields);
  }

  /**
   * 根据 _id 获取单个IKpi
   * @param  {string}            id [IKpi的_id]
   * @return {Observable<IKpi>}    [单个IKpi]
   */
  getKpi(id: string): Observable<IKpi> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IKpi>(url)
      .pipe(
        tap(_ => this.log('fetch kpi id=${id}')),
        catchError(this.handleError<IKpi>('getKpi'))
      );
  }


  /**
   * [判断IKpi是否存在，根据 field 和 value]
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
    return this.http.get<IKpi[]>(url)
      .pipe(
        map(kpis => kpis[0]), // returns a {0|1} element array
        tap(kpi => {
          const outcome = kpi ? `fetched` : `did not find`;
          this.log(`${outcome} Kpi _id=${qstr}`);
        }),
        catchError(this.handleError<IKpi>(`getKpi ${qstr}`))
      );
  }

  /**
   * [判断IKpi是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的IKpi
   * @param  {IKpi}             kpi [待创建的IKpi]
   * @return {Observable<IKpi>}    [新创建的IKpi]
   */
  createKpi(kpi: IKpi): Observable<IKpi> {
    return this.http
      .post<IKpi>(this.baseUrl, kpi, httpOptions)
      .pipe(
        tap((newKpi: IKpi) => this.log(`added kpi w/ id=${newKpi._id}`)),
        catchError(this.handleError<IKpi>('createKpi'))
      );
  }

  /**
   * 在数据库中，更新某个IKpi信息
   * @param  {iKpi}             kpi [待更新的IKpi]
   * @return {Observable<IMTestSpec>}    [更新后的IKpi]
   */
  updateKpi(kpi: IKpi): Observable<IKpi> {
    const url = `${this.baseUrl}/${kpi._id}`;
    return this.http
      .put(url, kpi, httpOptions)
      .pipe(
        tap(_ => this.log(`updated kpi id=${kpi._id}`)),
        catchError(this.handleError<any>('updateKpi'))
      );
  }

  patchKpi(id: string, patch: any): Observable<IKpi> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch kpi id=${id}`)),
        catchError(this.handleError<any>('patchKpi'))
      );
  }

  /**
   * 在数据库中，删除某个IKpi
   * @param  {IKpi}            kpi [description]
   * @return {Observable<void>}    [description]
   */
  deleteKpi(kpi: IKpi): Observable<IKpi> {
//    console.log(kpi);
    const id = typeof kpi === 'string' ? kpi : kpi._id;
//    console.log(id);
    const url = `${this.baseUrl}/${kpi._id}`;
//    console.log(url);
    return this.http.delete<IKpi>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete kpi id=${id}`)),
        catchError(this.handleError<IKpi>('deleteKpi'))
      );
  }

  /**
   * 从操作定义 KpiDefinition 继承相关的属性
   * @param {IKpiDef} od [OpDefinition选项]
   * @param {string} reqOid [OpRequest OID]
   */
  DeriveFromKpiDef(kpi:IKpi, kpid: IKpiDef): IKpi {
    kpi.formula = kpid.formula;
    kpi.unit = kpid.unit;
    kpi.range = kpid.range;
    kpi.trend = kpid.trend;
    kpi.kpiDefinition =  new KpiDefElite(kpid)
    return kpi;
  }

}


