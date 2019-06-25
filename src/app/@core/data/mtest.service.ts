import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IMTest, IMTestElite } from '../model/mtest'
import { IMclass } from '../model/mclass';
import { IMdef, IMdefElite } from '../model/mdef';
import { IMlotElite, IMlotProfile, IMlot, Mlot} from '../model/mlot';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MTestService implements IExistService {
  private baseUrl = '/api/materialTests';

  private eliteFields = '_id oid';
  private profileFields = '_id oid mtSpec';

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
    this.messageService.add(`MTestService: ${message}`);
  }

  /**
   * 获取所有的物料测试信息
   * @return {Observable<IMTest[]>} [物料测试 Array]
   */
  getMTests(field: string = '', sort: string = '-_id'): Observable<IMTest[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IMTest[]>(url)
      .pipe(
        tap(_ => this.log('fetched MTests')),
        catchError(this.handleError('getMTests', []))
      );
  }

  /**
   * 获取所有的物料测试关键信息
   * @return {Observable<IMTestElite[]>} [物料批次关键信息Array]
   */
  getMTestsElite(): Observable<IMTestElite[]> {
    return this.getMTests(this.eliteFields);
  }


  /**
   * 根据 _id 获取单个物料批次
   * @param  {string}            id [物料批次的_id]
   * @return {Observable<IMTest>}    [单个物料批次]
   */
  getMTest(id: string): Observable<IMTest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IMTest>(url)
      .pipe(
        tap(_ => this.log('fetched MTest id=${id}')),
        catchError(this.handleError<IMTest>('getMTest'))
      );
  }

  /**
   * 通过查询条件，获取 MTest 信息
   * 当查询不到时，返回 undefined
   */
  getMTestsNo404<Data>(query: any): Observable<IMTest> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IMTest[]>(url)
      .pipe(
        map(MTests => MTests[0]), // returns a {0|1} element array
        tap(MTest => {
          const outcome = MTest ? `fetched` : `did not find`;
          this.log(`${outcome} MTest _id=${qstr}`);
        }),
        catchError(this.handleError<IMTest>(`getMTest ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询 MTests，可设定查询的相关选项]
   * @param  {any}                  query [查询条件，key-value object]
   * @param  {string            =     ''}          field [查询返回的字段]
   * @param  {string            =     '-_id'}      sort  [排序字段]
   * @param  {number            =     0}           limit [查询返回的数量限制]
   * @param  {number            =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMTest[]>}       [查询结果，MTest 数组]
   */
  searchMTests(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMTest[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMTest[]>(url)
      .pipe(
        tap(_ => this.log(`found MTests matching "${qstr}"`)),
        catchError(this.handleError<IMTest[]>('searchMTests', []))
      );
  }

  /**
   * [通过过滤条件查询 MTests，可设定查询的相关选项]
   * @param  {any}                  query [查询条件，key-value object]
   * @param  {string            =     ''}          field [查询返回的字段]
   * @param  {string            =     '-_id'}      sort  [排序字段]
   * @param  {number            =     0}           limit [查询返回的数量限制]
   * @param  {number            =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMTest[]>}       [查询结果，MTest 数组]
   */
  searchMTestsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMTest[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMTest[]>(url)
      .pipe(
        tap(_ => this.log(`found MTests matching "${query}"`)),
        catchError(this.handleError<IMTest[]>('searchMTests', []))
      );
  }

  /**
   * 判断 MTest 是否存在，根据 field 和 value
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
    return this.http.get<IMTest[]>(url)
      .pipe(
        map(MTests => MTests[0]), // returns a {0|1} element array
        tap(MTest => {
          const outcome = MTest ? `fetched` : `did not find`;
          this.log(`${outcome} MTest _id=${qstr}`);
        }),
        catchError(this.handleError<IMTest>(`getMTest ${qstr}`))
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
  createMTest(mt: IMTest): Observable<IMTest> {
    return this.http
      .post<IMTest>(this.baseUrl, mt, httpOptions)
      .pipe(
        tap((NewMTest: IMTest) => this.log(`added MTest w/ id=${NewMTest._id}`)),
        catchError(this.handleError<IMTest>('createMTest'))
      );
  }

  /**
   * 在数据库中，更新某个物料测试信息
   * @param  {IMTestSpec}             ml [待更新的物料测试]
   * @return {Observable<IMTestSpec>}    [更新后的物料测试]
   */
  updateMTest(mt: IMTest): Observable<IMTest> {
    const url = `${this.baseUrl}/${mt._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IMTest>(url, mt, httpOptions)
      .pipe(
        tap(_ => this.log(`updated MTest id=${mt._id}`)),
        catchError(this.handleError<IMTest>('updateMTest'))
      );
  }

  patchMTest(id: string, patch: any): Observable<IMTest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch MTest id=${id}`)),
        catchError(this.handleError<any>('patchMTest'))
      );
  }

  /**
   * 在数据库中，删除某个物料测试
   * @param  {IMTst}            mt [description]
   * @return {Observable<void>}    [description]
   */
  deleteMTest(mt: IMTest): Observable<IMTest> {
    const id = typeof mt === 'string' ? mt : mt._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IMTest>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete MTest id=${id}`)),
        catchError(this.handleError<IMTest>('deleteMTest'))
      );
  }

  /**
   * [根据前缀获取下一个 物料检验号]
   * @param  {string}             prex [description]
   * @return {Observable<string>}      [description]
   */
  getNextOid(prex: string): Observable<string> {
    const url = `${this.baseUrl}/next/${prex}`;
    return this.http.get<string>(url, httpOptions)
      .pipe(
        catchError(this.handleError<string>('getNextOid'))
      );
  }
}


