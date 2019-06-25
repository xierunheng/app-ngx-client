import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IEnSub, EnSub, IEnSubElite, IEnSubProfile} from '../model/ensub';
import { IEnergyDefinition, IEnergyElite } from '../model/endef';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EnsubService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/energySubs';
  private eliteFields = '_id oid';
  private profileFields = '-prop -datas -oplog';

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
    this.messageService.add(`EnsubService: ${message}`);
  }

  /**
   * 获取所有的能源采集信息
   * @return {Observable<IEnSub[]>} [能源设备信息Array]
   */
  getEnsubs(field: string = '', sort: string = '-_id'): Observable<IEnSub[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEnSub[]> (this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched getEnsubs')),
        catchError(this.handleError<IEnSub[]> ('getEnsubs', []))
      )
  }

    /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEnsubNo404<Data>(query: any): Observable<IEnSub> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEnSub[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Ensub _id=${qstr}`);
        }),
        catchError(this.handleError<IEnSub>(`getEnsub ${qstr}`))
      );
  }

   /**
   * [通过过滤条件查询EnSub，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询忽略的数量]
   * @return {Observable<IEnSub[]>}       [查询结果，hs数组]
   */
  searchEnSub(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnSub[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnSub[]>(url)
      .pipe(
        tap(_ => this.log(`found EnSub matching "${qstr}"`)),
        catchError(this.handleError<IEnSub[]>('searchEnSub', []))
      );
  }

  /**
   * [通过过滤条件查询EnSub，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEnSub[]>}       [查询结果，hs数组]
   */
  searchEnSubEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEnSub[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEnSub[]>(url)
      .pipe(
        tap(_ => this.log(`found EnSub matching "${query}"`)),
        catchError(this.handleError<IEnSub[]>('searchEnSub', []))
      );
  }


  /**
   * [getNewEnsub 从数据库获取一个全新的 Ensub,自带 _id]
   * @return {Observable<IEnSub>} [description]
   */
  getNewEnsub(): Observable<IEnSub> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEnSub>(url)
      .pipe(
        tap(_ => this.log('fetched getNewEnsub')),
        catchError(this.handleError<IEnSub> ('getNewEnsub'))
      )
  }

  /**
   * 根据 _id 获取单个能源设备信息
   * @param  {string}              id [description]
   * @return {Observable<IEnSub>}    [description]
   */
  getEnsub(id: string): Observable<IEnSub> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEnSub>(url)
      .pipe(
        tap(_ => this.log('fetched getEnsub')),
        catchError(this.handleError<IEnSub> ('getEnsub'))
      )
  }

 /**
  * [getPsubsElite 获取所有的能源设备信息]
  * @return {Observable<IEnsubElite[]>} [description]
  */
  getEnsubsElite(): Observable<IEnSubElite[]> {
    return this.getEnsubs(this.eliteFields);
  }

  /**
   * 获取所有的能源设备关键信息 + Context
   * @return {Observable<IEnSubProfile[]>} [能源设备关键信息 + Context's Array]
   */
  getEnsubsProfile(): Observable<IEnSubProfile[]> {
     return this.getEnsubs(this.profileFields);
  }

  /**
   * [getEnsubsByQuery 通过简单的查询条件，获取相应的 Ensub 信息]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IEnSub[]>}   [description]
   */
  getEnsubsBy(query: any = {}): Observable<IEnSub[]> {
    return this.searchEnSub(query);
  }

  /**
   * [getEnsubsEliteBy 通过简单的查询条件，获取相应的 Ensub 关键信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IEnSubElite[]>}   [description]
   */
  getEnsubsEliteBy(query: any = {}): Observable<IEnSubElite[]> {
    return this.getEnsubs(query,this.eliteFields);
  }

  /**
   * [getEnsubsProfileBy 通过简单的查询条件，获取相应的 EnSubProfile Profile 信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IEnSubProfile[]>}   [description]
   */
  getEnsubsProfileBy(query: any = {}): Observable<IEnSubProfile[]> {
    return this.getEnsubs(query,this.profileFields);
  }


  /**
   * 在数据库中，创建新的能源设备信息
   * @param  {IEnSub}             ens [待创建的设备作业信息]
   * @return {Observable<IEnSub>}   [新创建的设备作业信息]
   */
  createEnsub(ens: IEnSub): Observable<IEnSub> {
    return this.http
      .post<IEnSub>(this.baseUrl, ens, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createEnsub')),
        catchError(this.handleError<IEnSub> ('createEnsub'))
      )
  }

  /**
   * [createEnsubBy description]
   * @param  {any}               enAhs [personelite and hs]
   * {
       p: xxx,
       hs: xxx,
   * }
   * @return {Observable<IEnSub>}      [description]
   */
  createEnsubBy(enAhs: any): Observable<IEnSub> {
    const url = `${this.baseUrl}/by`;
    return this.http
      .post<IEnSub> (url, enAhs, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createEnsubBy')),
        catchError(this.handleError<IEnSub> ('createEnsubBy'))
      )

  }

  /**
   * [根据Energy Sub 创建 Ensub 树状选择]
   * @param  {IEnSubProfile[]}  ensp [description]
   * @param  {IEnSubElite[] =   []}          sels [description]
   * @return {TreeviewItem[]}      [description]
   */
  newEnSubTree(ensp: IEnSubProfile[], collapsed: boolean = false, sels: any[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if(ensp && ensp.length >　0) {
      rntree = _.map(_.groupBy(ensp, 'enclass._id'), (encs, key) => {
        return new TreeviewItem({
          text: encs[0].enclass[0].oid,
          value: encs[0].enclass,
          checked: false,
          collapsed: collapsed,
          children: _.map(_.groupBy(encs, 'endef._id'), (ens, key) => {
            return {
              text: ens[0].endef ? ens[0].endef.oid : '{}',
              value: ens[0].endef,
              checked: false,
              collapsed: collapsed,
              children: ens.map(ens => {
                return {
                  //TODO: 待实现
                  text: ens.oid,
                  value: ens,
                  checked: sels ? sels.findIndex(sel => sel._id === ens._id) >= 0 : false,
                  collapsed: true,
                }
              })
            }
          })
        });
      });
    }
    return rntree;
  }

  /**
   * 从单个的 Material 中继承相关的属性
   * @param  {IEnSub}     ml [原始的 物料批次]
   * @param  {IEnergyDefinition} m  [物料信息]
   * @return {IEnSub}        [新的 物料批次]
   */
  newEnsubByEndef(ens: IEnSub, en: IEnergyDefinition): EnSub {
    let model = new EnSub(ens);
    model.DeriveFromEndef(en);
    return model;
  }

  /**
   * 在数据库中，更新某个能源设备信息
   * @param  {IEnSub}             ens [待更新的能源设备信息]
   * @return {Observable<IEnSub>}     [已更新的能源设备信息]
   */
  updatedEnsub(ens: IEnSub): Observable<IEnSub> {
    const url = `${this.baseUrl}/${ens._id}`;
    return this.http
      .put<IEnSub>(url, ens)
      .pipe(
        tap(_ => this.log('fetched updatedEnsub')),
        catchError(this.handleError<IEnSub> ('updatedEnsub'))
      )
  }

  //新增patch方法
  patchEnsub(id: string, patch: any): Observable<IEnSub> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IEnSub>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchEnsub')),
        catchError(this.handleError<IEnSub> ('patchEnsub'))
      )
  }

  /**
   * 在数据库中，删除某个能源设备信息
   * @param  {IEnSub}          ens [待删除的能源设备信息]
   * @return {Observable<void>}   [description]
   */
  deleteEnsub(ens: IEnSub): Observable<IEnSub> {
    const url = `${this.baseUrl}/${ens._id}`;
    return this.http.delete<IEnSub>(url)
      .pipe(
        tap(_ => this.log('fetched deleteEnsub')),
        catchError(this.handleError<IEnSub>('deleteEnsub'))
      )
  }

}
