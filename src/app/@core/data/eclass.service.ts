import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';

import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IEclass, IEclassElite } from '../model/eclass';
import {IExistService} from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';
import { UtilData } from './util.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EclassService implements IExistService {
  private baseUrl = '/api/equipmentClasss';

  private eliteFields = '_id oid code';
  private profileFields = '-prop -equipments';

  constructor(private http: HttpClient,
    private messageService: MessageService,
    private socketService: SocketService) {
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
    this.messageService.add(`EclassService: ${message}`);
  }

  /**
   * 获取所有的设备类型信息
   * @return {Observable<IEclass[]>} [设备类型信息Array]
   */
  getEclasss(field: string = '', sort: string = '-_id'): Observable<IEclass[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched Eclasss')),
        catchError(this.handleError('getEclasss', []))
      );
  }

  /**
   * 通过设备类型 的 _id数组 获取 设备类型 数组
   * @param  {string[]}              ids [description]
   * @return {Observable<IEclass[]>}     [description]
   */
  getManyEclasss(ids: string[]): Observable<IEclass[]> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}`;
    return this.http.get<IEclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched Eclasss by many ids')),
        catchError(this.handleError('getManyEclasss', []))
      );
  }

  /**
   * 通过查询条件，获取eclass信息
   * 当查询不到时，返回 undefined
   */
  getEclassNo404<Data>(query: any): Observable<IEclass> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEclass[]>(url)
      .pipe(
        map(Eclasss => Eclasss[0]), // returns a {0|1} element array
        tap(Eclass => {
          const outcome = Eclass ? `fetched` : `did not find`;
          this.log(`${outcome} Eclass _id=${qstr}`);
        }),
        catchError(this.handleError<IEclass>(`getEclass ${qstr}`))
      );
  }

  /**
   * 获取所有的设备类型关键信息
   * @return {Observable<IEclassElite[]>} [设备类型关键信息Array]
   */
  getEclasssElite(): Observable<IEclassElite[]> {
    return this.getEclasss(this.eliteFields);
  }

  /**
   * [getEclasssProfile 获取所有的设备类型 profile 信息]
   * @return {Observable<IEclass[]>} [description]
   */
  getEclasssProfile(): Observable<IEclass[]> {
    return this.getEclasss(this.profileFields);
  }

  /**
   * [getNewEclass 从数据库获取一个全新的 Eclass,自带 _id]
   * @return {Observable<IEclass>} [description]
   */
  getNewEclass(): Observable<IEclass> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEclass>(url)
      .pipe(
        tap(_ => this.log('fetched new Eclass')),
        catchError(this.handleError<IEclass>('getNewEclass'))
      );
  }

  /**
   * 根据 _id 获取单个设备类型信息
   * @param  {string}              id [设备类型的 _id]
   * @return {Observable<IEclass>}    [单个设备类型信息]
   */
  getEclass(id: string): Observable<IEclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEclass>(url)
      .pipe(
        tap(_ => this.log('fetched Eclass id=${id}')),
        catchError(this.handleError<IEclass>('getEclass'))
      );
  }

  /**
   * [通过过滤条件查询Eclasss，可设定查询的相关选项]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEclass[]>}       [查询结果，Eclass 数组]
   */
  searchEclasss(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEclass[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Eclasss matching "${qstr}"`)),
        catchError(this.handleError<IEclass[]>('searchEclasss', []))
      );
  }

  /**
   * [通过过滤条件查询Eclasss，可设定查询的相关选项]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEclass[]>}       [查询结果，Eclass 数组]
   */
  searchEclasssEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEclass[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Eclasss matching "${query}"`)),
        catchError(this.handleError<IEclass[]>('searchEclasss', []))
      );
  }

  /**
   * 判断 Eclass 是否存在，根据 field 和 value
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
    return this.http.get<IEclass[]>(url)
      .pipe(
        map(Eclasss => Eclasss[0]), // returns a {0|1} element array
        tap(Eclass => {
          const outcome = Eclass ? `fetched` : `did not find`;
          this.log(`${outcome} Eclass _id=${qstr}`);
        }),
        catchError(this.handleError<IEclass>(`getEclass ${qstr}`))
      );
  }

  /**
   * [getEclasssBy 获取所有的设备类型信息, 查询条件由 Client 提供]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IEclass[]>}   [description]
   */
  getEclasssBy(query: any = {}): Observable<IEclass[]> {
    return this.searchEclasss(query);
  }

  /**
   * [getEclasssEliteBy 获取所有的设备类型关键信息, 查询条件由 Client 提供]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IEclassElite[]>}   [description]
   */
  getEclasssEliteBy(query: any = {}): Observable<IEclassElite[]> {
    return this.searchEclasss(query, this.eliteFields);
  }

  /**
   * [getEclasssProfileBy 获取所有的设备类型 profile 信息, 查询条件由 Client 提供]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IEclass[]>}   [description]
   */
  getEclasssProfileBy(query: any = {}): Observable<IEclass[]> {
    return this.searchEclasss(query, this.profileFields);
  }

  getEclassBy(query: any = {}): Observable<IEclass> {
    return this.getEclassNo404(query);
  }

  /**
   * [判断设备类型是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的设备类型信息
   * @param  {IEclass}             ec [待创建的设备类型]
   * @return {Observable<IEclass>}    [新创建的设备类型]
   */
  createEclass(ec: IEclass): Observable<IEclass> {
    return this.http
      .post<IEclass>(this.baseUrl, ec, httpOptions)
      .pipe(
        tap((NewEclass: IEclass) => this.log(`added Eclass w/ id=${NewEclass._id}`)),
        catchError(this.handleError<IEclass>('createEclass'))
      );
  }

  /**
   * 在数据库中，更新某个设备类型信息
   * @param  {IEclass}             ec [待更新的设备类型信息]
   * @return {Observable<IEclass>}    [已更新的设备类型信息]
   */
 // updateEclass(ec: IEclass, elite: boolean = false): Observable<IEclass> {
  updateEclass(ec: IEclass): Observable<IEclass> {
    const url = `${this.baseUrl}/${ec._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IEclass>(url, ec, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Eclass id=${ec._id}`)),
        catchError(this.handleError<any>('updateEclass'))
      );
  }

  patchEclass(id: string, patch: any): Observable<IEclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Eclass id=${id}`)),
        catchError(this.handleError<any>('patchEclass'))
      );
  }

  /**
   * 在数据库中，删除某个设备类型信息
   * @param  {IEclass}          ec [待删除的设备类型信息]
   * @return {Observable<void>}    [description]
   */
  deleteEclass(ec: IEclass): Observable<IEclass> {
    const id = typeof ec === 'string' ? ec : ec._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IEclass>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Eclass id=${id}`)),
        catchError(this.handleError<IEclass>('deleteEclass'))
      );
  }

  newEclassTree(ecs: IEclassElite[], sels: IEclassElite[] = []): TreeviewItem[] {
    return ecs && ecs.length > 0 ? ecs.map(item => {
      return new TreeviewItem({
        text: item.oid,
        value: item,
        checked: sels ? sels.findIndex(sel => sel._id === item._id) >= 0 : false,
        children: []
      });
    }) : [];
  }

  createETree(ecs: IEclass[], collapsed: boolean = true, withEquip: boolean = true): TreeviewItem[] {
    let etree: TreeviewItem[] = ecs && ecs.length > 0 ? ecs.map(ec => {
      return new TreeviewItem({
        text: ec.oid,
        value: ec,
        checked: false,
        collapsed: collapsed,
        children: withEquip ? _.sortBy(ec.equipments, 'oid').map(e => {
          return {
            text: `${e.oid} ${e.name}`,
            value: e,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.equipment.name,
      value: UtilData.systemObj.equipment.name,
      checked: false,
      collapsed: false,
      children: etree
    });
    return [root];
  }

}
