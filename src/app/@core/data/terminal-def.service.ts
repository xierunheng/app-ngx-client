import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { SocketService } from '../socket/socket.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { UtilData } from './util.service';
import { GlobalData } from '../model/global';
import { ITerminalDef } from '../model/terminal-def';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TerminalDefService implements IExistService {
  private baseUrl = '/api/terminalDefinitions';

  private eliteFields = '_id oid ';
  private profileFields = '_id oid ps hs category size resolution ';

  // static parameters = [Http, SocketService];
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
    this.messageService.add(`TerminalDefService: ${message}`);
  }

  /**
   * 获取所有的paclass信息
   * @return {Observable<IPaclass[]>} [paclass Array]
   */
  getTerminalDefs(field: string = '', sort: string = '-_id'): Observable<ITerminalDef[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<ITerminalDef[]>(url)
      .pipe(
        tap(_ => this.log('fetched TerminalDefs')),
        catchError(this.handleError('getTerminalDefs', []))
      );
  }

  /**
   * 通过查询条件，获取paclass信息
   * 当查询不到时，返回 undefined
   */
  getTerminalDefNo404<Data>(query: any): Observable<ITerminalDef> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<ITerminalDef[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} TerminalDef ${qstr}`);
        }),
        catchError(this.handleError<ITerminalDef>(`getTerminalDefNo404 ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个层级信息
   * @param  {number}                     id [层级的 _id]
   * @return {Observable<ITerminalDef>}    [单个层级信息]
   */
  getTerminalDef(id: string): Observable<ITerminalDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ITerminalDef>(url)
      .pipe(
        tap(_ => this.log('fetch TerminalDef id=${id}')),
        catchError(this.handleError<ITerminalDef>('getTerminalDef'))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<ITerminalDef[]>}       [查询结果，hs数组]
   */
  searchTerminalDefs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<ITerminalDef[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<ITerminalDef[]>(url)
      .pipe(
        tap(_ => this.log(`found TerminalDefs matching "${qstr}"`)),
        catchError(this.handleError<ITerminalDef[]>('searchTerminalDefs', []))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<ITerminalDef[]>}       [查询结果，hs数组]
   */
  searchTerminalDefsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<ITerminalDef[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<ITerminalDef[]>(url)
      .pipe(
        tap(_ => this.log(`found TerminalDef matching "${query}"`)),
        catchError(this.handleError<ITerminalDef[]>('searchTerminalDefsEncode', []))
      );
  }

  /**
 * [判断层级结构是否存在，根据 field 和 value]
 * @param  {string}           field [description]
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
    return this.http.get<ITerminalDef[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `exist` : `did not exist`;
          this.log(`${outcome} TerminalDef _id=${qstr}`);
        }),
        catchError(this.handleError<ITerminalDef>(`exist ${qstr}`))
      );
  }

  /**
   * [判断物料类型是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的层级信息
   * @param  {ITerminalDef}             item [待创建的层级信息]
   * @return {Observable<ITerminalDef>}    [新创建的层级信息]
   */
  createTerminalDef(item: ITerminalDef): Observable<ITerminalDef> {
    console.log(item);
    return this.http
      .post<ITerminalDef>(this.baseUrl, item, httpOptions)
      .pipe(
        tap((rnItem: ITerminalDef) => this.log(`added TerminalDef w/ id=${rnItem._id}`)),
        catchError(this.handleError<ITerminalDef>('createTerminalDef'))
      );
  }

  /**
   * 在数据库中，更新某个层级信息
   * @param  {ITerminalDef}             item [待更新的层级信息]
   * @return {Observable<ITerminalDef>}    [已更新的层级信息]
   */
  updateTerminalDef(item: ITerminalDef): Observable<any> {
    const url = `${this.baseUrl}/${item._id}`;
    return this.http
      .put(url, item, httpOptions)
      .pipe(
        tap(_ => this.log(`updated TerminalDef id=${item._id}`)),
        catchError(this.handleError<any>('updateTerminalDef'))
      );
  }

  patchTerminalDef(id: string, patch: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch TerminalDef id=${id}`)),
        catchError(this.handleError<any>('patchTerminalDef'))
      );
  }

  /**
   * 在数据库中，删除某个层级信息
   * @param  {ITerminalDef}   item [待删除的层级信息]
   * @return {Observable<void>}    [description]
   */
  deleteTerminalDef(item: ITerminalDef | string): Observable<ITerminalDef> {
    const id = typeof item === 'string' ? item : item._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<ITerminalDef>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete TerminalDef id=${id}`)),
        catchError(this.handleError<ITerminalDef>('deleteTerminalDef'))
      );
  }

}
