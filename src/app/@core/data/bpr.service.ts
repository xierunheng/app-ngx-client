import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IBPR } from '../model/bpr';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BPRService implements IExistService {
  private baseUrl = '/api/batchProductionRecords';

  private eliteFields = '_id oid ';
  private profileFields = '_id oid ';

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
    this.messageService.add(`SingleEventService: ${message}`);
  }

  /**
   * 获取所有的员工信息
   * @return {Observable<IPerson[]>} [员工信息Array]
   */
  getBPRs(field: string = '', sort: string = 'oid'): Observable<IBPR[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IBPR[]>(url)
      .pipe(
        tap(_ => this.log('fetched BPRs')),
        catchError(this.handleError('getBPRs', []))
      );
  }

  getBPRsNo404<Data>(query: any): Observable<IBPR> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IBPR[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} BPR _id=${qstr}`);
        }),
        catchError(this.handleError<IBPR>(`getBPRsNo404 ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个员工信息
   * @param  {string}              id [description]
   * @return {Observable<IPerson>}    [description]
   */
  getBPR(id: string): Observable<IBPR> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IBPR>(url)
      .pipe(
        tap(_ => this.log('fetched BPR id=${id}')),
        catchError(this.handleError<IBPR>('getBPR'))
      );
  }

  /**
   * [通过过滤条件查询SingleEvents，可设定查询的相关选项]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<ISample[]>}       [查询结果，Person 数组]
   */
  searchBPRs(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<IBPR[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IBPR[]>(url)
      .pipe(
        tap(_ => this.log(`found BPRs matching "${qstr}"`)),
        catchError(this.handleError<IBPR[]>('searchBPRs', []))
      );
  }

  /**
   * [通过过滤条件查询SingleEvents，可设定查询的相关选项]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<ISingleEvent[]>}       [查询结果，Person 数组]
   */
  searchBPRsEncode(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<IBPR[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IBPR[]>(url)
      .pipe(
        tap(_ => this.log(`found BPRs matching "${query}"`)),
        catchError(this.handleError<IBPR[]>('searchBPRs', []))
      );
  }

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
    return this.http.get<IBPR[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} BPR _id=${qstr}`);
        }),
        catchError(this.handleError<IBPR>(`getBPR ${qstr}`))
      );
  }

  /**
   * [判断员工是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的员工信息
   * @param  {IBPR}             p [待创建的员工信息]
   * @return {Observable<IBPR>}   [新创建的员工信息]
   */
  createSingleEvent(p: IBPR): Observable<IBPR> {
    return this.http
      .post<IBPR>(this.baseUrl, p, httpOptions)
      .pipe(
        tap((item: IBPR) => this.log(`added BPR w/ id=${item._id}`)),
        catchError(this.handleError<IBPR>('createBPR'))
      );
  }

  /**
  * 在数据库中，批量创建或更新员工信息
  * @param  {ISample[]}               [待创建的员工信息]
  * @return {Observable<ISingleEvent[]>}   [新创建的员工信息]
  */
  upsertBPRs(ps: IBPR[]): Observable<IBPR[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<IBPR[]>(url, ps, httpOptions)
      .pipe(
        catchError(this.handleError<IBPR[]>('upsertBPRs'))
      );
  }

  /**
   * [在数据库中，更新员工信息]
   * @param  {ISample}             p [description]
   * @return {Observable<ISample>}   [description]
   */
  updateBPR(p: IBPR): Observable<IBPR> {
    const url = `${this.baseUrl}/${p._id}`;
    return this.http
      .put<IBPR>(url, p, httpOptions)
      .pipe(
        tap(_ => this.log(`updated BPR id=${p._id}`)),
        catchError(this.handleError<any>('updateBPR'))
      );
  }

  //新增patch方法
  patchBPR(id: string, patch: any): Observable<IBPR> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch BPR id=${id}`)),
        catchError(this.handleError<any>('patchBPR'))
      );
  }

  /**
   * 在数据库中，删除某个员工信息
   * @param  {IBPR}          p [待删除的员工信息n]
   * @return {Observable<BPR>}   [description]
   */
  deleteBPR(p: IBPR): Observable<IBPR> {
    const id = typeof p === 'string' ? p : p._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IBPR>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete BPR id=${id}`)),
        catchError(this.handleError<IBPR>('deleteBPR'))
      );
  }

}
