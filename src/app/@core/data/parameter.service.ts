import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IElite } from '../model/common';
import { GlobalData } from '../model/global';
import { IParameter, Parameter } from '../model/parameter';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ParameterService implements IExistService {
  private baseUrl = '/api/parameters';
  private eliteFields = '_id oid';
  private profileFields = '-tags';

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
    this.messageService.add(`ParameterService: ${message}`);
  }


  init(): void {
    this.getParameters().subscribe(paras => {
      GlobalData.paras = paras;
      this.socketService.syncUpdates('parameter', GlobalData.paras);
    })
  }

  isTag(para: IParameter): boolean {
    if (_.isNil(para)) {
      return false;
    }
    return para.oid === 'tag' || (para.tags && para.tags.length > 0 && para.tags.includes('tag'));
  }

  newTreeItem(para: IParameter, collapsed: boolean = false): TreeItem {
    if(_.isNil(para)) {
      return undefined;
    }
    return {
      text: para.oid,
      value: para,
      checked: false,
      collapsed: collapsed,
      children: []
    };
  }

  createTree(paras: IParameter[]): TreeviewItem[]{
    let root = this.newTreeItem(paras.find(para => para.oid ==='tag'));

    root.children = paras.filter(para => para.tags.includes('tag')).map(para => {
      return this.newTreeItem(para, true);
    });
    root.children.forEach(item => {
      item.children = paras.filter(para => para.tags.includes(item.text)).map(para => {
        return this.newTreeItem(para, true);
      })
    });
    return [new TreeviewItem(root)];
  }

  /**
   * 获取所有的属性项 参数
   * @return {Observable<IParameter[]>} [属性项 参数 Array]
   */
  getParameters(field: string = '', sort: string = 'path'): Observable<IParameter[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IParameter[]>(url)
      .pipe(
        tap(_ => this.log('fetched getParameters')),
        catchError(this.handleError<IParameter[]>(`getParameters`,[]))
      );
  }


  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getParameters404<Data>(query: any): Observable<IParameter> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IParameter[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} getParameters _id=${qstr}`);
        }),
        catchError(this.handleError<IParameter>(`getParameters ${qstr}`))
      );
  }

  /**
   * 获取所有的属性项 参数  关键信息
   * @return {Observable<IElite[]>} [属性项 参数 关键信息 Array]
   */
  getParametersElite(): Observable<IElite[]> {
    return this.getParameters(this.eliteFields);
  }

  /**
   * [getParametersProfile 获取所有的属性项 参数  Profile 信息]
   * @return {Observable<IParameter[]>} [description]
   */
  getParametersProfile(): Observable<IParameter[]> {
    return this.getParameters(this.profileFields);
  }

  /**
   * [getNewParameter 从数据库获取一个全新的 Parameter,自带 _id]
   * @return {Observable<IParameter>} [description]
   */
  getNewParameter(): Observable<IParameter> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IParameter>(url)
      .pipe(
        tap(_ => this.log('fetched getNewParameter')),
        catchError(this.handleError<IParameter>(`getNewParameter`))
      );
  }

  /**
   * 根据 _id 获取单个属性项 参数 信息
   * @param  {string}              id [description]
   * @return {Observable<IParameter>}    [description]
   */
  getParameter(id: string): Observable<IParameter> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IParameter>(url)
      .pipe(
        tap(_ => this.log('fetched getParameter')),
        catchError(this.handleError<IParameter>(`getParameter`))
      );
  }

  /**
   * [getParametersByQuery 通过简单的查询条件，获取相应的属性项 参数]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IParameter[]>}   [description]
   */
  getParametersBy(query: any = {}): Observable<IParameter[]> {
    return this.getParameters(query)
  }

  /**
   * [getParametersEliteBy 通过简单的查询条件，获取相应的属性项 参数关键信息]
   * @param  {any               = {}}        query [description]
   * @return {Observable<IElite[]>}   [description]
   */
  getParametersEliteBy(query: any = {}): Observable<IElite[]> {
    return this.getParameters(query, this.eliteFields);
  }

  /**
   * [getParametersProfileBy 通过简单的查询条件，获取相应的属性项 参数 Profile]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IParameter[]>}   [description]
   */
  getParametersProfileBy(query: any = {}): Observable<IParameter[]> {
        return this.getParameters(query, this.profileFields);
  }


   /**
   * [通过过滤条件查询Parameters，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询忽略的数量]
   * @return {Observable<IParameter[]>}       [查询结果，Parameters数组]
   */
  searchParameters(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IParameter[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IParameter[]>(url)
      .pipe(
        tap(_ => this.log(`found Parameters matching "${qstr}"`)),
        catchError(this.handleError<IParameter[]>('searchParameters', []))
      );
  }

  /**
   * [通过过滤条件查询Parameter，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IParameter[]>}       [查询结果，Parameter数组]
   */
  searchParameterEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IParameter[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IParameter[]>(url)
      .pipe(
        tap(_ => this.log(`found Parameter matching "${query}"`)),
        catchError(this.handleError<IParameter[]>('searchParameter', []))
      );
  }

  /**
   * [判断属性项 参数 是否存在，根据 field 和 value]
   * @param  {any}           query [description]
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
    return this.http.get<IParameter[]>(url)
      .pipe(
        map(ps => ps[0]), // returns a {0|1} element array
        tap(ps => {
          const outcome = ps ? `fetched` : `did not find`;
          this.log(`${outcome} ps _id=${qstr}`);
        }),
        catchError(this.handleError<IParameter>(`getIParameter ${qstr}`))
      );
  }

  /**
   * [判断属性项 参数 是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的属性项 参数 信息
   * @param  {IPclass}             pc [待创建的属性项 参数 信息]
   * * @return {Observable<IParameter>}    [新创建的属性项 参数 信息]
   */
  createParameter(para: IParameter): Observable<IParameter> {
    return this.http
      .post<IParameter>(this.baseUrl, para)
      .pipe(
        tap(_ => this.log('fetched createParameter')),
        catchError(this.handleError<IParameter>(`createParameter`))
      );
  }

  /**
   * 在数据库中，更新某个属性项 参数 信息
   * @param  {IParameter}             pc [待更新的属性项 参数 信息]
   * @return {Observable<IParameter>}    [更新后的属性项 参数 信息]
   */
//  updateParameter(para: IParameter, elite: boolean = false): Observable<IParameter> {
    // let strElite = elite ? 'elite' : '';
    // const url = `${this.baseUrl}/${para._id}/${strElite}`;
  updateParameter(para: IParameter): Observable<IParameter> {
    const url = `${this.baseUrl}/${para._id}`;
    return this.http
      .put<IParameter>(url, para)
      .pipe(
        tap(_ => this.log('fetched updateParameter')),
        catchError(this.handleError<IParameter>(`updateParameter`))
      );
  }

  patchParameter(id: string, patch: any): Observable<IParameter> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IParameter>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchParameter')),
        catchError(this.handleError<IParameter>(`patchParameter`))
      );
  }

  /**
   * 在数据库中，删除某个属性项 参数 信息
   * @param  {IPclass}          pc [待删除的属性项 参数 信息]
   * @return {Observable<void>}    [description]
   */
  deleteParameter(para: IParameter): Observable<IParameter> {
    const url = `${this.baseUrl}/${para._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IParameter>(url)
      .pipe(
        tap(_ => this.log('fetched deleteParameter')),
        catchError(this.handleError<IParameter>(`deleteParameter`))
      );
  }

  /**
   * [属性项 参数的标签树]
   * @param  {string[]}       tags [description]
   * @param  {boolean     =    false}       collapsed [description]
   * @param  {string[]    =    []}          sels      [description]
   * @return {TreeviewItem[]}      [description]
   */
  tagTree(tags: string[], collapsed: boolean = false, sels: string[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    console.log('tag',tags)
    if (tags && tags.length > 0) {
      rntree = tags.map(tag => {
        return new TreeviewItem({
          text: tag,
          value: tag,
          checked: sels ? sels.findIndex(sel => sel === tag) >= 0 : false,
          collapsed: collapsed,
          children: []
        });
      });
    }
    console.log('输出',rntree)
    return rntree;
  }


  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
