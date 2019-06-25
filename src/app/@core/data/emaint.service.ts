import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';

import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IEMaintElite, IEMaintProfile, IMOpLog, IEMaint, EMaint } from '../model/emaint';
import { IEquipment, IEquipmentElite } from '../model/equipment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EMaintService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/equipmentMaints';
  private eliteFields = '_id oid';
  private profileFields = '-prop -moplog';

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
    this.messageService.add(`EMaintService: ${message}`);
  }


  /**
   * [获取所有的设备维护信息]
   * @return {Observable<IEMaint[]>} [设备维护信息Array]
   */
  getEMaints(field: string = '', sort: string = '-_id'): Observable<IEMaint[]> {
   const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
   return this.http.get<IEMaint[]>(url)
      .pipe(
        tap(_ => this.log('fetcht getEMaints')),
        catchError(this.handleError<IEMaint[]>('getEMaints', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEMaintNo404<Data>(query: any): Observable<IEMaint> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEMaint[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} EMaint _id=${qstr}`);
        }),
        catchError(this.handleError<IEMaint>(`getEMaint ${qstr}`))
      );
  }

   /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEMaint[]>}       [查询结果，EMaint数组]
   */
  searchEMaint(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEMaint[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEMaint[]>(url)
      .pipe(
        tap(_ => this.log(`found EMaint matching "${qstr}"`)),
        catchError(this.handleError<IEMaint[]>('searchEMaint', []))
      );
  }

  /**
   * [通过过滤条件查询EMaint，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEMaint[]>}       [查询结果，EMaint数组]
   */
  searchEMaintEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEMaint[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEMaint[]>(url)
      .pipe(
        tap(_ => this.log(`found EMaint matching "${query}"`)),
        catchError(this.handleError<IEMaint[]>('searchEMaint', []))
      );
  }

    /**
   * [getNewIEMaint 从数据库获取一个全新的IEMaint,自带 _id]
   * @return {Observable<IEMaint>} [description]
   */
  getNewEMaint(): Observable<IEMaint> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEMaint>(url)
      .pipe(
        tap(_ => this.log('fetcht new EquipmentMaint')),
        catchError(this.handleError<IEMaint>('getNewEMaint'))
      )
  }

  /**
   * [根据 _id 获取单个设备维护信息]
   * @param  {string}                    id [设备维护的_id]
   * @return {Observable<IEMaint>}    [单个设备维护信息]
   */
  getEMaint(id: string): Observable<IEMaint> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEMaint>(url)
      .pipe(
        tap(_ => this.log('fetcht getEMaint')),
        catchError(this.handleError<IEMaint>('getEMaint'))
      )
  }

  /**
   * [获取所有的设备维护关键信息]
   * @return {Observable<IEMaintElite[]>} [设备维护关键信息Array]
   */
  getEMaintsElite(): Observable<IEMaintElite[]> {
    return this.getEMaints(this.eliteFields);
  }

  /**
   * [getIEMaintsProfile 获取所有的设备维护 Profile 信息]
   * @return {Observable<IEMaintProfile[]>} [description]
   */
  getEMaintsProfile(): Observable<IEMaintProfile[]> {
    return this.getEMaints(this.profileFields);
  }



  // /**
  //  * [根据 _id 获取单个设备维护的详细信息，即维护日志]
  //  * @param  {string}            id [description]
  //  * @return {Observable<IMOpLog>}    [description]
  //  */
  // getMOpLog(id: string): Observable<IMOpLog> {
  //   const url = `${this.baseUrl}/MOpLog/${id}`;
  //   return this.http.get(url)
  //     .map((res: Response) => res.json())
  //     .catch(handleError);
  // }

  /**
   * [getEMaintsByQuery 通过简单的查询条件，获取相应的设备维护信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IEMaint[]>}   [description]
   */
  getEMaintsBy(query: any = {}): Observable<IEMaint[]> {
    return this.searchEMaint(query);
  }

  /**
   * [getEMaintsEliteBy 通过简单的查询条件，获取相应的设备维护关键信息]
   * @param  {any                           = {}}        query [description]
   * @return {Observable<IEMaintElite[]>}   [description]
   */
  getEMaintsEliteBy(query: any = {}): Observable<IEMaintElite[]> {
    return this.searchEMaint(query,this.eliteFields);
  }

  /**
   * [getEMaintsProfileBy 通过简单的查询条件，获取相应的设备维护 Profile 信息]
   * @param  {any                      = {}}        query [description]
   * @return {Observable<IEMaintProfile[]>}   [description]
   */
  getEMaintsProfileBy(query: any = {}): Observable<IEMaintProfile[]> {
    return this.searchEMaint(query,this.profileFields);

  }

  getEMaintBy(query: any = {}): Observable<IEMaint> {
    return this.getEMaintNo404(query);
  }

  /**
   * [判断Emaint是否存在，根据 field 和 value]
   * @param  {any}           query [description]
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
    return this.http.get<IEMaint[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} IEMaint _id=${qstr}`);
        }),
        catchError(this.handleError<IEMaint>(`getIEMaint ${qstr}`))
      );
  }

  /**
   * [判断设备维护名称是否存在，根据 field 和 value]
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
   * [在数据库中，创建新的设备维护信息]
   * @param  {IWorkResponse}             em [待创建的设备维护信息]
   * @return {Observable<IEMaint>}    [新创建的设备维护信息]
   */
  createEmaint(em: IEMaint): Observable<IEMaint> {
    //这里不能删除JobResponse 的 _id 属性，因为这里只是一个关联
    return this.http
      .post<IEMaint>(this.baseUrl, em, httpOptions)
      .pipe(
        tap((NewEMaint: IEMaint) => this.log(`added EMaint w/ id=${NewEMaint._id}`)),
        catchError(this.handleError<IEMaint>('createEmaint'))
      )
  }

