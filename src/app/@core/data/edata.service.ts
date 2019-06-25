import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IEquipmentData, IEDataElite, IEDataProfile, EquipmentData } from '../model/edata';
import { IEsub, IEsubElite, IEsubProfile } from '../model/esub';
import { IExistService } from './common.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class EdataService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/equipmentDatas';
  private eliteFields = '_id oid';
  private profileFields = 'metrics';

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
    this.messageService.add(`HsService: ${message}`);
  }

  /**
   * 获取所有的设备作业信息
   * @return {Observable<IEquipmentData[]>} [设备作业信息Array]
   */
  getEdatas(field: string = '', sort: string = '-_id'): Observable<IEquipmentData[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEquipmentData[]>(url)
      .pipe(
        tap(_ => this.log('fetched getEdatas')),
        catchError(this.handleError<IEquipmentData[]> ('getEdatas', []))
      )
  }

    /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEdatasNo404<Data>(query: any): Observable<IEquipmentData> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEquipmentData[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Edatas _id=${qstr}`);
        }),
        catchError(this.handleError<IEquipmentData>(`getEdatas ${qstr}`))
      );
  }




  /**
   * [通过过滤条件查询Edatas，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEquipmentData[]>}       [查询结果，Edatas数组]
   */
  searchEdatas(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEquipmentData[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    console.log("qstr",qstr);
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEquipmentData[]>(url)
      .pipe(
        tap(_ => this.log(`found Edatas matching "${qstr}"`)),
        catchError(this.handleError<IEquipmentData[]>('searchEdatas', []))
      );
  }

  /**
   * [通过过滤条件查询Edatas，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEquipmentData[]>}       [查询结果，hs数组]
   */
  searchEdatasEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEquipmentData[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEquipmentData[]>(url)
      .pipe(
        tap(_ => this.log(`found Edatas matching "${query}"`)),
        catchError(this.handleError<IEquipmentData[]>('searchEdatasEncode', []))
      );
  }

  /**
   * [getNewEdata 从数据库获取一个全新的 Edata,自带 _id]
   * @return {Observable<IEquipmentData>} [description]
   */
  getNewEdata(): Observable<IEquipmentData> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEquipmentData>(url)
      .pipe(
        tap(_ => this.log('fetched getNewEdata')),
        catchError(this.handleError<IEquipmentData>('getNewEdata'))
      )
  }

  /**
   * 根据 _id 获取单个设备作业信息
   * @param  {string}              id [description]
   * @return {Observable<IEquipmentData>}    [description]
   */
  getEdata(id: string): Observable<IEquipmentData> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEquipmentData> (url)
      .pipe(
        tap(_ => this.log('fetched getEdata')),
        catchError(this.handleError<IEquipmentData> ('getEdata'))
      )
  }

 /**
  * [getPsubsElite 获取所有的设备作业信息]
  * @return {Observable<IEDataElite[]>} [description]
  */
  getEdatasElite(): Observable<IEDataElite[]> {
      return this.getEdatas(this.eliteFields);
  }

  /**
   * 获取所有的设备作业关键信息 + Context
   * @return {Observable<IEDataProfile[]>} [设备作业关键信息 + Context's Array]
   */
  getEdatasProfile(): Observable<IEquipmentData[]> {
      return this.getEdatas(this.profileFields);
  }

  /**
   * [getEdatasBy 通过简单的查询条件，获取相应的 Edata 信息]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IEquipmentData[]>}   [description]
   */
  getEdatasBy(query: any = {}): Observable<IEquipmentData[]> {
      return this.searchEdatasEncode(query);
  }

  /**
   * [getEsubsEliteBy 通过简单的查询条件，获取相应的 Psub 关键信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IEDataElite[]>}   [description]
   */
  getEdatasEliteBy(query: any = {}): Observable<IEDataElite[]> {
      return this.searchEdatasEncode(query,this.eliteFields);
  }

  /**
   * [getEsubsProfileBy 通过简单的查询条件，获取相应的 ESubProfile Profile 信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IEDataProfile[]>}   [description]
   */
  getEdatasProfileBy(query: any = {}): Observable<IEDataProfile[]> {
      return this.searchEdatasEncode(query,this.profileFields);

  }

  getEdataBy(query: any = {}): Observable<IEquipmentData> {
    return this.getEdatasNo404(query);
  }

  /**
   * 从单个的 Esub 中继承相关的属性
   * @param  {IEndata}     edata [原始的 物料批次]
   * @param  {IEnsub}      esub  [物料信息]
   * @return {IEndata}        [新的 物料批次]
   */
  newEdataByEsub(edata: IEquipmentData, esub: IEsub): EquipmentData {
    let model = new EquipmentData(edata);
    model.DeriveFromEsub(esub);
    return model;
  }

  /**
   * 在数据库中，创建新的设备作业信息
   * @param  {IEquipmentData}             e [待创建的设备作业信息]
   * @return {Observable<IEquipmentData>}   [新创建的设备作业信息]
   */
  createEdata(e: IEquipmentData): Observable<IEquipmentData> {
    return this.http
      .post<IEquipmentData>(this.baseUrl, e, httpOptions)
      .pipe(
        tap((NewEdata: IEquipmentData) => this.log(`added EquipmentData w/ id=${NewEdata._id}`)),
        catchError(this.handleError<IEquipmentData> ('createEdata'))
      )
  }

  /**
   * [createEdataBy description]
   * @param  {any}               pAhs [edataelite and hs]
   * {
       p: xxx,
       hs: xxx,
   * }
   * @return {Observable<IEquipmentData>}      [description]
   */
  createEdataBy(eAhs: any): Observable<IEquipmentData> {
    const url = `${this.baseUrl}/by`;
    return this.http
      .post<IEquipmentData>(url, eAhs)
      .pipe(
        tap(_ => this.log('fetched createEdataBy')),
        catchError(this.handleError<IEquipmentData> ('createEdataBy'))
      )
  }

  /**
   * 在数据库中，更新某个设备作业信息
   * @param  {IEquipmentData}             e [待更新的设备作业信息]
   * @return {Observable<IEquipmentData>}     [已更新的设备作业信息]
   */
  updatedEdata(e: IEquipmentData): Observable<IEquipmentData> {
    const url = `${this.baseUrl}/${e._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IEquipmentData>(url, e)
      .pipe(
        tap(_ => this.log('fetched updatedEdata')),
        catchError(this.handleError<IEquipmentData> ('updatedEdata'))
      )
  }

  //新增patch方法
  patchEdata(id: string, patch: any): Observable<IEquipmentData> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IEquipmentData>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchEdata')),
        catchError(this.handleError<IEquipmentData> ('patchEdata'))
      )
  }

  /**
   * 在数据库中，删除某个设备作业信息
   * @param  {IEquipmentData}          p [待删除的设备作业信息]
   * @return {Observable<void>}   [description]
   */
  deleteEdata(p: IEquipmentData): Observable<IEquipmentData> {
    const url = `${this.baseUrl}/${p._id}`;
    return this.http.delete<IEquipmentData>(url)
      .pipe(
        tap(_ => this.log('fetched deleteEdata')),
        catchError(this.handleError<IEquipmentData>('deleteEdata'))
      )
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
