import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { ISingleEvent } from '../model/single-event';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SingleEventService implements IExistService {
  private baseUrl = '/api/singleEvents';

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
   * 获取所有的事件信息
   * @return {Observable<ISingleEvent[]>} [员工信息事件]
   */
  getSingleEvents(field: string = '', sort: string = 'oid'): Observable<ISingleEvent[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<ISingleEvent[]>(url)
      .pipe(
        tap(_ => this.log('fetched SingleEvents')),
        catchError(this.handleError('getSingleEvents', []))
      );
  }

  getSingleEventsNo404<Data>(query: any): Observable<ISingleEvent> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<ISingleEvent[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} SingleEvent _id=${qstr}`);
        }),
        catchError(this.handleError<ISingleEvent>(`getSingleEventNo404 ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个事件信息
   * @param  {string}              id [description]
   * @return {Observable<ISingleEvent>}    [description]
   */
  getSingleEvent(id: string): Observable<ISingleEvent> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ISingleEvent>(url)
      .pipe(
        tap(_ => this.log('fetched SingleEvent id=${id}')),
        catchError(this.handleError<ISingleEvent>('getSingleEvent'))
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
  searchSingleEvents(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<ISingleEvent[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<ISingleEvent[]>(url)
      .pipe(
        tap(_ => this.log(`found SingleEvents matching "${qstr}"`)),
        catchError(this.handleError<ISingleEvent[]>('searchSingleEvents', []))
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
  searchSingleEventsEncode(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<ISingleEvent[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<ISingleEvent[]>(url)
      .pipe(
        tap(_ => this.log(`found SingleEvents matching "${query}"`)),
        catchError(this.handleError<ISingleEvent[]>('searchSingleEvents', []))
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
    return this.http.get<ISingleEvent[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} SingleEvent _id=${qstr}`);
        }),
        catchError(this.handleError<ISingleEvent>(`getSingleEvent ${qstr}`))
      );
  }

  /**
   * [判断事件是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的事件信息
   * @param  {ISingleEvent}             p [待创建的事件信息]
   * @return {Observable<ISingleEvent>}   [新创建的事件信息]
   */
  createSingleEvent(se: ISingleEvent): Observable<ISingleEvent> {
    return this.http
      .post<ISingleEvent>(this.baseUrl, se, httpOptions)
      .pipe(
        tap((item: ISingleEvent) => this.log(`added SingleEvent w/ id=${item._id}`)),
        catchError(this.handleError<ISingleEvent>('createSingleEvent'))
      );
  }

  /**
  * 在数据库中，批量创建或更新事件信息
  * @param  {ISingleEvent[]}               [待创建的事件信息]
  * @return {Observable<ISingleEvent[]>}   [新创建的事件信息]
  */
  upsertSingleEvents(se: ISingleEvent[]): Observable<ISingleEvent[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<ISingleEvent[]>(url, se, httpOptions)
      .pipe(
        catchError(this.handleError<ISingleEvent[]>('upsertSingleEvents'))
      );
  }

  /**
   * [在数据库中，更新事件信息]
   * @param  {ISingleEvent}             se [description]
   * @return {Observable<ISingleEvent>}   [description]
   */
  updateSingleEvent(se: ISingleEvent): Observable<ISingleEvent> {
    const url = `${this.baseUrl}/${se._id}`;
    return this.http
      .put<ISingleEvent>(url, se, httpOptions)
      .pipe(
        tap(_ => this.log(`updated SingleEvent id=${se._id}`)),
        catchError(this.handleError<any>('updateSingleEvent'))
      );
  }

  //新增patch方法
  patchSingleEvent(id: string, patch: any): Observable<ISingleEvent> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch SingleEvent id=${id}`)),
        catchError(this.handleError<any>('patchSingleEvent'))
      );
  }

  /**
   * 在数据库中，删除某个事件信息
   * @param  {ISingleEvent}          se [待删除的事件信息n]
   * @return {Observable<void>}   [description]
   */
  deleteSingleEvent(se: ISingleEvent): Observable<ISingleEvent> {
    const id = typeof se === 'string' ? se : se._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<ISingleEvent>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete SingleEvent id=${id}`)),
        catchError(this.handleError<ISingleEvent>('deleteSingleEvent'))
      );
  }

}