/**
 * [createEmaintBy description]
 * @param  {IEMaintElite}        e [description]
 * @return {Observable<IEMaint>}   [description]
 */
  createEmaintBy(e: IEMaintElite): Observable<IEMaint> {
    const url = `${this.baseUrl}/by`;
    return this.http
      .post<IEMaint>(url, e, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht createEmaintBy')),
        catchError(this.handleError<IEMaint>('createEmaintBy'))
      )
  }

  /**
   * [在数据库中，更新某个设备维护信息]
   * @param  {IEMaint}             em [待更新的设备维护信息]
   * @return {Observable<IEMaint>}    [已更新的设备维护信息]
   */
  updateEmaint(em: IEMaint): Observable<IEMaint> {
    const url = `${this.baseUrl}/${em._id}`;
    return this.http
      .put<IEMaint>(url, em, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht updateEmaint')),
        catchError(this.handleError<IEMaint>('updateEmaint'))
      )
  }

/**
 * [新增patch方法，用于更新设备维护信息]
 * @param  {string}                    id    [description]
 * @param  {any}                       patch [description]
 * @return {Observable<IEMaint>}       [description]
 */
  patchEMaint(id:string, patch:any): Observable<IEMaint> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IEMaint>(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht patchEMaint')),
        catchError(this.handleError<IEMaint>('patchEMaint'))
      )
  }

  /**
   * [在数据库中，删除某个设备维护信息]
   * @param  {IEMaint}    em [待删除的设备维护信息]
   * @return {Observable<void>}    [description]
   */
  deleteEMaint(em: IEMaint): Observable<IEMaint> {
    const url = `${this.baseUrl}/${em._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IEMaint>(url)
      .pipe(
        tap(_ => this.log(`deleteEMaint id=${em._id}`)),
        catchError(this.handleError<IEMaint> ('deleteEMaint'))
      );
  }


    /**
   * 从单个的 Equipment 中继承相关的属性
   * @param  {IEMaint}     es [原始的设备作业批次]
   * @param  {IEquipment} e  [设备信息]
   * @return {IEMaint}        [新的设备作业]
   */
  newEMaintByequip(em: IEMaint, e: IEquipment): EMaint {
    let model = new EMaint(em);
    model.DeriveFromEdef(e);
    return model;
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
