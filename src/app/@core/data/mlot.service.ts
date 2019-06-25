import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IMclass } from '../model/mclass';
import { IMdef, IMdefElite } from '../model/mdef';
import {
  IMlotElite, IMlotProfile,
  IMlot, Mlot
} from '../model/mlot';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MlotService implements IExistService {
  private baseUrl = '/api/materialLots';

  private eliteFields = '_id oid';
  private profileFields = '_id oid mclass mdef qty subQty status';

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
    this.messageService.add(`MlotService: ${message}`);
  }

  /**
   * 获取所有的物料批次
   * @return {Observable<IMlot[]>} [物料批次 Array]
   */
  getMlots(field: string = '', sort: string = '-_id'): Observable<IMlot[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IMlot[]>(url)
      .pipe(
        tap(_ => this.log('fetched Mlots')),
        catchError(this.handleError('getMlots', []))
      );
  }

  /**
   * 获取所有的物料批次关键信息
   * @return {Observable<IMlotElite[]>} [物料批次关键信息Array]
   */
  getMlotsElite(): Observable<IMlotElite[]> {
    return this.getMlots(this.eliteFields);
  }

  /**
   * 获取所有的物料批次关键信息 + Context
   * @return {Observable<IMlotElite[]>} [物料批次关键信息Array]
   */
  getMlotsProfile(): Observable<IMlotProfile[]> {
    return this.getMlots(this.profileFields);
  }

  /**
   * [getNewMlot 从数据库获取一个全新的 Mlot,自带 _id]
   * @return {Observable<IMlot>} [description]
   */
  getNewMlot(): Observable<IMlot> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IMlot>(url)
      .pipe(
        tap(_ => this.log('fetched new Mlot')),
        catchError(this.handleError<IMlot>('getNewMlot'))
      );
  }

  /**
   * 根据 _id 获取单个物料批次
   * @param  {string}            id [物料批次的_id]
   * @return {Observable<IMlot>}    [单个物料批次]
   */
  getMlot(id: string): Observable<IMlot> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IMlot>(url)
      .pipe(
        tap(_ => this.log('fetched Mlot id=${id}')),
        catchError(this.handleError<IMlot>('getMlot'))
      );
  }

  getMlotNo404<Data>(query: any): Observable<IMlot> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IMlot[]>(url)
      .pipe(
        map(Mlots => Mlots[0]), // returns a {0|1} element array
        tap(Mlot => {
          const outcome = Mlot ? `fetched` : `did not find`;
          this.log(`${outcome} Mlot _id=${qstr}`);
        }),
        catchError(this.handleError<IMlot>(`getMlot ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询 Mlots，可设定查询的相关选项]
   * @param  {any}                 query [查询条件，key-value object]
   * @param  {string           =     ''}          field [查询返回的字段]
   * @param  {string           =     '-_id'}      sort  [排序字段]
   * @param  {number           =     0}           limit [查询返回的数量限制]
   * @param  {number           =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMlot[]>}       [查询结果，Mlot 数组]
   */
  searchMlots(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMlot[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMlot[]>(url)
      .pipe(
        tap(_ => this.log(`found Mlots matching "${qstr}"`)),
        catchError(this.handleError<IMlot[]>('searchMlots', []))
      );
  }

  /**
   * [通过过滤条件查询 Mlots，可设定查询的相关选项]
   * @param  {any}                 query [查询条件，key-value object]
   * @param  {string           =     ''}          field [查询返回的字段]
   * @param  {string           =     '-_id'}      sort  [排序字段]
   * @param  {number           =     0}           limit [查询返回的数量限制]
   * @param  {number           =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMlot[]>}       [查询结果，Mlot 数组]
   */
  searchMlotsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMlot[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMlot[]>(url)
      .pipe(
        tap(_ => this.log(`found Mlots matching "${query}"`)),
        catchError(this.handleError<IMlot[]>('searchMlots', []))
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
    return this.http.get<IMlot[]>(url)
      .pipe(
        map(Mlots => Mlots[0]), // returns a {0|1} element array
        tap(Mlot => {
          const outcome = Mlot ? `fetched` : `did not find`;
          this.log(`${outcome} Mlot _id=${qstr}`);
        }),
        catchError(this.handleError<IMlot>(`getHs ${qstr}`))
      );
  }

  /**
   * [判断物料批次是否存在，根据 field 和 value]
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
   * [getMlotsByQuery 获取所有的物料批次信息，查询条件由 Client 提供]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IMlot[]>}   [description]
   */
  getMlotsBy(query: any = {}): Observable<IMlot[]> {
    return this.searchMlots(query);
  }

  getMlotBy(query: any = {}): Observable<IMlot> {
    return this.getMlotNo404(query);
  }

  /**
   * [getMlotsEliteBy 获取所有的物料批次关键信息，查询条件有 Client 提供]
   * @param  {{}}                     query [description]
   * @return {Observable<IMlotElite[]>}       [物料批次关键信息 Array]
   */
  getMlotsEliteBy(query: {}): Observable<IMlotElite[]> {
    return this.searchMlots(query, this.eliteFields);
  }

  /**
   * [getMlotsProfileBy 获取所有的物料批次 profile 信息，查询条件有 Client 提供]
   * @param  {{}}                       query [description]
   * @return {Observable<IMlotProfile[]>}       [物料批次主要信息 Array]
   */
  getMlotsProfileBy(query: {}): Observable<IMlotProfile[]> {
    return this.searchMlots(query, this.profileFields);
  }

  /**
   * 从单个的 Material 中继承相关的属性
   * @param  {IMlot}     ml [原始的 物料批次]
   * @param  {IMdef} m  [物料信息]
   * @return {IMlot}        [新的 物料批次]
   */
  newMLotByMdef(ml: IMlot, m: IMdef): Mlot {
    let model = new Mlot(ml);
    model.DeriveFromMdef(m);
    return model;
  }

  /**
   * 在数据库中，创建新的物料批次
   * @param  {IMlot}             ml [待创建的物料批次]
   * @return {Observable<IMlot>}    [新创建的物料批次]
   */
  createMlot(ml: IMlot): Observable<IMlot> {
    return this.http
      .post<IMlot>(this.baseUrl, ml, httpOptions)
      .pipe(
        tap((NewMlot: IMlot) => this.log(`added Mlot w/ id=${NewMlot._id}`)),
        catchError(this.handleError<IMlot>('createMlot'))
      );
  }

  /**
   * [创建物料批次的同时，创建物料子批次，
   * 这对单件管理的非常有用]
   * @param  {IMlot}             ml [description]
   * @return {Observable<IMlot>}    [description]
   */
  createMlotAndSublot(ml: IMlot): Observable<IMlot> {
    const url = `${this.baseUrl}/sublot`;
    return this.http
      .post<IMlot>(url, ml, httpOptions)
      .pipe(
        catchError(this.handleError<IMlot>('createMlotAndSublot'))
      );
  }

  /**
   * 在数据库中，创建新的物料批次，同时创建物料批次的ass's lot
   * @param  {IMlot}             ml [待创建的物料批次]
   * @return {Observable<IMlot>}    [新创建的物料批次]
   */
  createMlotWithAss(ml: IMlot): Observable<IMlot> {
    const url = `${this.baseUrl}/ass`;
    return this.http
      .post<IMlot>(url, ml, httpOptions)
      .pipe(
        catchError(this.handleError<IMlot>('createMlotWithAss'))
      );
  }

  /**
   * 在数据库中，更新某个物料批次信息
   * @param  {IMlot}             ml [待更新的物料批次]
   * @return {Observable<IMlot>}    [更新后的物料批次]
   */
  updateMlot(ml: IMlot): Observable<IMlot> {
    const url = `${this.baseUrl}/${ml._id}`;
    return this.http
      //.put(url, JSON.stringify(bike), { headers: this.headers })
      .put<IMlot>(url, ml, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Mlot id=${ml._id}`)),
        catchError(this.handleError<any>('updateMlot'))
      );
  }

  patchMlot(id: string, patch: any): Observable<IMlot> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Mlot id=${id}`)),
        catchError(this.handleError<any>('patchMlot'))
      );
  }

  /**
   * 更新物料批次，修改了物料信息，
   * 需要在原物料批次中删除该物料信息，同时在新的物料批次中增加该物料信息。
   * 如果存在多个物料信息，删除原先的物料信息，添加所有新的物料信息
   * @param  {IMlot}             ml [待更新的物料批次]
   * @return {Observable<IMlot>}    [更新后的物料批次]
   */
  updateMlotWithMdef(ml: IMlot): Observable<IMlot> {
    const url = `${this.baseUrl}/${ml._id}/mdef`;
    return this.http
      .put<IMlot>(url, ml, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Mlot with Mdef id=${ml._id}`)),
        catchError(this.handleError<any>('updateMlotWithMdef'))
      );
  }

  /**
   * 在数据库中，删除某个物料批次
   * @param  {IMlot}            ml [description]
   * @return {Observable<void>}    [description]
   */
  deleteMlot(ml: IMlot): Observable<IMlot> {
    const id = typeof ml === 'string' ? ml : ml._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IMlot>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Mlot id=${id}`)),
        catchError(this.handleError<IMlot>('deleteMlot'))
      );
  }

  /**
   * [根据前缀获取下一个 物料批次号]
   * @param  {string}             prex [description]
   * @return {Observable<string>}      [description]
   */
  getNextOid(prex: string): Observable<string> {
    const url = `${this.baseUrl}/next/${prex}`;
    return this.http.get<string>(url, httpOptions)
      .pipe(
      //  tap(_ => this.log(`delete Person id=${id}`)),
        catchError(this.handleError<string>('getNextOid'))
      );
  }

  /**
   * [根据Material Lot 创建 MLot 树状选择]
   * @param  {IMlotProfile[]}  mlp [description]
   * @param  {IMlotElite[] =   []}          sels [description]
   * @return {TreeviewItem[]}      [description]
   */
  newMlotTree(mlp: IMlotProfile[], collapsed: boolean = false, sels: any[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if (mlp && mlp.length > 　0) {
      rntree = _.map(_.groupBy(mlp, 'mclass._id'), (mcs, key) => {
        return new TreeviewItem({
          text: mcs[0].mclass[0].oid,
          value: mcs[0].mclass,
          checked: false,
          collapsed: collapsed,
          children: _.map(_.groupBy(mcs, 'mdef._id'), (ms, key) => {
            return {
              text: ms[0].mdef ? ms[0].mdef.oid : '{}',
              value: ms[0].mdef,
              checked: false,
              collapsed: collapsed,
              children: ms.map(ml => {
                return {
                  //TODO: 待实现
                  text: `${ml.oid} [${ml.subQty.quantity}${ml.subQty.unit}/${ml.qty.quantity}${ml.qty.unit}]`,
                  value: ml,
                  checked: sels ? sels.findIndex(sel => sel._id === ml._id) >= 0 : false,
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

  // getSubLot(id: string, subid: string): Observable<Mlot> {
  //   const url = `${this.baseUrl}/${id}/sub/${subid}`;
  //   return this.http.get(url)
  //     .map((res: Response) => res.json())
  //     .catch(handleError);
  // }

  // createSubLot(id: string, sublot: Msublot): Observable<Msublot> {
  //   Reflect.deleteProperty(sublot, '_id');
  //   const url = `${this.baseUrl}/${id}/sub`;
  //   return this.http
  //     .post(url, sublot)
  //     .map((res: Response) => res.json())
  //     .catch(handleError);
  // }

  // updateSubLot(id: string, sublot: Msublot): Observable<Msublot> {
  //   const url = `${this.baseUrl}/${id}/sub/${sublot._id}`;
  //   return this.http
  //     //.put(url, JSON.stringify(bike), { headers: this.headers })
  //     .put(url, sublot)
  //     .map((res: Response) => res.json())
  //     .catch(handleError);
  // }

  // deleteSubLot(id: string, sublot: Msublot): Observable<void> {
  //   const url = `${this.baseUrl}/${id}/sub/${sublot._id}`;
  //   //return this.http.delete(url, { headers: this.headers })
  //   return this.http.delete(url)
  //     .map(() => sublot)
  //     .catch(handleError);
  // }
  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
