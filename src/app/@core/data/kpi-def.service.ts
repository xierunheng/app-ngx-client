import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IKpiDef, IKpiDefElite, IKpiDefProfile } from '../model/kpi-def'
import { IExistService } from './common.service';
import { MessageService } from './message.service';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class KpiDefinitionService implements IExistService {
  private baseUrl = '/api/kpiDefinitions';
  constructor(private http: HttpClient,
        private messageService: MessageService) {
  }

  private eliteFields = '_id oid';
  private profileFields = '-prop -usesKpiDefinition -notes -audience';

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
    this.messageService.add(`KpiDefinitionService: ${message}`);
  }

  /**
   * 获取所有的KPIDefinition信息
   * @return {Observable<IKpiDef[]>} [KPIDefinition Array]
   */
  getKpiDefs(field: string = '', sort: string = '-_id'): Observable<IKpiDef[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IKpiDef[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched kpiDefs')),
        catchError(this.handleError('getKpiDefs', []))
      );
  }

  /** GET KpiDef by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getKpiDefNo404<Data>(query: any): Observable<IKpiDef> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IKpiDef[]>(url)
      .pipe(
        map(kps => kps[0]), // returns a {0|1} element array
        tap(kp => {
          const outcome = kp ? `fetched` : `did not find`;
          this.log(`${outcome} KpiDef _id=${qstr}`);
        }),
        catchError(this.handleError<IKpiDef>(`getIKpiDef ${qstr}`))
      );
  }


  /**
   * [通过过滤条件查询KpiDefs，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IKpiDef[]>}       [查询结果，KpiDef数组]
   */
  searchKpiDefs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IKpiDef[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IKpiDef[]>(url)
      .pipe(
        tap(_ => this.log(`found KpiDefs matching "${qstr}"`)),
        catchError(this.handleError<IKpiDef[]>('searchKpiDefs', []))
      );
  }

  /**
   * [通过过滤条件查询KpiDefs，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IKpiDef[]>}       [查询结果，KpiDef数组]
   */
  searchKpiDefsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IKpiDef[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IKpiDef[]>(url)
      .pipe(
        tap(_ => this.log(`found KpiDefs matching "${query}"`)),
        catchError(this.handleError<IKpiDef[]>('searchKpiDefs', []))
      );
  }

  /**
   * 获取所有的KPIDefinition关键信息
   * @return {Observable<IKpiDefElite[]>} [KPIDefinition关键信息Array]
   */
  getKpiDefsElite(): Observable<IKpiDefElite[]> {
    return this.getKpiDefs(this.eliteFields);
  }

  /**
   * 获取所有的KPIDefinition profile信息
   * @return {Observable<IKpiDefElite[]>} [KPIDefinition profile 信息Array]
   */
  getKpiDefsProfile(): Observable<IKpiDefProfile[]> {
    return this.getKpiDefs(this.profileFields);
  }

  /**
   * 根据 _id 获取单个IKpiDef
   * @param  {string}            id [IKpiDefElite的_id]
   * @return {Observable<IKpiDef>}    [单个IKpiDefElite]
   */
  getKpiDef(id: string): Observable<IKpiDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IKpiDef>(url)
      .pipe(
        tap(_ => this.log('fetch kpid id=${id}')),
        catchError(this.handleError<IKpiDef>('getKpiDef'))
      );
  }

  /**
   * [判断IKpiDef是否存在，根据 field 和 value]
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
    return this.http.get<IKpiDef[]>(url)
      .pipe(
        map(KpiDefs => KpiDefs[0]),
        tap(KpiDef => {
          const outcome = KpiDef ? `fetched` : `did not find`;
          this.log(`${outcome} KpiDef _id=${qstr}`);
        }),
        catchError(this.handleError<IKpiDef>(`getKpiDef ${qstr}`))
      );
  }


  /**
   * [判断KpiDef类型是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的IKpiDef
   * @param  {IKpiDef}             kpid [待创建的IKpiDef]
   * @return {Observable<IKpiDef>}    [新创建的IKpiDef]
   */
  createKpiDef(kpid: IKpiDef): Observable<IKpiDef> {
    console.log(kpid);
    return this.http
      .post<IKpiDef>(this.baseUrl, kpid, httpOptions)
      .pipe(
        tap((newKpiDef: IKpiDef) => this.log(`added kpid w/ id=${newKpiDef._id}`)),
        catchError(this.handleError<IKpiDef>('createKpiDef'))
      );
  }

  /**
   * 在数据库中，更新某个IKpiDef信息
   * @param  {IKpiDef}             kpid [待更新的IKpiDef]
   * @return {Observable<IKpiDef>}    [更新后的IKpiDef]
   */
  updateKpiDef(kpid: IKpiDef): Observable<IKpiDef> {
    const url = `${this.baseUrl}/${kpid._id}`;
    return this.http
      .put(url, kpid, httpOptions)
      .pipe(
        tap(_ => this.log(`updated kpid id=${kpid._id}`)),
        catchError(this.handleError<any>('updateKpiDef'))
      );
  }

  patchKpiDef(id: string, patch: any): Observable<IKpiDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch kpid id=${id}`)),
        catchError(this.handleError<any>('patchKpiDef'))
      );
  }

  /**
   * 在数据库中，删除某个IKpiDef
   * @param  {IKpiDef}            kpid [description]
   * @return {Observable<void>}    [description]
   */
  deleteKpiDef(kpid: IKpiDef): Observable<IKpiDef> {
    const id = typeof kpid === 'string' ? kpid : kpid._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IKpiDef>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete kpid id=${id}`)),
        catchError(this.handleError<IKpiDef>('deleteKpiDef'))
      );
  }

  /**
   * [根据KpiDef[], 创建Kpi树]
   * @param  {IKpiDef[]}      kpids [description]
   * @param  {boolean     =   false}       collapsed  [description]
   * @param  {boolean     =   true}        withKpi [description]
   * @return {TreeviewItem[]}     [description]
   */
  createKpiTree(kpids: IKpiDef[], collapsed: boolean = true, withKpi: boolean = true): TreeviewItem[] {
    let ptree: TreeviewItem[] = kpids && kpids.length > 0 ? kpids.map(kpid => {
      return new TreeviewItem({
        text: `${kpid.name}[${kpid.oid}]`,
        value: kpid,
        checked: false,
        collapsed: collapsed,
        children: withKpi ? _.sortBy(kpid.kpi, 'oid').map(kpi => {
          return {
            text: `${kpi.oid}`,
            value: kpi,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.kpi.name,
      value: UtilData.systemObj.kpi.name,
      checked: false,
      collapsed: false,
      children: ptree
    });
    return [root];
  }

}


