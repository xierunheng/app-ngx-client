import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { QTest, IQTest, IQTestElite, QTestElite } from '../model/qtest-spec';
import { IPclass } from '../model/pclass';
import { IPerson, IPersonElite } from '../model/person';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class QTestService implements IExistService {
  private baseUrl = '/api/qualificationTestSpecs';

  private eliteFields = '_id oid';
  private profileFields = '_id oid';

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
    this.messageService.add(`QTestService: ${message}`);
  }

  /**
   * 获取所有的员工资质检测信息
   * @return {Observable<IQTest[]>} [员工资质检测 Array]
   */
  getQTests(field: string = '', sort: string = '-_id'): Observable<IQTest[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IQTest[]>(url)
      .pipe(
        tap(_ => this.log('fetched QTests')),
        catchError(this.handleError('getQTests', []))
      );
  }

  /**
   * 获取所有的员工资质检测关键信息
   * @return {Observable<IQTestElite[]>} [员工资质检测关键信息Array]
   */
  getQTestsElite(): Observable<IQTestElite[]> {
    return this.getQTests(this.eliteFields);
  }


  /**
   * 根据 _id 获取单个员工资质检测
   * @param  {string}            id [员工资质检测的_id]
   * @return {Observable<IQTest>}    [单个员工资质检测]
   */
  getQTest(id: string): Observable<IQTest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IQTest>(url)
      .pipe(
        tap(_ => this.log('fetched QTest id=${id}')),
        catchError(this.handleError<IQTest>('getQTest'))
      );
  }

  /**
   * 通过查询条件，获取 QTest 信息
   * 当查询不到时，返回 undefined
   */
  getQTestsNo404<Data>(query: any): Observable<IQTest> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IQTest[]>(url)
      .pipe(
        map(QTests => QTests[0]), // returns a {0|1} element array
        tap(QTest => {
          const outcome = QTest ? `fetched` : `did not find`;
          this.log(`${outcome} QTest _id=${qstr}`);
        }),
        catchError(this.handleError<IQTest>(`getQTests ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询QTests，可设定查询的相关选项]
   * @param  {any}                  query [查询条件，key-value object]
   * @param  {string            =     ''}          field [查询返回的字段]
   * @param  {string            =     '-_id'}      sort  [排序字段]
   * @param  {number            =     0}           limit [查询返回的数量限制]
   * @param  {number            =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IQTest[]>}       [查询结果，QTest数组]
   */
  searchQTests(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IQTest[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IQTest[]>(url)
      .pipe(
        tap(_ => this.log(`found QTests matching "${qstr}"`)),
        catchError(this.handleError<IQTest[]>('searchQTests', []))
      );
  }

  /**
   * [通过过滤条件查询QTests，可设定查询的相关选项]
   * @param  {any}                  query [查询条件，key-value object]
   * @param  {string            =     ''}          field [查询返回的字段]
   * @param  {string            =     '-_id'}      sort  [排序字段]
   * @param  {number            =     0}           limit [查询返回的数量限制]
   * @param  {number            =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IQTest[]>}       [查询结果，QTest数组]
   */
  searchQTestsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IQTest[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IQTest[]>(url)
      .pipe(
        tap(_ => this.log(`found QTests matching "${query}"`)),
        catchError(this.handleError<IQTest[]>('searchQTests', []))
      );
  }


  /**
   * [判断员工资质检测是否存在，根据 field 和 value]
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
    return this.http.get<IQTest[]>(url)
      .pipe(
        map(QTests => QTests[0]), // returns a {0|1} element array
        tap(QTest => {
          const outcome = QTest ? `fetched` : `did not find`;
          this.log(`${outcome} QTest _id=${qstr}`);
        }),
        catchError(this.handleError<IQTest>(`getQTest ${qstr}`))
      );
  }

  /**
   * [判断员工资质检测是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的设备性能检测
   * @param  {IQTest}             mt [待创建的设备性能检测]
   * @return {Observable<IQTest>}    [新创建的设备性能检测]
   */
  createQTest(qt: IQTest): Observable<IQTest> {
    return this.http
      .post<IQTest>(this.baseUrl, qt, httpOptions)
      .pipe(
        tap((NewQTest: IQTest) => this.log(`added QTest w/ id=${NewQTest._id}`)),
        catchError(this.handleError<IQTest>('createQTest'))
      );
  }

  /**
   * 在数据库中，更新某个员工资质检测信息
   * @param  {IQTest}             qt [待更新的设备性能检测]
   * @return {Observable<IQTest>}    [更新后的设备性能检测]
   */
  updateQTest(qt: IQTest): Observable<IQTest> {
    const url = `${this.baseUrl}/${qt._id}`;
    return this.http
      .put<IQTest>(url, qt, httpOptions)
      .pipe(
        tap(_ => this.log(`updated QTest id=${qt._id}`)),
        catchError(this.handleError<any>('updateQTest'))
      );
  }

  patchQTest(id: string, patch: any): Observable<IQTest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch QTest id=${id}`)),
        catchError(this.handleError<any>('patchQTest'))
      );
  }


  /**
   * 在数据库中，删除某个员工资质检测
   * @param  {IQTest}            qt [description]
   * @return {Observable<void>}    [description]
   */
  deleteQTest(ecapt: IQTest): Observable<IQTest> {
    const id = typeof ecapt === 'string' ? ecapt : ecapt._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IQTest>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete QTest id=${id}`)),
        catchError(this.handleError<IQTest>('deleteQTest'))
      );
  }

}


