import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { ISample } from '../model/sample';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class SampleService implements IExistService {
  private baseUrl = '/api/samples';

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
  getSamples(field: string = '', sort: string = 'oid'): Observable<ISample[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<ISample[]>(url)
      .pipe(
        tap(_ => this.log('fetched Samples')),
        catchError(this.handleError('getSamples', []))
      );
  }

  getSamplesNo404<Data>(query: any): Observable<ISample> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<ISample[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} Sample _id=${qstr}`);
        }),
        catchError(this.handleError<ISample>(`getSampleNo404 ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个员工信息
   * @param  {string}              id [description]
   * @return {Observable<IPerson>}    [description]
   */
  getSample(id: string): Observable<ISample> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ISample>(url)
      .pipe(
        tap(_ => this.log('fetched Sample id=${id}')),
        catchError(this.handleError<ISample>('getSample'))
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
  searchSamples(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<ISample[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<ISample[]>(url)
      .pipe(
        tap(_ => this.log(`found Samples matching "${qstr}"`)),
        catchError(this.handleError<ISample[]>('searchSamples', []))
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
  searchSamplesEncode(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<ISample[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<ISample[]>(url)
      .pipe(
        tap(_ => this.log(`found Samples matching "${query}"`)),
        catchError(this.handleError<ISample[]>('searchSamples', []))
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
    return this.http.get<ISample[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} Sample _id=${qstr}`);
        }),
        catchError(this.handleError<ISample>(`getSample ${qstr}`))
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
   * @param  {ISingleEvent}             p [待创建的员工信息]
   * @return {Observable<ISingleEvent>}   [新创建的员工信息]
   */
  createSingleEvent(p: ISample): Observable<ISample> {
    return this.http
      .post<ISample>(this.baseUrl, p, httpOptions)
      .pipe(
        tap((item: ISample) => this.log(`added SingleEvent w/ id=${item._id}`)),
        catchError(this.handleError<ISample>('createSample'))
      );
  }

  /**
  * 在数据库中，批量创建或更新员工信息
  * @param  {ISample[]}               [待创建的员工信息]
  * @return {Observable<ISingleEvent[]>}   [新创建的员工信息]
  */
  upsertSingleEvents(ps: ISample[]): Observable<ISample[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<ISample[]>(url, ps, httpOptions)
      .pipe(
        catchError(this.handleError<ISample[]>('upsertSamples'))
      );
  }

  /**
   * [在数据库中，更新员工信息]
   * @param  {ISample}             p [description]
   * @return {Observable<ISample>}   [description]
   */
  updateSample(p: ISample): Observable<ISample> {
    const url = `${this.baseUrl}/${p._id}`;
    return this.http
      .put<ISample>(url, p, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Sample id=${p._id}`)),
        catchError(this.handleError<any>('updateSample'))
      );
  }

  //新增patch方法
  patchSample(id: string, patch: any): Observable<ISample> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Sample id=${id}`)),
        catchError(this.handleError<any>('patchSample'))
      );
  }

  /**
   * 在数据库中，删除某个员工信息
   * @param  {ISample}          p [待删除的员工信息n]
   * @return {Observable<void>}   [description]
   */
  deleteSample(p: ISample): Observable<ISample> {
    const id = typeof p === 'string' ? p : p._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<ISample>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Sample id=${id}`)),
        catchError(this.handleError<ISample>('deleteSample'))
      );
  }

}
