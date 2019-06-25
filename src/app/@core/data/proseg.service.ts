import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IProsegElite, IProseg } from '../model/proseg';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ProsegService implements IExistService {
  private baseUrl = '/api/processSegments';

  private eliteFields = '_id oid code no';
  private profileFields = '-pSpec -eSpec -mSpec -para -dep -ps';

  constructor(private http: HttpClient,
    private messageService: MessageService) {
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
    this.messageService.add(`HsService: ${message}`);
  }

  /**
   * [从 server 获取新的 _id]
   * @return {Observable<string>} [description]
   */
  getNewID(): Observable<string> {
    const url = `${this.baseUrl}/newid`;
    return this.http.get<string>(url)
      .pipe(
        tap(_ => this.log('fetched NewID')),
        catchError(this.handleError<string>('getNewID'))
      );
  }

  /**
   * 获取所有的工艺段信息
   * @return {Observable<IProseg[]>} [工艺段信息Array]
   */
  getProsegs(field: string = '', sort: string = '-_id'): Observable<IProseg[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IProseg[]>(url)
      .pipe(
        tap(_ => this.log('fetched pss')),
        catchError(this.handleError('getProsegs', []))
      );
  }

  /** GET Proseg by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getProsegNo404<Data>(query: any): Observable<IProseg> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IProseg[]>(url)
      .pipe(
        map(hss => hss[0]), // returns a {0|1} element array
        tap(hs => {
          const outcome = hs ? `fetched` : `did not find`;
          this.log(`${outcome} hs _id=${qstr}`);
        }),
        catchError(this.handleError<IProseg>(`getProseg ${qstr}`))
      );
  }

  /**
   * [getNewProseg 从数据库获取一个全新的 Proseg,自带 _id]
   * @return {Observable<IProseg>} [description]
   */
  getNewProseg(): Observable<IProseg> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IProseg>(url)
      .pipe(
        tap(_ => this.log('fetch new ps ')),
        catchError(this.handleError<IProseg>('getNewProseg'))
      );
  }

  /**
   * 根据 _id 获取单个工艺段信息
   * @param  {string}              id [工艺段的_id]
   * @return {Observable<IProseg>}    [单个工艺段信息]
   */
  getProseg(id: string): Observable<IProseg> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IProseg>(url)
      .pipe(
        tap(_ => this.log('fetch Proseg id=${id}')),
        catchError(this.handleError<IProseg>('getProseg'))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IHierarchyScope[]>}       [查询结果，hs数组]
   */
  searchProsegs(query: any, field: string = '', sort: string = 'no', limit: number = 0, skip: number = 0): Observable<IProseg[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IProseg[]>(url)
      .pipe(
        tap(_ => this.log(`found Prosegs matching "${qstr}"`)),
        catchError(this.handleError<IProseg[]>('searchProsegs', []))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IHierarchyScope[]>}       [查询结果，hs数组]
   */
  searchProsegsEncode(query: any, field: string = '', sort: string = 'no', limit: number = 0, skip: number = 0): Observable<IProseg[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IProseg[]>(url)
      .pipe(
        tap(_ => this.log(`found Prosegs matching "${query}"`)),
        catchError(this.handleError<IProseg[]>('searchProsegs', []))
      );
  }


  getProsegBy(query: any = {}): Observable<IProseg> {
    return this.getProsegNo404(query);
  }

  /**
   * 通过工艺段的 _id 数组 获取 工艺段 数组
   * @param  {string[]}              ids [工艺段的 _id 数组]
   * @return {Observable<IProseg[]>}     [工艺段 数组]
   */
  getManyProsegs(ids: string[]): Observable<IProseg[]> {
    return this.searchProsegsEncode({ _id: { $in: ids } });
  }

  /**
   * [getProsegsByQuery 通过简单的查询条件，获取相应的工艺段信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IProseg[]>}   [description]
   */
  getProsegsBy(query: any = {}): Observable<IProseg[]> {
    return this.searchProsegs(query);
  }

  /**
   * [getProsegsElite获取相应的工艺段关键信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IProsegElite[]>}   [description]
   */
  getProsegsElite(query: any = {}): Observable<IProsegElite[]> {
    return this.getProsegs(this.eliteFields);
  }

  /**
   * [getProsegsProfile获取相应的工艺段 Profile 信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IProseg[]>}   [description]
   */
  getProsegsProfile(query: any = {}): Observable<IProseg[]> {
    return this.getProsegs(this.profileFields);
  }

  /**
   * [getProsegsEliteBy 通过简单的查询条件，获取相应的工艺段关键信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IProsegElite[]>}   [description]
   */
  getProsegsEliteBy(query: any = {}): Observable<IProsegElite[]> {
    return this.searchProsegs(query, this.eliteFields);
  }

  /**
   * [getProsegsProfileBy 通过简单的查询条件，获取相应的工艺段 Profile 信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IProseg[]>}   [description]
   */
  getProsegsProfileBy(query: any = {}): Observable<IProseg[]> {
    return this.searchProsegs(query, this.profileFields);
  }

  // getProsegByOid(oid: string): Observable<IProseg> {
  //   const url = `${this.baseUrl}/oid/${oid}`;
  //   return this.http.get(url)
  //     .map((res: Response) => res.json())
  //     .catch(handleError);
  // }

  /**
   * [判断操作段是否存在，根据 field 和 value]
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
    return this.http.get<IProseg[]>(url)
      .pipe(
        map(Prosegs => Prosegs[0]), // returns a {0|1} element array
        tap(Proseg => {
          const outcome = Proseg ? `fetched` : `did not find`;
          this.log(`${outcome} Proseg _id=${qstr}`);
        }),
        catchError(this.handleError<IProseg>(`getProseg ${qstr}`))
      );
  }

  /**
   * [判断操作段是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的工艺段信息
   * @param  {IProseg}             ps [待创建的工艺段信息]
   * @return {Observable<IProseg>}    [新创建的工艺段信息]
   */
  createProseg(ps: IProseg): Observable<IProseg> {
    return this.http
      .post<IProseg>(this.baseUrl, ps, httpOptions)
      .pipe(
        tap((newProseg: IProseg) => this.log(`added ps w/ id=${newProseg._id}`)),
        catchError(this.handleError<IProseg>('createProseg'))
      );
  }

  /**
   * [在数据库中，更新工艺段信息]
   * @param  {IProseg}             ps [description]
   * @return {Observable<IProseg>}    [description]
   */
  updateProseg(ps: IProseg): Observable<IProseg> {
    const url = `${this.baseUrl}/${ps._id}`;
    return this.http
      .put(url, ps, httpOptions)
      .pipe(
        tap(_ => this.log(`updated ps id=${ps._id}`)),
        catchError(this.handleError<any>('updateProseg'))
      );
  }

  patchProseg(id: string, patch: any): Observable<IProseg> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch ps id=${id}`)),
        catchError(this.handleError<any>('patchProseg'))
      );
  }

  /**
   * 在数据库中，删除某个工艺段信息
   * @param  {IProseg}          ps [待删除的工艺段信息]
   * @return {Observable<void>}    [description]
   */
  deleteProseg(ps: IProseg): Observable<IProseg> {
    const id = typeof ps === 'string' ? ps : ps._id;
    const url = `${this.baseUrl}/${ps._id}`;
    return this.http.delete<IProseg>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete opr id=${id}`)),
        catchError(this.handleError<IProseg>('deleteProseg'))
      );
  }
}
