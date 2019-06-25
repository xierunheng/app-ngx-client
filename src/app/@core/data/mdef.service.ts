import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IMclass, IMclassElite, MclassElite } from '../model/mclass';
import { IMdefElite, IMdefProfile, IMdefInfo, IMdef, Mdef } from '../model/mdef';
import { GlobalData } from '../model/global';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MdefService implements IExistService {
  private baseUrl = '/api/materialDefinitions';

  private eliteFields = '_id oid code';
  private profileFields = '_id oid desc code hs mclass assDefs';
  private InfoFields = '_id oid picUrl desc';

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
    this.messageService.add(`MdefService: ${message}`);
  }

  /**
   * [初始化全局变量hstree]
   */
  init(): void {
    this.getMdefBy({oid: 'DUMMY'}).subscribe(dummy => {
      GlobalData.dummyBody = dummy;
    })
  }

  /**
   * 获取所有的物料信息
   * @return {Observable<IMdef[]>} [物料信息Array]
   */
  getMdefs(field: string = '', sort: string = '-_id'): Observable<IMdef[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IMdef[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched Mdefs')),
        catchError(this.handleError('getMdefs', []))
      );
  }

  /**
   * 获取所有的物料关键信息
   * @return {Observable<IMdefElite[]>} [物料关键信息Array]
   */
  getMdefsElite(): Observable<IMdefElite[]> {
    return this.getMdefs(this.eliteFields);
  }

  /**
   * 获取所有的物料 profile 信息
   * @return {Observable<IMdefProfile[]>} [物料关键信息Array]
   */
  getMdefsProfile(): Observable<IMdefProfile[]> {
    return this.getMdefs(this.profileFields);
  }

  /**
   * 获取所有的物料的订单信息
   * @return {Observable<IMdefInfo[]>} [物料关键信息Array]
   */
  getMdefsInfo(): Observable<IMdefInfo[]> {
    return this.getMdefs(this.InfoFields);
  }

  /**
   * 过查询条件，获取物料定义信息
   * 当查询不到时，返回 undefined
   */
  getMdefNo404<Data>(query: any): Observable<IMdef> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IMdef[]>(url)
      .pipe(
        map(Mdefs => Mdefs[0]), // returns a {0|1} element array
        tap(Mdef => {
          const outcome = Mdef ? `fetched` : `did not find`;
          this.log(`${outcome} hs _id=${qstr}`);
        }),
        catchError(this.handleError<IMdef>(`getMdef ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询 Mdefs，可设定查询的相关选项]
   * @param  {any}                 query [查询条件，key-value object]
   * @param  {string           =     ''}          field [查询返回的字段]
   * @param  {string           =     '-_id'}      sort  [排序字段]
   * @param  {number           =     0}           limit [查询返回的数量限制]
   * @param  {number           =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMdef[]>}       [查询结果，Mdefs 数组]
   */
  searchMdefs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMdef[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMdef[]>(url)
      .pipe(
        tap(_ => this.log(`found Mdefs matching "${qstr}"`)),
        catchError(this.handleError<IMdef[]>('searchMdefs', []))
      );
  }

  /**
   * [通过过滤条件查询 Mdefs，可设定查询的相关选项]
   * @param  {any}                 query [查询条件，key-value object]
   * @param  {string           =     ''}          field [查询返回的字段]
   * @param  {string           =     '-_id'}      sort  [排序字段]
   * @param  {number           =     0}           limit [查询返回的数量限制]
   * @param  {number           =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMdef[]>}       [查询结果，Mdefs 数组]
   */
  searchMdefsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMdef[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMdef[]>(url)
      .pipe(
        tap(_ => this.log(`found Mdefs matching "${query}"`)),
        catchError(this.handleError<IMdef[]>('searchMdefs', []))
      );
  }

  /**
   * [统计物料的类型信息]
   * @param  {any}               query [description]
   * @return {Observable<any[]>}       [description]
   */
  aggrClass(hs: any) : Observable<any[]> {
    const url = `${this.baseUrl}/aggr/?filters=${encodeURIComponent(JSON.stringify(hs))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`found Mdefs matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggrClass', []))
      );
  }

  /**
   * 判断 Mdef 是否存在，根据 field 和 value
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
    return this.http.get<IMdef[]>(url)
      .pipe(
        map(Mdefs => Mdefs[0]), // returns a {0|1} element array
        tap(Mdef => {
          const outcome = Mdef ? `fetched` : `did not find`;
          this.log(`${outcome} Mdef _id=${qstr}`);
        }),
        catchError(this.handleError<IMdef>(`getMdef ${qstr}`))
      );
  }

    /**
   * [判断物料定义是否存在，根据 field 和 value]
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
   * [getMdefsEliteBy 获取所有的物料关键信息，查询条件由 Client提供]
   * @param  {[type]}                   query =             {} [description]
   * @return {Observable<IMdefElite[]>}       [description]
   */
  getMdefsEliteBy(query = {}) : Observable<IMdefElite[]> {
    return this.searchMdefs(query, this.eliteFields);
  }



  /**
   * [getMdefsProfileBy 获取所有的物料 profile 信息，查询条件由 Client提供]
   * @param  {[type]}                     query =             {} [description]
   * @return {Observable<IMdefProfile[]>}       [description]
   */
  getMdefsProfileBy(query = {}) : Observable<IMdef[]> {
    return this.searchMdefs(query, this.profileFields)
  }



  getMdefsInfoBy(query = {}) : Observable<IMdefInfo[]> {
    return this.searchMdefs(query, this.InfoFields);
  }

  /**
   * [根据选择的物料类型获取可用的装配项]
   * M for Material, Mc for MateiralClass, Ass for Assembly
   * @param  {string[]}                       ids [description]
   * @return {Observable<IMdefProfile[]>}     [description]
   */
  // getMAssProfileByMc(ids: string[]): Observable<IMdefProfile[]> {
  //   let strIds = ids.join(',');
  //   const url = `${this.baseUrl}/ass/mclass/${strIds}`;
  //   return this.http.get<IMdefProfile[]>(url)
  //     .pipe(
  //       tap(_ => this.log('fetched ass by mclass ids')),
  //       catchError(this.handleError('getMAssProfileByMc', []))
  //     );
  // }

  /**
   * [从数据库获取一个全新的 Mdef,自带 _id]
   * @return {Observable<IMdef>} [description]
   */
  getNewMdef(): Observable<IMdef> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IMdef>(url)
      .pipe(
        tap(_ => this.log('fetched new Mdef')),
        catchError(this.handleError<IMdef>('getNewMdef'))
      );
  }

  /**
   * 根据 _id 获取单个物料信息
   * @param  {string}                id [物料的 _id]
   * @return {Observable<IMdef>}    [单个物料信息]
   */
  getMdef(id: string): Observable<IMdef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IMdef>(url)
      .pipe(
        tap(_ => this.log('fetched Mdef id=${id}')),
        catchError(this.handleError<IMdef>('getMdef'))
      );
  }

  /**
   * [getMdefsBy 获取所有的物料信息，查询条件由 Client 提供]
   * @param  {any              = {}}        query [description]
   * @return {Observable<IMdef[]>}   [description]
   */
  getMdefsBy(query: any = {}): Observable<IMdef[]> {
    return this.searchMdefs(query);
  }

  getMdefBy(query: any = {}): Observable<IMdef> {
    return this.getMdefNo404(query);
  }

  /**
   * 在数据库中，创建新的物料信息
   * @param  {IMdef}             m [待创建的物料信息]
   * @return {Observable<IMdef>}   [新创建的物料信息]
   */
  createMdef(m: IMdef): Observable<IMdef> {
    return this.http
      .post<IMdef>(this.baseUrl, m, httpOptions)
      .pipe(
        tap((NewMdef: IMdef) => this.log(`added Mdef w/ id=${NewMdef._id}`)),
        catchError(this.handleError<IMdef>('createMdef'))
      );
  }

    /**
   * 在数据库中，批量创建新的物料信息
   * @param  {IMdef[]}             m [待创建的物料信息]
   * @return {Observable<IMdef>}   [新创建的物料信息]
   */
  upsertMdefs(ms: IMdef[]): Observable<IMdef[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<IMdef[]>(url, ms, httpOptions)
      .pipe(
        catchError(this.handleError<IMdef[]>('upsertMdefs'))
      );
  }

  /**
   * 在数据库中，更新某个物料信息
   * @param  {IMdef}             m [待更新的物料信息]
   * @return {Observable<IMdef>}   [已更新的物料信息]
   */
 // updateMdef(m: IMdef, mclss: boolean, elite: boolean = false): Observable<IMdef> {
    // let strElite = '';
    // if (mclss) {
    //   strElite = 'class';
    // }
    // else if (elite) {
    //   strElite = 'elite';
    // }
    // const url = `${this.baseUrl}/${m._id}/${strElite}`;
  updateMdef(m: IMdef): Observable<IMdef> {
    const url = `${this.baseUrl}/${m.oid}`;
    return this.http
      .put<IMdef>(url, m, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Mdef id=${m.oid}`)),
        catchError(this.handleError<any>('updateMdef'))
      );
  }

  patchMdef(id: string, patch: any): Observable<IMdef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Mdef id=${id}`)),
        catchError(this.handleError<any>('patchMdef'))
      );
  }

  /**
   * 在数据库中，删除某个物料信息
   * @param  {IMdef}        m [待删除的物料信息]
   * @return {Observable<void>}   []
   */
  deleteMdef(m: IMdef): Observable<IMdef> {
    const id = typeof m === 'string' ? m : m._id;
    const url = `${this.baseUrl}/${m._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IMdef>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Mdef id=${id}`)),
        catchError(this.handleError<IMdef>('deleteMdef'))
      );
  }

  /**
   * [创建新的物料定义 Tree，包含物料类型和物料定义信息]
   * @param  {IMdefProfile[]}  msp [description]
   * @param  {boolean}  collapsed  [默认是展开的，有时需要缩合]
   * @param  {IMdefProfile[] =   []}          sels [description]
   * @return {TreeviewItem[]}          [description]
   */
  newMdefTree(msp: IMdefProfile[], collapsed: boolean = true, sels: IMdefProfile[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if(msp && msp.length > 0) {
      rntree = _.map(_.groupBy(msp, 'mclass[0]._id'), (value, key) => {
        return new TreeviewItem({
          text: value[0].mclass[0].oid,
          value: value[0].mclass[0],
          checked: false,
          collapsed: collapsed,
          children: value.map(m => {
            return {
              text: `${m.oid}`,
              value: m,
              checked: sels ? sels.findIndex(sel => sel._id === m._id) >= 0 : false,
            }
          })
        });
      });
    }
    return rntree;
  }

  //从多个Mclass中继承相关属性，
  deriveFromMclasses(m: IMdef, mcs: IMclass[]) {
    if (mcs && mcs.length > 0) {
      m.hs = mcs[0].hs;
      mcs.forEach((value, index, array) => {
        m.prop = _.unionBy(m.prop, value.prop, '_id');
      });
      m.mclass = mcs.map(item => {
        return new MclassElite(item);
      });
      m.assType = mcs[0].assType;
      m.assRel = mcs[0].assRel;
    }
  }
}
