import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';

import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IMclass, IMclassElite, MclassElite } from '../model/mclass';
import { GlobalData } from '../model/global';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MclassService implements IExistService {
  private baseUrl = '/api/materialClasss';

  private eliteFields = '_id oid code';
  private profileFields = '-prop -mdefs -assClasss';

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
    this.messageService.add(`MclassService: ${message}`);
  }

  /**
   * [初始化全局变量mcs]
   */
  init(): void {
    this.getMclasss().subscribe(mcs => {
      GlobalData.mcs = mcs;
      GlobalData.mtree = this.newMTree(mcs);
      this.socketService.syncUpdates('materialClass', GlobalData.mcs, (event, item, array) => {
        GlobalData.mtree = this.newMTree(GlobalData.mcs);
      });
    })
  }

  /**
   * 获取所有的 Mclass 物料类型信息
   * @return {Observable<IMclass[]>} [物料类型信息Array]
   */
  getMclasss(field: string = '', sort: string = '-_id'): Observable<IMclass[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IMclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched Mclasss')),
        catchError(this.handleError('getMclasss', []))
      );
  }

  /**
   * 通过物料类型 的 _id 数组 获取 物料类型 数组
   * @param  {string[]}              ids [description]
   * @return {Observable<IMclass[]>}     [description]
   */
  getManyMclasses(ids: string[]): Observable<IMclass[]> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}`;
    return this.http.get<IMclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched Mclasss by many ids')),
        catchError(this.handleError('getManyMclasses', []))
      );
  }

  /**
   * 获取所有的物料类型关键信息
   * @return {Observable<IMclassElite[]>} [物料类型关键信息Array]
   */
  getMclasssElite(): Observable<IMclassElite[]> {
    return this.getMclasss(this.eliteFields);
  }

  /**
   * [getMclasssProfile 获取所有的物料类型 Profile 信息]
   * @return {Observable<IMclass[]>} [description]
   */
  getMclasssProfile(): Observable<IMclass[]> {
    return this.getMclasss(this.profileFields);
  }

  /**
   * 通过物料类型关键信息 的 _id 数组 获取 物料类型关键信息 数组
   * @param  {string[]}                   ids [物料类型关键信息 的 _id 数组]
   * @return {Observable<IMclassElite[]>}     [物料类型关键信息 数组]
   */
  getManyMclasssElite(ids: string[]): Observable<IMclassElite[]> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/elite/${strIds}`;
    return this.http.get<IMclassElite[]>(url)
      .pipe(
        tap(_ => this.log('fetched Mclasss by many ids')),
        catchError(this.handleError('getManyMclasses', []))
      );
  }

    /**
   * [getNewMclass 从数据库获取一个全新的 Mclass,自带 _id]
   * @return {Observable<IMclass>} [description]
   */
  getNewMclass(): Observable<IMclass> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IMclass>(url)
      .pipe(
        tap(_ => this.log('fetched new Mclass')),
        catchError(this.handleError<IMclass>('getNewMclass'))
      );
  }

  /**
   * 根据 _id 获取单个物料类型
   * @param  {string}              id [物料类型的 _id]
   * @return {Observable<IMclass>}    [单个物料类型信息]
   */
  getMclass(id: string): Observable<IMclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IMclass>(url)
      .pipe(
        tap(_ => this.log('fetched Mclass id=${id}')),
        catchError(this.handleError<IMclass>('getMclass'))
      );
  }

  /**
   * 通过查询条件，获取 Mclass 信息
   * 当查询不到时，返回 undefined
   */
  getMclassNo404<Data>(query: any): Observable<IMclass> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IMclass[]>(url)
      .pipe(
        map(Mclasss => Mclasss[0]), // returns a {0|1} element array
        tap(Mclass => {
          const outcome = Mclass ? `fetched` : `did not find`;
          this.log(`${outcome} Mclass _id=${qstr}`);
        }),
        catchError(this.handleError<IMclass>(`getMclass ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询Mclasss，可设定查询的相关选项]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMclass[]>}       [查询结果，Mclass 数组]
   */
  searchMclasss(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMclass[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Mclasss matching "${qstr}"`)),
        catchError(this.handleError<IMclass[]>('searchMclasss', []))
      );
  }

  /**
   * [通过过滤条件查询Mclasss，可设定查询的相关选项]
   * @param  {any}                   query [description]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IMclass[]>}       [查询结果，Mclass 数组]
   */
  searchMclasssEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IMclass[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IMclass[]>(url)
      .pipe(
        tap(_ => this.log(`found Mclasss matching "${query}"`)),
        catchError(this.handleError<IMclass[]>('searchMclasss', []))
      );
  }

  /**
   * 判断 Mclass 是否存在，根据 field 和 value
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
    return this.http.get<IMclass[]>(url)
      .pipe(
        map(Mclasss => Mclasss[0]), // returns a {0|1} element array
        tap(Mclass => {
          const outcome = Mclass ? `fetched` : `did not find`;
          this.log(`${outcome} Mclass _id=${qstr}`);
        }),
        catchError(this.handleError<IMclass>(`getMclass ${qstr}`))
      );
  }

  /**
   * [getMclasssByQuery 获取所有的 Mclass 物料类型信息，查询条件由 Client 提供]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IMclass[]>}   [description]
   */
  getMclasssBy(query: any = {}): Observable<IMclass[]> {
    return this.searchMclasss(query);
  }

  /**
   * [getMclasssEliteBy 获取所有的 Mclass 物料类型关键信息，查询条件由 Client 提供]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IMclassElite[]>}   [物料类型关键信息 Array]
   */
  getMclasssEliteBy(query: any = {}): Observable<IMclassElite[]> {
    return this.searchMclasss(query, this.eliteFields);
  }

  /**
   * [getMclasssProfileBy 获取所有的 Mclass 物料类型 Profile 信息，查询条件由 Client 提供]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IMclass[]>}   [description]
   */
  getMclasssProfileBy(query: any = {}): Observable<IMclass[]> {
    return this.searchMclasss(query, this.profileFields);
  }

  getMclassBy(query: any = {}): Observable<IMclass> {
    return this.getMclassNo404(query);
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
   * 在数据库中，创建新的物料类型
   * @param  {IMclass}             mc [待创建的物料类型]
   * @return {Observable<IMclass>}    [新创建的物料类型]
   */
  createMclass(mc: IMclass): Observable<IMclass> {
    return this.http
      .post<IMclass>(this.baseUrl, mc, httpOptions)
      .pipe(
        tap((NewMclass: IMclass) => this.log(`added Mclass w/ id=${NewMclass._id}`)),
        catchError(this.handleError<IMclass>('createMclass'))
      );
  }

  /**
   * 在数据库中，更新某个物料类型
   * @param  {IMclass}             mc [待更新的物料类型]
   * @return {Observable<IMclass>}    [已更新的物料类型]
   */
  updateMclass(mc: IMclass): Observable<IMclass> {
    const url = `${this.baseUrl}/${mc._id}`;
    return this.http
      .put<IMclass>(url, mc, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Mclass id=${mc._id}`)),
        catchError(this.handleError<any>('updateMclass'))
      );
  }

  patchMclass(id: string, patch: any): Observable<IMclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Mclass id=${id}`)),
        catchError(this.handleError<any>('patchMclass'))
      );
  }

  /**
   * 在数据库中，删除某个物料类型
   * @param  {IMclass}          mc [待删除的物料类型]
   * @return {Observable<void>}    [description]
   */
  deleteMclass(mc: IMclass): Observable<IMclass> {
    const id = typeof mc === 'string' ? mc : mc._id;
    const url = `${this.baseUrl}/${mc._id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IMclass>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Mclass id=${id}`)),
        catchError(this.handleError<IMclass>('deleteMclass'))
      );
  }

  /**
   * 把mclassElite列表作为 assemblyItem的可选项，用于mclass的定义
   * @param  {IMclassElite[]} mcs [description]
   * @return {TreeviewItem[]}         [description]
   */
  newMclassTree(mcs: IMclassElite[], sels: IMclassElite[] = []): TreeviewItem[] {
    return mcs && mcs.length > 0 ? mcs.map(item => {
      return new TreeviewItem({
        text: `${item.oid} [${item.code}]`,
        value: new MclassElite(item),
        checked: sels ? sels.findIndex(sel => sel._id === item._id) >= 0 : false,
        children: undefined,
      });
    }) : [];
  }

  /**
   * [根据物料类型，创建Material Tree]
   * @param  {IMclass[]}      mcs [物料类型列表]
   * @param  {boolean     =   false}       collapsed [是否收缩]
   * @param  {boolean     =   true}        withMdef  [是否包含物料定义]
   * @return {TreeviewItem[]}     [description]
   */
  newMTree(mcs: IMclass[], collapsed: boolean = false, withMdef: boolean = true): TreeviewItem[] {
    return mcs && mcs.length > 0 ? mcs.map(mc => {
      return new TreeviewItem({
        text: mc.oid,
        value: new MclassElite(mc),
        checked: false,
        collapsed: collapsed,
        children: withMdef ? _.sortBy(mc.mdefs, 'oid').map(md => {
          return {
            text: md.oid,
            value: {
              _id: md._id,
              oid: md.oid,
              code: md.code,
              mclass: [new MclassElite(mc)]
            },
            checked: false
          };
        }) : undefined,
      });
    }) : [];
  }

  /**
   * [更新MclassTree, 把选择项的ckecked置true]
   * 1. 在tree本层查找, by _id or oid
   * 2. 在tree's children层查找，如果sels & tree's child 存在
   * 3. 递归
   * @param  {TreeviewItem[]} root [description]
   * @param  {IMclassElite[]} sels [description]
   * @return {TreeviewItem[]}      [description]
   */
  updateMclassTree(root: TreeviewItem[], sels: IMclassElite[]): TreeviewItem[] {
    if (sels && sels.length > 0 && root && root.length > 0) {
      root.forEach(item => {
        let index = sels.findIndex(sel => (sel._id && item.value._id && sel._id === item.value._id) ||
          (sel.oid && item.value.oid && sel.oid === item.value.oid));
        if (index > -1) {
          item.checked = true;
          sels.splice(index, 1);
        }
        if (sels && sels.length > 0 && item.children && item.children.length > 0) {
          this.updateMclassTree(item.children, sels);
        }
      });
    }
    return root;
  }

  /**
   * [创建Assembly Tree]
   * @param  {IMclass[]}      mcs [description]
   * @return {TreeviewItem[]}     [description]
   */
  createTree(mcs: IMclass[]): TreeviewItem[] {
    let _mcs = _.cloneDeep(mcs);
    let root = undefined;
    root = this.newTreeItem(mcs.find(item => item.oid === '商品'));
    for (let i = 0; i < _mcs.length; i++) {
      for (const mc of _mcs) {
        root = this.insertItem(root, mc, _mcs);
      }
    }
    let rn: TreeviewItem[] = [];
    rn.push(new TreeviewItem(root));
    _mcs.forEach(item => {
      rn.push(new TreeviewItem(this.newTreeItem(item)));
    })
    // return [new TreeviewItem(root)];
    return rn;
  }

  /**
   * [根据mclass[], 创建物料树]
   * @param  {IMclass[]}      pcs [description]
   * @param  {boolean     =   false}       collapsed  [description]
   * @param  {boolean     =   true}        withPerson [description]
   * @return {TreeviewItem[]}     [description]
   */
  createMTree(mcs: IMclass[], collapsed: boolean = true, withPerson: boolean = true): TreeviewItem[] {
    let mtree: TreeviewItem[] = mcs && mcs.length > 0 ? mcs.map(mc => {
      return new TreeviewItem({
        text: mc.oid,
        value: mc,
        checked: false,
        collapsed: collapsed,
        children: withPerson ? _.sortBy(mc.mdefs, 'oid').map(m => {
          return {
            text: `${m.oid}`,
            value: m,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.material.name,
      value: UtilData.systemObj.material.name,
      checked: false,
      collapsed: false,
      children: mtree
    });
    console.log(root);
    return [root];
  }

  insertItem(root: TreeItem, mc: IMclass, mcs: IMclass[]): TreeItem {
    if (_.isNil(root)) {
      return this.newTreeItem(mc, false);
    }

    if (root.value.assClasss.findIndex(item => item._id === mc._id) > -1) {
      root.children.push(this.newTreeItem(mc));
      _.pull(mcs, mc);
      return root;
    } else {
      root.children.forEach(item => this.insertItem(item, mc, mcs));
    }
    return root;
  }

  /**
 * create a new treeItem, used one HierarchyScope
 * @param  {IHierarchyScope} hs [a hierarchyScope]
 * @return {TreeItem}           [a new treeItem, if hs null ,return undefined]
 */
  newTreeItem(mc: IMclass, collapsed: boolean = false): TreeItem {
    if (_.isNil(mc)) {
      return undefined;
    }
    return {
      text: mc.oid,
      value: mc,
      checked: false,
      collapsed: collapsed,
      children: []
    };
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
