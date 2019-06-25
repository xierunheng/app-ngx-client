import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IEnclass, IEnclassElite } from '../model/enclass';
import {IExistService} from './common.service';
import * as _ from 'lodash';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EnclassService implements IExistService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/energyClasss';
  private eliteFields = '_id oid';
  private profileFields = '-prop -energydefs';

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
    this.messageService.add(`EnclassService: ${message}`);
  }

  /**
   * 获取所有的能源类型信息
   * @return {Observable<IEnclass[]>} [能源类型信息Array]
   */
  getEnclasss(field: string = '', sort: string = '-_id'): Observable<IEnclass[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEnclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched getEnclasss')),
        catchError(this.handleError<IEnclass[]>('getEnclasss', []))
      )
  }


  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEnclassNo404<Data>(query: any): Observable<IEnclass> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEnclass[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Enclass _id=${qstr}`);
        }),
        catchError(this.handleError<IEnclass>(`getEnclass ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询Enclass，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnclass[]>}       [查询结果，IEnclass数组]
   */
  searchEnclass(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnclass[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Enclass matching "${qstr}"`)),
        catchError(this.handleError<IEnclass[]>('searchEnclass', []))
      );
  }

  /**
   * [通过过滤条件查询Enclass，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnclass[]>}       [查询结果，IEnclass数组]
   */
  searchEnclassEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnclass[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Enclass matching "${query}"`)),
        catchError(this.handleError<IEnclass[]>('searchEnclass', []))
      );
  }

  /**
   * 通过能源类型 的 _id数组 获取 设备类型 数组
   * @param  {string[]}              ids [description]
   * @return {Observable<IEclass[]>}     [description]
   */
  getManyEnclasss(ids: string[]): Observable<IEnclass[]> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}`;
    return this.http.get<IEnclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched getManyEnclasss')),
        catchError(this.handleError<IEnclass[]>('getManyEnclasss', []))
      )
  }

  /**
   * 获取所有的能源类型关键信息
   * @return {Observable<IEnclassElite[]>} [能源类型关键信息Array]
   */
  getEnclasssElite(): Observable<IEnclassElite[]> {
    return this.getEnclasss(this.eliteFields);
  }

  /**
   * [getEclasssProfile 获取所有的能源类型 profile 信息]
   * @return {Observable<IEclass[]>} [description]
   */
  getEnclasssProfile(): Observable<IEnclass[]> {
     return this.getEnclasss(this.profileFields);
  }

/**
 * [getNewEnclass 从数据库获取一个全新的 Enclass, 自带 _id]
 * @return {Observable<IEnclass>} [description]
 */
  getNewEnclass(): Observable<IEnclass> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEnclass>(url)
      .pipe(
        tap(_ => this.log('fetched getNewEnclass')),
        catchError(this.handleError<IEnclass>('getNewEnclass'))
      )
  }

  /**
   * 根据 _id 获取单个能源类型信息
   * @param  {string}              id [能源类型的 _id]
   * @return {Observable<IEnclass>}    [单个能源类型信息]
   */
  getEnclass(id: string): Observable<IEnclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEnclass>(url)
      .pipe(
        tap(_ => this.log('fetched getEnclass')),
        catchError(this.handleError<IEnclass>('getEnclass'))
      )
  }

  /**
   * [getEnclasssBy 获取所有的能源类型信息, 查询条件由 Client 提供]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IEnclass[]>}   [description]
   */
  getEnclasssBy(query: any = {}): Observable<IEnclass[]> {
    return this.searchEnclass(query);
  }

  /**
   * [getEnclasssEliteBy 获取所有的能源类型关键信息, 查询条件由 Client 提供]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IEclassElite[]>}   [description]
   */
  getEnclasssEliteBy(query: any = {}): Observable<IEnclassElite[]> {
     return this.searchEnclass(query, this.eliteFields);
  }

  /**
   * [getEnclasssProfileBy 获取所有的能源类型 profile 信息, 查询条件由 Client 提供]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IEnclass[]>}   [description]
   */
  getEnclasssProfileBy(query: any = {}): Observable<IEnclass[]> {
    return this.searchEnclass(query, this.profileFields);
  }


  /**
   * [判断能源类型是否存在，根据 field 和 value]
   * @param  {string}           field [description]
   * @param  {any}              value [description]
   * @return {Observable<void>}       [description]
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
    return this.http.get<IEnclass[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Enclass _id=${qstr}`);
        }),
        catchError(this.handleError<IEnclass>(`getEnclass ${qstr}`))
      );
  }

  /**
   * [判断能源类型是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的能源类型信息
   * @param  {IEnclass}             enc [待创建的能源类型]
   * @return {Observable<IEnclass>}    [新创建的设备类型]
   */
  createEnclass(enc: IEnclass): Observable<IEnclass> {
    return this.http
      .post<IEnclass>(this.baseUrl, enc, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createEnclass')),
        catchError(this.handleError<IEnclass>('createEnclass'))
      )
  }

  /**
   * 在数据库中，更新某个能源类型信息
   * @param  {IEnclass}             ec [待更新的能源类型信息]
   * @return {Observable<IEnclass>}    [已更新的能源类型信息]
   */
  updateEnclass(enc: IEnclass, elite: boolean = false): Observable<IEnclass> {
    const url = `${this.baseUrl}/${enc._id}`;
    console.log(url);
    return this.http
      .put<IEnclass>(url, enc)
      .pipe(
        tap(_ => this.log('fetched updateEnclass id=${enc._id}')),
        catchError(this.handleError<IEnclass>('updateEnclass'))
      )
  }

  patchEnclass(id: string, patch: any): Observable<IEnclass> {
    const url = `${this.baseUrl}/${id}`;
    console.log(url);
    return this.http
      .patch<IEnclass>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchEnclass id=${id}')),
        catchError(this.handleError<IEnclass>('patchEnclass'))
      )
  }

  /**
   * 在数据库中，删除某个能源类型信息
   * @param  {IEnclass}          ec [待删除的能源类型信息]
   * @return {Observable<void>}    [description]
   */
  deleteEnclass(enc: IEnclass): Observable<IEnclass> {
    const url = `${this.baseUrl}/${enc._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IEnclass>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Enclass id=${enc._id}`)),
        catchError(this.handleError<IEnclass>('deleteEnclass'))
      )
  }

  newEnclassTree(encs: IEnclassElite[], sels: IEnclassElite[] = []): TreeviewItem[] {
    return encs && encs.length > 0 ? encs.map(item => {
      return new TreeviewItem({
        text: item.oid,
        value: item,
        checked: sels ? sels.findIndex(sel => sel._id === item._id) >= 0 : false,
        children: []
      });
    }) : [];
  }

  /**
   * [根据enclass[], 创建能源树]
   * @param  {IEnclass[]}      encs [description]
   * @param  {boolean     =   false}       collapsed  [description]
   * @param  {boolean     =   true}        withPerson [description]
   * @return {TreeviewItem[]}     [description]
   */
  createEnTree(encs: IEnclass[], collapsed: boolean = true, withEnergy: boolean = true): TreeviewItem[] {
    let entree: TreeviewItem[] = encs && encs.length > 0 ? encs.map(enc => {
      return new TreeviewItem({
        text: enc.oid,
        value: enc,
        checked: false,
        collapsed: collapsed,
        children: withEnergy ? _.sortBy(enc.endefs, 'oid').map(end => {
          return {
            text: `${end.oid}`,
            value: end,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.energy.name,
      value: UtilData.systemObj.energy.name,
      checked: false,
      collapsed: false,
      children: entree
    });
    return [root];
  }

}
