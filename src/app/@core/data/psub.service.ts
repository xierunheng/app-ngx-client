import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IPsub, IPsubElite, IPsubProfile, Psub } from '../model/psub';
import { IPerson } from '../model/person';

function handleError(err) {
  return Observable.throw(err.json().error || 'Server error');
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class PsubService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/personnelSubs';
  private eliteFields = '_id oid';
  private profileFields = '-oplog -prop -mAct';
  private pclassFields = '_id -oid -hs -pclass -qty -ngqty';


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
    this.messageService.add(`PsubService: ${message}`);
  }

  /**
   * 获取所有的员工信息
   * @return {Observable<IPerson[]>} [员工信息Array]
   */
  getPsubs(field: string = '', sort: string = '-_id'): Observable<IPsub[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IPsub[]> (url)
      .pipe(
        tap(_ => this.log('fetched getPsubs')),
        catchError(this.handleError<IPsub[]>(`getPsubs`,[]))
      );
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getPsubNo404<Data>(query: any): Observable<IPsub> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IPsub[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Psubs _id=${qstr}`);
        }),
        catchError(this.handleError<IPsub>(`getPsubNo404 ${qstr}`))
      );
  }

    /**
   * [通过过滤条件查询Psub，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询忽略的数量]
   * @return {Observable<IPsub[]>}       [查询结果，IPsub数组]
   */
  searchPsubs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPsub[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPsub[]>(url)
      .pipe(
        tap(_ => this.log(`found Psub matching "${qstr}"`)),
        catchError(this.handleError<IPsub[]>('searchPsub', []))
      );
  }

  /**
   * [通过过滤条件查询Psub，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPsub[]>}       [查询结果，Psub数组]
   */
  searchPsubsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPsub[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPsub[]>(url)
      .pipe(
        tap(_ => this.log(`found Psub matching "${query}"`)),
        catchError(this.handleError<IPsub[]>('searchPsub', []))
      );
  }

  /**
   * [统计员工类型的工作信息]
   * @param  {any}               hs        [层级结构]
   * @param  {Date}              startTime [统计开始时间]
   * @param  {Date}              endTime   [统计结束时间]
   * @return {Observable<any[]>}           [返回的统计结果]
   */
  aggrClass(hs: any, startTime: Date, endTime: Date) : Observable<any[]> {
    let query = {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    };
    const url = `${this.baseUrl}/aggrclass/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate personnelsub class matching "${query}"`)),
        catchError(this.handleError<any[]>('aggrQty', []))
      );
  }


  /**
   * [统计员工的具体工作信息]
   * @param  {string}            group     [分组项]
   * @param  {any}               hs        [层级结构]
   * @param  {Date}              startTime [统计开始时间]
   * @param  {Date}              endTime   [统计结束时间]
   * @param  {any            =         {}}        others [其他过滤条件]
   * @return {Observable<any[]>}           [返回的统计结果]
   */
  aggr(group: string, hs: any, startTime: Date, endTime: Date, others: any = {}) : Observable<any[]> {
    let query = _.merge(others, {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    });

    const url = `${this.baseUrl}/aggr/${group}/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate personnelsub matching "${query}"`)),
        catchError(this.handleError<any[]>('aggrQty', []))
      );
  }

  /**
   * [getNewPsub 从数据库获取一个全新的 Psub,自带 _id]
   * @return {Observable<IPsub>} [description]
   */
  getNewPsub(): Observable<IPsub> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IPsub>(url)
      .pipe(
        tap(_ => this.log('fetched getNewPsub')),
        catchError(this.handleError<IPsub>(`getNewPsub`))
      );
  }

  /**
   * 根据 _id 获取单个员工信息
   * @param  {string}              id [description]
   * @return {Observable<IPerson>}    [description]
   */
  getPsub(id: string): Observable<IPsub> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IPsub>(url)
      .pipe(
        tap(_ => this.log('fetched getPsub')),
        catchError(this.handleError<IPsub>(`getPsub`))
      );
  }

  /**
   * [获取psub 的物料子批次扫码统计信息]
   * @param  {string}          id [description]
   * @return {Observable<any>}    [description]
   */
  aggrMdef(id: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/mdef/${id}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched aggrMdef')),
        catchError(this.handleError<any>(`aggrMdef`))
      );
  }

  /**
   * [获取psub 的 某天的质检结果]
   * @param  {string}          time ['YYYYMMDD']
   * @return {Observable<any>}    [description]
   */
  aggrDayQC(time: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/dayqc/${time}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched aggrDayQC')),
        catchError(this.handleError<any>(`aggrDayQC`))
      );
  }

  /**
   * [获取psub 的 某天的质检项结果]
   * @param  {string}          time ['YYYYMMDD']
   * @return {Observable<any>}    [description]
   */
  aggrDayQCI(time: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/dayqci/${time}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched aggrDayQCI')),
        catchError(this.handleError<any>(`aggrDayQCI`))
      );
  }

  /**
   * [获取psub 的物料子批次扫码统计信息]
   * @param  {string}          id [description]
   * @return {Observable<any>}    [description]
   */
  aggrMdefBy(query: any): Observable<any> {
    const url = `${this.baseUrl}/aggr/mdefby`;
    return this.http
      .post<any>(url, query,httpOptions)
      .pipe(
        tap(_ => this.log('fetched aggrMdefBy')),
        catchError(this.handleError<any>(`aggrMdefBy`))
      );
  }

  /**
   * [getPsubsElite 获取所有的员工关键信息]
   * @return {Observable<IPsubElite[]>} [description]
   */
  getPsubsElite(): Observable<IPsubElite[]> {
    return this.getPsubs(this.eliteFields);
  }

  /**
   * 获取所有的员工关键信息 + Context
   * @return {Observable<IPersonProfile[]>} [员工关键信息 + Context's Array]
   */
  getPsubsProfile(): Observable<IPsubProfile[]> {
    return this.getPsubs(this.profileFields);
  }

  /**
   * [getPsubsBy 通过简单的查询条件，获取相应的 Psub 信息]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IPsub[]>}   [description]
   */
  getPsubsBy(query: any = {}): Observable<IPsub[]> {
      return this.searchPsubs(query);
  }

  /**
   * [getPsubsEliteBy 通过简单的查询条件，获取相应的 Psub 关键信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IPsubElite[]>}   [description]
   */
  getPsubsEliteBy(query: any = {}): Observable<IPsubElite[]> {
      return this.searchPsubs(query,this.eliteFields);
  }

  /**
   * [getPsubsProfileBy 通过简单的查询条件，获取相应的 Psub Profile 信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IPsubProfile[]>}   [description]
   */
  getPsubsProfileBy(query: any = {}): Observable<IPsubProfile[]> {
      return this.searchPsubs(query,this.profileFields);
  }


  /**
   * 在数据库中，创建新的员工信息
   * @param  {IPerson}             p [待创建的员工信息]
   * @return {Observable<IPerson>}   [新创建的员工信息]
   */
  createPsub(p: IPsub): Observable<IPsub> {
    return this.http
      .post<IPsub>(this.baseUrl, p, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createPsub')),
        catchError(this.handleError<IPsub>(`createPsub`))
      );
  }

  /**
   * 从单个的 Equipment 中继承相关的属性
   * @param  {IESub}     ps [原始的设备作业批次]
   * @param  {IEquipment} p  [设备信息]
   * @return {IESub}        [新的设备作业]
   */
  newPsubByPerson(ps: IPsub, p: IPerson): Psub {
    let model = new Psub(ps);
    model.DeriveFromPerson(p);
    return model;
  }

  /**
   * [createPsubBy description]
   * @param  {any}               pAhs [personelite and hs]
   * {
     p: xxx,
     hs: xxx,
   * }
   * @return {Observable<IPsub>}      [description]
   */
  createPsubBy(pAhs: any): Observable<IPsub> {
    const url = `${this.baseUrl}/by`;
    return this.http
      .post<IPsub>(url, pAhs, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createPsubBy')),
        catchError(this.handleError<IPsub>(`createPsubBy`))
      );
  }

  /**
   * 在数据库中，更新某个作业能力信息
   * @param  {IWmCapability}             wmc [待更新的作业能力信息]
   * @return {Observable<IWmCapability>}     [已更新的作业能力信息]
   */
  updatedPsub(p: IPsub): Observable<IPsub> {
    const url = `${this.baseUrl}/${p._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IPsub>(url, p)
      .pipe(
        tap(_ => this.log('fetched updatedPsub')),
        catchError(this.handleError<IPsub>(`updatedPsub`))
      );
  }

  //新增patch方法
  patchPsub(id: string, patch: any): Observable<IPsub> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IPsub>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchPsub')),
        catchError(this.handleError<IPsub>(`patchPsub`))
      );
  }

  /**
   * 在数据库中，删除某个员工信息
   * @param  {IPerson}          p [待删除的员工信息n]
   * @return {Observable<void>}   [description]
   */
  deletePsub(p: IPsub): Observable<IPsub> {
    const url = `${this.baseUrl}/${p._id}`;
    return this.http.delete<IPsub>(url)
      .pipe(
        tap(_ => this.log('fetched deletePsub')),
        catchError(this.handleError<IPsub>(`deletePsub`))
      );
  }

  createPsubTree(psubs: IPsub[], collapsed: boolean = true, sels: IPsub[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if(psubs && psubs.length > 0) {
      rntree = _.map(_.groupBy(psubs, 'pclass[0].oid'), (value, key) => {
        return new TreeviewItem({
          text: key,
          value: value[0].pclass[0],
          checked: false,
          collapsed: collapsed,
          children: _.map(_.groupBy(value, 'person.oid'), (value1, key1) => {
            return {
              text: key1,
              value: value1[0].person,
              checked: false,
              collapsed: collapsed,
              children: value1.map(psub => {
                return {
                  text: `${psub.oid}`,
                  value: psub,
                  checked: false,
                  collapsed: collapsed,
                  children: []
                }
              })
            }
          })
        })
      })
    }
    return rntree;

  }
  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
