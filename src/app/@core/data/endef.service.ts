import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IEnclass } from '../model/enclass';
import { IEnergyDefinition, EnergyDefinition,
  IEnergyProfile, IEnergyElite } from '../model/endef';
import {IExistService} from './common.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EnDefService implements IExistService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/energyDefinitions';
  private eliteFields = '_id oid';
  private profileFields = '-prop -ensubs';

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
    this.messageService.add(`EnDefService: ${message}`);
  }


  /**
   * 获取所有的能源信息
   * @return {Observable<IEnergyDefinition[]>} [设备信息Array]
   */
  getEnDefs(field: string = '', sort: string = '-_id'): Observable<IEnergyDefinition[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEnergyDefinition[]>(url)
      .pipe(
        tap(_ => this.log('fetcht getEnDefs')),
        catchError(this.handleError<IEnergyDefinition[]>('getEnDefs', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEnDef404<Data>(query: any): Observable<IEnergyDefinition> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEnergyDefinition[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} EnergyDefinition _id=${qstr}`);
        }),
        catchError(this.handleError<IEnergyDefinition>(`getEnergyDefinition ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnergyDefinition[]>}       [查询结果，EnergyDefinition数组]
   */
  searchEnDefs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnergyDefinition[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnergyDefinition[]>(url)
      .pipe(
        tap(_ => this.log(`found EnergyDefinition matching "${qstr}"`)),
        catchError(this.handleError<IEnergyDefinition[]>('searchEnergyDefinition', []))
      );
  }

  /**
   * [通过过滤条件查询EnergyDefinition，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnergyDefinition[]>}       [查询结果，IEnergyDefinition数组]
   */
  searchEnDefsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnergyDefinition[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnergyDefinition[]>(url)
      .pipe(
        tap(_ => this.log(`found EnergyDefinition matching "${query}"`)),
        catchError(this.handleError<IEnergyDefinition[]>('searchEnergyDefinition', []))
      );
  }

  /**
   * [统计能源的类型信息]
   * @param  {any}               query [description]
   * @return {Observable<any[]>}       [description]
   */
  aggrClass(hs: any) : Observable<any[]> {
    const url = `${this.baseUrl}/aggr/?filters=${encodeURIComponent(JSON.stringify(hs))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`found Energy matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggrClass', []))
      );
  }

  /**
   * 获取所有的能源关键信息
   * @return {Observable<IEnergyProfile[]>} [设备关键信息 + Context's Array]
   */
  getEnDefsElite(): Observable<IEnergyElite[]> {
      return this.getEnDefs(this.eliteFields);
  }

  /**
   * 获取所有的能源关键信息 + Context
   * @return {Observable<IEnergyProfile[]>} [能源关键信息 + Context's Array]
   */
  getEnDefsProfile(): Observable<IEnergyProfile[]> {
      return this.getEnDefs(this.profileFields);
  }

  /**
   * [getNewEnDef 从数据库获取一个全新的 Endef,自带 _id]
   * @return {Observable<IEnergyDefinition>} [description]
   */
  getNewEnDef(): Observable<IEnergyDefinition> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEnergyDefinition>(url)
      .pipe(
        tap(_ => this.log('fetcht getNewEnDef')),
        catchError(this.handleError<IEnergyDefinition>('getNewEnDef'))
      )
  }

  /**
   * 根据 _id 获取单个能源信息
   * @param  {string}                 id [能源的 _id]
   * @return {Observable<IEnergyDefinition>}    [单个能源信息]
   */
  getEnDef(id: string): Observable<IEnergyDefinition> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEnergyDefinition>(url)
      .pipe(
        tap(_ => this.log('fetcht getEnDef')),
        catchError(this.handleError<IEnergyDefinition>('getEnDef'))
      )
  }

  /**
   * [getEndefsBy 获取所有的能源信息，查询条件由 Client 提供]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IEnergyDefinition[]>}   [description]
   */
  getEnDefsBy(query: any = {}): Observable<IEnergyDefinition[]> {
      return this.getEnDefs(query);
  }

  /**
   * [getEndefsEliteBy 获取所有的能源关键信息，查询条件由 Client 提供]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IEnergyElite[]>}   [设备关键信息 Array]
   */
  getEnDefsEliteBy(query: any = {}): Observable<IEnergyElite[]> {
      return this.searchEnDefs(this.eliteFields);
  }

  /**
   * [getEndefsProfileBy 获取所有的能源关键信息 + Context, 查询条件由 Client 提供]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IEnergyProfile[]>}   [description]
   */
  getEnDefsProfileBy(query: any = {}): Observable<IEnergyProfile[]> {
      return this.searchEnDefs(this.profileFields);
  }

  // getEnDefBy(query: any = {}): Observable<IEnergyDefinition> {
  //   const url = `${this.baseUrl}/oneby`;
  //   return this.http
  //     .post<IEnergyDefinition>(url, query, httpOptions)
  //     .pipe(
  //       tap(_ => this.log('fetcht getEnDefBy')),
  //       catchError(this.handleError<IEnergyDefinition>('getEnDefBy'))
  //     )
  // }

  /**
   * [判断能源是否存在，根据 field 和 value]
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
    return this.http.get<IEnergyDefinition[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} EnergyDefinition _id=${qstr}`);
        }),
        catchError(this.handleError<IEnergyDefinition>(`getEnergyDefinition ${qstr}`))
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
   * 在数据库中，创建新的能源信息
   * @param  {IEnergyDefinition}             en [待创建的能源信息]
   * @return {Observable<IEnergyDefinition>}   [新创建的能源信息]
   */
  createEnDef(en: IEnergyDefinition): Observable<IEnergyDefinition> {
    return this.http
      .post<IEnergyDefinition>(this.baseUrl, en, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht createEnDef')),
        catchError(this.handleError<IEnergyDefinition>('createEnDef'))
      )
  }

  /**
   * [在数据库中，更新某个能源信息]
   * @param  {IEnergyDefinition}             en [description]
   * @return {Observable<IEnergyDefinition>}   [description]
   */
  updateEnDef(en: IEnergyDefinition): Observable<IEnergyDefinition> {
    const url = `${this.baseUrl}/${en._id}`;
    return this.http
      .put<IEnergyDefinition>(url, en, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht updateEnDef')),
        catchError(this.handleError<IEnergyDefinition>('updateEnDef'))
      )
  }

  patchEnDef(id: string, patch: any): Observable<IEnergyDefinition> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IEnergyDefinition>(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht patchEnDef')),
        catchError(this.handleError<IEnergyDefinition>('patchEnDef'))
      )
  }

  /**
   * 在数据库中，删除某个能源信息
   * @param  {IEnergyDefinition}       en [待删除的设备信息]
   * @return {Observable<void>}   [description]
   */
  deleteEnDef(en: IEnergyDefinition): Observable<IEnergyDefinition> {
    const url = `${this.baseUrl}/${en._id}`;
    return this.http.delete<IEnergyDefinition>(url)
      .pipe(
        tap(_ => this.log(`delete hs id=${en._id}`)),
        catchError(this.handleError<IEnergyDefinition> ('deleteEnDef'))
      );
  }

  /**
   * [创建新的能源定义 Tree，包含能源类型和能源定义信息]
   * @param  {IEndefProfile[]}    ense [description]
   * @param  {boolean} collapse
   * @param  {IEndefProfile[] =   []}          sels [description]
   * @return {TreeviewItem[]}           [description]
   */
  newEnDefTree(ense: IEnergyProfile[], collapsed: boolean = false, sels: IEnergyElite[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] =[];
    if(ense && ense.length > 0) {
      rntree = _.map(_.groupBy(ense, 'enclass[0]._id'), (value, key) => {
        return new TreeviewItem({
          text: value[0].enclass[0].oid,
          value: value[0].enclass[0],
          checked: false,
          collapsed: collapsed,
          children: value.map(en => {
            return {
              text: `${en.oid}`,
              value: en,
              checked: sels ? sels.findIndex(sel => sel._id === en._id) >= 0 : false,
              children: []
            }
          })
        });
      });
    }
    return rntree;
  }

  deriveFromEnClass(end: IEnergyDefinition, encs: IEnclass[]): IEnergyDefinition {
    if (encs && encs.length > 0) {
      end.hs = encs[0].hs;
      encs.forEach((value, index, array) => {
        end.prop = _.unionBy(end.prop, value.prop, '_id');
      });
      end.enclass = encs.map((value, index, array) => {
        return _.pick(value, ['_id', 'oid']);
      })
    }
    return end;
  }


}
