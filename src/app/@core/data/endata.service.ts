import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IEnergyData, EnergyData, IEnDataElite, IEnDataProfile } from '../model/endata';
import { IEnSub, IEnSubElite, IEnSubProfile } from '../model/ensub';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EndataService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/energyDatas';
  private eliteFields = '_id oid';
  private profileFields = '-metrics';
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
    this.messageService.add(`EndataService: ${message}`);
  }

  /**
   * 获取所有的能源数采信息
   * @return {Observable<IEnergyData[]>} [能源数采信息Array]
   */
  getEndatas(field: string = '', sort: string = '-_id'): Observable<IEnergyData[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEnergyData[]>(url)
      .pipe(
        tap(_ => this.log('fetched getEndatas')),
        catchError(this.handleError<IEnergyData[]>('getEndatas', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEndataNo404<Data>(query: any): Observable<IEnergyData> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEnergyData[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Endata _id=${qstr}`);
        }),
        catchError(this.handleError<IEnergyData>(`getEndata ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询EnergyData，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnergyData[]>}       [查询结果，IEnergyData数组]
   */
  searchEndatas(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnergyData[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnergyData[]>(url)
      .pipe(
        tap(_ => this.log(`found Endatas matching "${qstr}"`)),
        catchError(this.handleError<IEnergyData[]>('searchEndatas', []))
      );
  }

    /**
   * [通过过滤条件查询Endatas，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnergyData[]>}       [查询结果，EnergyData数组]
   */
  searchEndatasEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnergyData[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnergyData[]>(url)
      .pipe(
        tap(_ => this.log(`found Endatas matching "${query}"`)),
        catchError(this.handleError<IEnergyData[]>('searchEndatas', []))
      );
  }

  /**
   * [getNewEndata 从数据库获取一个全新的 Endata,自带 _id]
   * @return {Observable<IEnergyData>} [description]
   */
  getNewEndata(): Observable<IEnergyData> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEnergyData> (url)
      .pipe(
        tap(_ => this.log('fetched getNewEndata')),
        catchError(this.handleError<IEnergyData>('getNewEndata'))
      )
  }

  /**
   * 根据 _id 获取单个能源数采信息
   * @param  {string}              id [description]
   * @return {Observable<IEnergyData>}    [description]
   */
  getEndata(id: string): Observable<IEnergyData> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEnergyData>(url)
      .pipe(
        tap(_ => this.log('fetched getEndata')),
        catchError(this.handleError<IEnergyData>('getEndata'))
      )
  }

 /**
  * [getEnsubsElite 获取所有的能源数采关键信息]
  * @return {Observable<IEnDataElite[]>} [description]
  */
  getEndatasElite(): Observable<IEnDataElite[]> {
    return this.getEndatas(this.eliteFields);
  }

  /**
   * 获取所有的能源数采profile信息 + Context
   * @return {Observable<IEnDataProfile[]>} [能源数采profile信息 + Context's Array]
   */
  getEndatasProfile(): Observable<IEnDataProfile[]> {
        return this.getEndatas(this.profileFields);
  }

  /**
   * [getEndatasBy 通过简单的查询条件，获取相应的 Endata 信息]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IEnergyData[]>}   [description]
   */
  getEndatasBy(query: any = {}): Observable<IEnergyData[]> {
     return this.searchEndatas(query);

  }

  /**
   * [getEnsElidatateBy 通过简单的查询条件，获取相应的 Endata 关键信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IEnDataElite[]>}   [description]
   */
  getEndatasEliteBy(query: any = {}): Observable<IEnDataElite[]> {
     return this.searchEndatas(query,this.eliteFields);
  }

  /**
   * [getEndatasProfileBy 通过简单的查询条件，获取相应的 EndataProfile Profile 信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IEnDataProfile[]>}   [description]
   */
  getEndatasProfileBy(query: any = {}): Observable<IEnDataProfile[]> {
     return this.searchEndatas(query,this.profileFields);
  }


  /**
   * 从单个的 能源设备 中继承相关的属性
   * @param  {IEndata}     endata [原始的 能源数采信息]
   * @param  {IEnsub} ensub [能耗设备信息]
   * @return {IEndata}        [新的 能耗数采信息]
   */
  newEndataByEnsub(endata: IEnergyData, ensub: IEnSub): EnergyData {
    let model = new EnergyData(endata);
    model.DeriveFromEnsub(ensub);
    return model;
  }

  /**
   * 在数据库中，创建新的能源数采信息
   * @param  {IEnergyData}             end [待创建的能源数采信息]
   * @return {Observable<IEnergyData>}   [新创建的能源数采信息]
   */
  createEndata(end: IEnergyData): Observable<IEnergyData> {
    return this.http
      .post<IEnergyData>(this.baseUrl, end)
      .pipe(
        tap(_ => this.log('fetched createEndata')),
        catchError(this.handleError<IEnergyData>('createEndata'))
      )
  }

  /**
   * [createEndataBy description]
   * @param  {any}               enAhs [edataelite and hs]
   * {
       en: xxx,
       hs: xxx,
   * }
   * @return {Observable<IEnergyData>}      [description]
   */
  createEndataBy(enAhs: any): Observable<IEnergyData> {
    const url = `${this.baseUrl}/by`;
    return this.http
      .post<IEnergyData>(url, enAhs)
      .pipe(
        tap(_ => this.log('fetched createEndataBy')),
        catchError(this.handleError<IEnergyData>('createEndataBy'))
      )
  }

  /**
   * 在数据库中，更新某个能源数采信息
   * @param  {IEnergyData}              en [待更新的能源数采信息]
   * @return {Observable<IEnergyData>}     [已更新的能源数采信息]
   */
  updatedEndata(en: IEnergyData): Observable<IEnergyData> {
    const url = `${this.baseUrl}/${en._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IEnergyData>(url, en, httpOptions)
      .pipe(
        tap(_ => this.log('fetched updatedEndata')),
        catchError(this.handleError<IEnergyData>('updatedEndata'))
      )
  }

  //新增patch方法
  patchEndata(id: string, patch: any): Observable<IEnergyData> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IEnergyData>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchEndata')),
        catchError(this.handleError<IEnergyData>('patchEndata'))
      )
  }

  /**
   * 在数据库中，删除某个能源采集数据
   * @param  {IEnergyData}          en [待删除的能源采集数据]
   * @return {Observable<void>}   [description]
   */
  deleteEndata(en: IEnergyData): Observable<IEnergyData> {
    const url = `${this.baseUrl}/${en._id}`;
    return this.http.delete<IEnergyData>(url)
      .pipe(
        tap(_ => this.log('fetched deleteEndata')),
        catchError(this.handleError<IEnergyData>('deleteEndata'))
      )
  }

}
