import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IEsub, Esub, IEsubElite, IEsubProfile } from '../model/esub';
import { IEquipment, IEquipmentElite } from '../model/equipment';
import { SocketService } from '../socket/socket.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class EsubService {
  constructor(private http: HttpClient,
    private messageService: MessageService,
    private socketService: SocketService) {
  }

  private baseUrl = '/api/equipmentSubs';
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
    this.messageService.add(`EsubService: ${message}`);
  }

   /**
   * 获取所有的设备作业信息
   * @return {Observable<IEsub[]>} [设备作业信息Array]
   */
  getEsubs(field: string = '', sort: string = '-_id'): Observable<IEsub[]> {
   const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
   return this.http.get<IEsub[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched getEsubs')),
        catchError(this.handleError('getEsubs', []))
      )
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getEsubs404<Data>(query: any): Observable<IEsub> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEsub[]>(url)
      .pipe(
        map(datas => datas[0]), // returns a {0|1} element array
        tap(data => {
          const outcome = data ? `fetched` : `did not find`;
          this.log(`${outcome} Esub _id=${qstr}`);
        }),
        catchError(this.handleError<IEsub>(`getEsub ${qstr}`))
      );
  }

    /**
   * [通过过滤条件查询Esub，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEsub[]>}       [查询结果，hs数组]
   */
  searchEsub(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEsub[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEsub[]>(url)
      .pipe(
        tap(_ => this.log(`found Esub matching "${qstr}"`)),
        catchError(this.handleError<IEsub[]>('searchEsub', []))
      );
  }

  /**
   * [通过过滤条件查询Esub，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEsub[]>}       [查询结果，hs数组]
   */
  searchEsubEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEsub[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEsub[]>(url)
      .pipe(
        tap(_ => this.log(`found Esub matching "${query}"`)),
        catchError(this.handleError<IEsub[]>('searchEsub', []))
      );
  }

  /**
   * [统计设备类型的工作信息]
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
        tap(_ => this.log(`aggregate esub class matching "${query}"`)),
        catchError(this.handleError<any[]>('aggrQty', []))
      );
  }

  /**
   * [统计设备的具体工作信息]
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
        tap(_ => this.log(`aggregate esub matching "${query}"`)),
        catchError(this.handleError<any[]>('aggrQty', []))
      );
  }

  /**
   * [getNewEsub 从数据库获取一个全新的 Esub,自带 _id]
   * @return {Observable<IEsub>} [description]
   */
  getNewEsub(): Observable<IEsub> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEsub>(url)
      .pipe(
        tap(_ => this.log('fetched getNewEsub')),
        catchError(this.handleError<IEsub>('getNewEsub'))
      )
  }

  /**
   * 根据 _id 获取单个设备作业信息
   * @param  {string}              id [description]
   * @return {Observable<IPerson>}    [description]
   */
  getEsub(id: string): Observable<IEsub> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEsub>(url)
      .pipe(
        tap(_ => this.log('fetched getEsub')),
        catchError(this.handleError<IEsub>('getEsub'))
      )
  }

  /**
   * [getPsubsElite 获取所有的设备作业信息]
   * @return {Observable<IEsubElite[]>} [description]
   */
  getEsubsElite(): Observable<IEsubElite[]> {
    return this.getEsubs(this.eliteFields);
  }

  /**
   * 获取所有的设备作业关键信息 + Context
   * @return {Observable<IEsubProfile[]>} [设备作业关键信息 + Context's Array]
   */
  getEsubsProfile(): Observable<IEsubProfile[]> {
    return this.getEsubs(this.profileFields);
  }

  /**
   * [getEsubsBy 通过简单的查询条件，获取相应的 Esub 信息]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IEsub[]>}   [description]
   */
  getEsubsBy(query: any = {}): Observable<IEsub[]> {
        return this.searchEsub(query);

  }

  /**
   * [getEsubsEliteBy 通过简单的查询条件，获取相应的 Psub 关键信息]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IEsubElite[]>}   [description]
   */
  getEsubsEliteBy(query: any = {}): Observable<IEsubElite[]> {
     return this.searchEsub(query,this.eliteFields);
  }

  /**
   * [getEsubsProfileBy 通过简单的查询条件，获取相应的 ESubProfile Profile 信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IEsubProfile[]>}   [description]
   */
  getEsubsProfileBy(query: any = {}): Observable<IEsubProfile[]> {
     return this.searchEsub(query,this.profileFields);
  }

  getEsubBy(query: any = {}): Observable<IEsub> {
    return this.getEsubs404(query);
    // const url = `${this.baseUrl}/oneby`;
    // return this.http
    //   .post<IEsub>(url, query, httpOptions)
    //   .pipe(
    //     tap(_ => this.log('fetched getEsubBy')),
    //     catchError(this.handleError<IEsub>('getEsubBy'))
    //   )
  }

  /**
   * 在数据库中，创建新的设备作业信息
   * @param  {IEsub}             e [待创建的设备作业信息]
   * @return {Observable<IEsub>}   [新创建的设备作业信息]
   */
  createEsub(e: IEsub): Observable<IEsub> {
    return this.http
      .post<IEsub> (this.baseUrl, e, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createEsub')),
        catchError(this.handleError<IEsub>('createEsub'))
      )
  }

  /**
   * [createPsubBy description]
   * @param  {any}               pAhs [personelite and hs]
   * @return {Observable<IEquipmentSub>}      [description]
   */
  createEsubBy(e: IEquipmentElite): Observable<IEsub> {
    const url = `${this.baseUrl}/by`;
    return this.http
      .post<IEsub>(url, e, httpOptions)
      .pipe(
        tap(_ => this.log('fetched createEsubBy')),
        catchError(this.handleError<IEsub>('createEsubBy'))
      )
  }

  /**
   * 在数据库中，更新某个设备作业信息
   * @param  {IEsub}             wmc [待更新的设备作业信息]
   * @return {IEsub>}     [已更新的设备作业信息]
   */
  updatedEsub(e: IEsub): Observable<IEsub> {
    const url = `${this.baseUrl}/${e._id}`;
    return this.http
      .put<IEsub>(url, e)
      .pipe(
        tap(_ => this.log('fetched updatedEsub')),
        catchError(this.handleError<IEsub>('updatedEsub'))
      )
  }

  /**
   * [完成一个设备子段，在质检终端，完成窑炉设备的子段]
   * @param  {IEquipmentElite}   e [description]
   * @return {Observable<IEsub>}   [description]
   */
  setupEsub(id: string): Observable<IEsub> {
    const url = `${this.baseUrl}/setup/${id}`;
    return this.http
      .put<IEsub>(url, {})
      .pipe(
        tap(_ => this.log('fetched setupEsub')),
        catchError(this.handleError<IEsub>('setupEsub'))
      )
  }

  //新增patch方法
  patchEsub(id: string, patch: any): Observable<IEsub> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch<IEsub>(url, patch)
      .pipe(
        tap(_ => this.log('fetched patchEsub')),
        catchError(this.handleError<IEsub>('patchEsub'))
      )
  }

  /**
   * 在数据库中，删除某个设备作业信息
   * @param  {IEquipmentSub}          p [待删除的设备作业信息]
   * @return {Observable<void>}   [description]
   */
  deleteEsub(e: IEsub): Observable<IEsub> {
    const url = `${this.baseUrl}/${e._id}`;
    return this.http.delete<IEsub>(url)
      .pipe(
        tap(_ => this.log('fetched deleteEsub')),
        catchError(this.handleError<IEsub>('deleteEsub'))
      )
  }

  /**
   * [根据Energy Sub 创建 Ensub 树状选择]
   * @param  {IEsubProfile[]}  esp [description]
   * @param  {IEsubElite[] =   []}          sels [description]
   * @return {TreeviewItem[]}      [description]
   */
  newEsubTree(esp: IEsubProfile[], collapsed: boolean = false, sels: any[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if (esp && esp.length > 0) {
      rntree = _.map(_.groupBy(esp, 'eclass._id'), (ecs, key) => {
        console.log(ecs[0]);
        return new TreeviewItem({
          text: ecs[0].eclass[0].oid,
          value: ecs[0].eclass,
          checked: false,
          collapsed: collapsed,
          children: _.map(_.groupBy(ecs, 'equipment._id'), (es, key) => {
            return {
              text: es[0].equipment ? es[0].equipment.oid : '{}',
              value: es[0].equipment,
              checked: false,
              collapsed: collapsed,
              children: es.map(es => {
                return {
                  //TODO: 待实现
                  text: es.oid,
                  value: es,
                  checked: sels ? sels.findIndex(sel => sel._id === es._id) >= 0 : false,
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
   * 从单个的 Equipment 中继承相关的属性
   * @param  {IESub}     es [原始的设备作业批次]
   * @param  {IEquipment} e  [设备信息]
   * @return {IESub}        [新的设备作业]
   */
  newEsubByEdef(es: IEsub, e: IEquipment): Esub {
    let model = new Esub(es);
    model.DeriveFromEdef(e);
    return model;
  }

  createEsubTree(esubs: IEsub[], collapsed: boolean = true, sels: IEsub[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if(esubs && esubs.length > 0) {
      console.log('length', esubs.length)
      rntree = _.map(_.groupBy(esubs, 'eclass[0].oid'), (value, key) => {
        return new TreeviewItem({
          text: key,
          value: value[0].eclass[0],
          checked: false,
          collapsed: collapsed,
          children: _.map(_.groupBy(value, 'equipment.oid'), (value1, key1) => {
            return {
              text: key1,
              value: value1[0].equipment,
              checked: false,
              collapsed: collapsed,
              children: value1.map(esub => {
                return {
                  text: `${esub.oid}`,
                  value: esub,
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
