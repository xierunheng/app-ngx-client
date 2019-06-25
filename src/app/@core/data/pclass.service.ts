import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';

import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IPclassElite, IPclass } from '../model/pclass';
import {IExistService} from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PclassService implements IExistService {
  private baseUrl = '/api/personnelClasss';

  private eliteFields = '_id oid';
  private profileFields = '-prop -persons';

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
    this.messageService.add(`PclassService: ${message}`);
  }

  /**
   * 获取所有的员工类型
   * @return {Observable<IPclass[]>} [员工类型Array]
   */
  getPclasss(field: string = '', sort: string = '-_id'): Observable<IPclass[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IPclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched Pclasss')),
        catchError(this.handleError('getPclasss', []))
      );
  }

  /**
   * 通过查询条件，获取员工类型信息
   * 当查询不到时，返回 undefined
   */
  getPclassNo404<Data>(query: any): Observable<IPclass> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IPclass[]>(url)
      .pipe(
        map(Pclasss => Pclasss[0]), // returns a {0|1} element array
        tap(Pclass => {
          const outcome = Pclass ? `fetched` : `did not find`;
          this.log(`${outcome} Pclass _id=${qstr}`);
        }),
        catchError(this.handleError<IPclass>(`getPclass ${qstr}`))
      );
  }


  /**
   * [getNewPclass 从数据库获取一个全新的 Pclass,自带 _id]
   * @return {Observable<IPclass>} [description]
   */
  getNewPclass(): Observable<IPclass> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IPclass>(url)
      .pipe(
        tap(_ => this.log('fetched new Pclasss')),
        catchError(this.handleError<IPclass>('getNewPclass'))
      );
  }

  /**
   * 根据 _id 获取单个员工类型信息
   * @param  {string}              id [description]
   * @return {Observable<IPclass>}    [description]
   */
  getPclass(id: string): Observable<IPclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IPclass>(url)
      .pipe(
        tap(_ => this.log('fetched Pclasss id=${id}')),
        catchError(this.handleError<IPclass>('getPclass'))
      );
  }

  /**
   * [searchPclasss description]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPclass[]>}       [查询结果，Pclass数组]
   */
  searchPclasss(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPclass[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Pclass matching "${qstr}"`)),
        catchError(this.handleError<IPclass[]>('searchPclasss', []))
      );
  }

  /**
   * [searchPclasss description]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPclass[]>}       [查询结果，Pclass数组]
   */
  searchPclasssEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPclass[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Pclass matching "${query}"`)),
        catchError(this.handleError<IPclass[]>('searchPclasss', []))
      );
  }

  /**
   * 通过员工类型 的 _id 数组 获取 员工类型 数组
   * @param  {string[]}              ids [员工类型的_id数组]
   * @return {Observable<IPclass[]>}     [员工类型数组]
   */
  getManyPclasss(ids: string[]): Observable<IPclass[]> {
    return this.searchPclasssEncode({_id: { $in: ids }});
  }

  /**
   * 获取所有的员工类型关键信息
   * @return {Observable<IPclassElite[]>} [员工类型关键信息Array]
   */
  getPclasssElite(): Observable<IPclassElite[]> {
    return this.getPclasss(this.eliteFields);
  }

  /**
   * [getPclasssProfile 获取所有的员工类型 Profile]
   * @return {Observable<IPclass[]>} [description]
   */
  getPclasssProfile(): Observable<IPclass[]> {
    return this.getPclasss(this.profileFields);
    }

  /**
   * [getPclasssByQuery 通过简单的查询条件，获取相应的员工类型信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IPclass[]>}   [description]
   */
  getPclasssBy(query: any = {}): Observable<IPclass[]> {
    return this.searchPclasss(query);
  }

  /**
   * [getPclasssEliteBy 通过简单的查询条件，获取相应的员工类型关键信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IPclassElite[]>}   [description]
   */
  getPclasssEliteBy(query: any = {}): Observable<IPclassElite[]> {
    return this.searchPclasss(query, this.eliteFields);
  }

  /**
   * [getPclasssProfileBy 通过简单的查询条件，获取相应的员工类型 Profile 信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IPclass[]>}   [description]
   */
  getPclasssProfileBy(query: any = {}): Observable<IPclass[]> {
    return this.searchPclasss(query, this.profileFields);
  }

  getPclassBy(query: any = {}): Observable<IPclass> {
    return this.getPclassNo404(query);
  }

  /**
   * [判断员工类型是否存在，根据 field 和 value]
   * @param  {any}           query [description]
   * @return {Observable<void>}       [description]
   */
  exist<Date>(query: any): Observable<any> {
    console.log(query);
    let qstr = '';
    if(query) {
      _.forOwn(query,(value, key) =>{
        qstr += `${key}=${value}&`;
      });
    } else {
      return of (undefined);
    }
    const url = `${this.baseUrl}/?${qstr}&field=null&limit=1`;
    return this.http.get<IPclass[]>(url)
      .pipe(
        map(Pclasss => Pclasss[0]), // returns a {0|1} element array
        tap(Pclass => {
          const outcome = Pclass ? `fetched` : `did not find`;
          this.log(`${outcome} Pclass _id=${qstr}`);
        }),
        catchError(this.handleError<IPclass>(`getPclass ${qstr}`))
      );
  }

  /**
   * [判断员工类型是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的员工类型信息
   * @param  {IPclass}             pc [待创建的员工类型信息]
   * @return {Observable<IPclass>}    [新创建的员工类型信息]
   */
  createPclass(pc: IPclass): Observable<IPclass> {
    return this.http
      .post<IPclass>(this.baseUrl, pc, httpOptions)
      .pipe(
        tap((NewPclass: IPclass) => this.log(`added Pclass w/ id=${NewPclass._id}`)),
        catchError(this.handleError<IPclass>('createPclass'))
      );
  }

  /**
   * [在数据库中，更新员工类型信息]
   * @param  {IPclass}             pc [description]
   * @return {Observable<IPclass>}    [description]
   */
  updatePclass(pc: IPclass): Observable<any> {
    const url = `${this.baseUrl}/${pc._id}`;
    return this.http
      .put(url, pc, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Pclass id=${pc._id}`)),
        catchError(this.handleError<any>('updatePclass'))
      );
  }

  /**
   * [更新员工类型]
   * @param  {string}              id    [description]
   * @param  {any}                 patch [description]
   * @return {Observable<IPclass>}       [description]
   */
  patchPclass(id: string, patch: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Pclass id=${id}`)),
        catchError(this.handleError<any>('patchPclass'))
      );
  }

  /**
   * 在数据库中，删除某个员工类型信息
   * @param  {IPclass}          pc [待删除的员工类型信息]
   * @return {Observable<void>}    [description]
   */
  deletePclass(pc: IPclass | string): Observable<IPclass> {
    const id = typeof pc === 'string' ? pc : pc._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IPclass>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Pclass id=${id}`)),
        catchError(this.handleError<IPclass>('deletePclass'))
      );
  }

  /**
   * [把pclssElite列表作为 下来的可选项，用于 pclass 的定义]
   * @param  {IPclassElite[]}    pcs [description]
   * @param  {IPclassElite[] =   []}          sels [description]
   * @return {TreeviewItem[]}        [description]
   */
  newPclassTree(pcs: IPclassElite[], sels: IPclassElite[] = []): TreeviewItem[] {
    return pcs && pcs.length > 0 ? pcs.map(item => {
      return new TreeviewItem({
        text: item.oid,
        value: item,
        checked: sels ? sels.findIndex(sel => sel._id === item._id) >= 0 : false,
        children: []
      });
    }) : [];
  }

  /**
   * [根据pclass[], 创建员工树]
   * @param  {IPclass[]}      pcs [description]
   * @param  {boolean     =   false}       collapsed  [description]
   * @param  {boolean     =   true}        withPerson [description]
   * @return {TreeviewItem[]}     [description]
   */
  createPTree(pcs: IPclass[], collapsed: boolean = true, withPerson: boolean = true): TreeviewItem[] {
    let ptree: TreeviewItem[] = pcs && pcs.length > 0 ? pcs.map(pc => {
      return new TreeviewItem({
        text: pc.oid,
        value: pc,
        checked: false,
        collapsed: collapsed,
        children: withPerson ? _.sortBy(pc.persons, 'oid').map(p => {
          return {
            text: `${p.oid} ${p.name}`,
            value: p,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.personnel.name,
      value: UtilData.systemObj.personnel.name,
      checked: false,
      collapsed: false,
      children: ptree
    });
    return [root];
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
