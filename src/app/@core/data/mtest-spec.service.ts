import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IMTestSpec, IMTestSpecElite } from '../model/mtest-spec'
import { IMclass } from '../model/mclass';
import { IMdef, IMdefElite } from '../model/mdef';
import {  IMlotElite, IMlotProfile, IMlot, Mlot} from '../model/mlot';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MTestSpecService implements IExistService {
  private baseUrl = '/api/materialTestSpecs';

  private eliteFields = '_id oid name ver';
  private profileFields = '_id oid name ver tester reason result loc hs';

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
    this.messageService.add(`MTestSpecService: ${message}`);
  }

  /**
   * 获取所有的物料测试信息
   * @return {Observable<IMTestSpec[]>} [物料测试 Array]
   */
  getMTestSpecs(field: string = '', sort: string = '-_id'): Observable<IMTestSpec[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IMTestSpec[]>(url)
      .pipe(
        tap(_ => this.log('fetched MTestSpecs')),
        catchError(this.handleError('getMTestSpecs', []))
      );
  }

  /**
   * 获取所有的物料测试关键信息
   * @return {Observable<IMTestSpecElite[]>} [物料批次关键信息Array]
   */
  getMTestSpecsElite(): Observable<IMTestSpecElite[]> {
    return this.getMTestSpecs(this.eliteFields);
  }

  /**
   * 根据 _id 获取单个物料批次
   * @param  {string}            id [物料批次的_id]
   * @return {Observable<IMTestSpec>}    [单个物料批次]
   */
  getMTestSpec(id: string): Observable<IMTestSpec> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IMTestSpec>(url)
      .pipe(
        tap(_ => this.log('fetched MTestSpec id=${id}')),
        catchError(this.handleError<IMTestSpec>('getMTestSpec'))
      );
  }

  /**
   * 过查询条件，获取 MTestSpec 信息
   * 当查询不到时，返回 undefined
   */
  getMTestSpecNo404<Data>(query: any): Observable<IMTestSpec> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IMTestSpec[]>(url)
      .pipe(
        map(MTestSpecs => MTestSpecs[0]), // returns a {0|1} element array
        tap(MTestSpec => {
          const outcome = MTestSpec ? `fetched` : `did not find`;
          this.log(`${outcome} MTestSpec _id=${qstr}`);
        }),
        catchError(this.handleError<IMTestSpec>(`getMTestSpec ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询 MTestSpecs，可设定查询的相关选项]
   * @param  {any}                      query [查询条件，key-value object]
   * @param  {string                =     ''}          field [查询返回的字段]
   * @param  {string                =     '-_id'}      sort  [排序字段]
   * @param  {number                =     0}           limit [查询返回的数量限制]
   * @param  {number                =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMTestSpec[]>}       [查询结果，MTestSpec 数组]
   */
  searchMTestSpecs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMTestSpec[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMTestSpec[]>(url)
      .pipe(
        tap(_ => this.log(`found MTestSpecs matching "${qstr}"`)),
        catchError(this.handleError<IMTestSpec[]>('searchMTestSpecs', []))
      );
  }

 /**
  * [通过过滤条件查询 MTestSpecs，可设定查询的相关选项]
  * @param  {any}                      query [查询条件，key-value object]
  * @param  {string                =     ''}          field [查询返回的字段]
  * @param  {string                =     '-_id'}      sort  [排序字段]
  * @param  {number                =     0}           limit [查询返回的数量限制]
  * @param  {number                =     0}           skip  [查询返回的数量限制]
  * @return {Observable<IMTestSpec[]>}       [查询结果，MTestSpec 数组]
  */
 searchMTestSpecsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMTestSpec[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMTestSpec[]>(url)
      .pipe(
        tap(_ => this.log(`found MTestSpecs matching "${query}"`)),
        catchError(this.handleError<IMTestSpec[]>('searchMTestSpecs', []))
      );
  }

  /**
   * 判断 MTestSpec 是否存在，根据 field 和 value
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
    return this.http.get<IMTestSpec[]>(url)
      .pipe(
        map(MTestSpecs => MTestSpecs[0]), // returns a {0|1} element array
        tap(MTestSpec => {
          const outcome = MTestSpec ? `fetched` : `did not find`;
          this.log(`${outcome} MTestSpec _id=${qstr}`);
        }),
        catchError(this.handleError<IMTestSpec>(`getMTestSpec ${qstr}`))
      );
  }

  /**
   * [判断物料测试是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的物料测试
   * @param  {IMTestSpec}             mt [待创建的物料测试]
   * @return {Observable<IMTestSpec>}    [新创建的物料测试]
   */
  createMTestSpec(mt: IMTestSpec): Observable<IMTestSpec> {
    return this.http
      .post<IMTestSpec>(this.baseUrl, mt, httpOptions)
      .pipe(
        tap((NewMTestSpec: IMTestSpec) => this.log(`added MTestSpec w/ id=${NewMTestSpec._id}`)),
        catchError(this.handleError<IMTestSpec>('createMTestSpec'))
      );
  }

  /**
   * 在数据库中，更新某个物料测试信息
   * @param  {IMTestSpec}             ml [待更新的物料测试]
   * @return {Observable<IMTestSpec>}    [更新后的物料测试]
   */
  updateMTestSpec(mt: IMTestSpec): Observable<IMTestSpec> {
    const url = `${this.baseUrl}/${mt._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IMTestSpec>(url, mt, httpOptions)
      .pipe(
        tap(_ => this.log(`updated MTestSpec id=${mt._id}`)),
        catchError(this.handleError<any>('updateMTestSpec'))
      );
  }

  patchMTestSpec(id: string, patch: any): Observable<IMTestSpec> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch MTestSpec id=${id}`)),
        catchError(this.handleError<any>('patchMTestSpec'))
      );
  }


  /**
   * 在数据库中，删除某个物料测试
   * @param  {IMTst}            mt [description]
   * @return {Observable<void>}    [description]
   */
  deleteMTestSpec(mt: IMTestSpec): Observable<IMTestSpec> {
    const url = `${this.baseUrl}/${mt._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IMTestSpec>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete MTestSpec id=${mt._id}`)),
        catchError(this.handleError<IMTestSpec>('deletePerson'))
      );
  }

}


