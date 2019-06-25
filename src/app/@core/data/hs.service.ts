import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { SocketService } from '../socket/socket.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { UtilData } from './util.service';
import { GlobalData } from '../model/global';
import { IHierarchyScope, HierarchyScope, IHSElite, IHSProfile } from '../model/hs';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HsService implements IExistService {
  private baseUrl = '/api/hierarchyScopes';

  private eliteFields = '_id name code';
  private profileFields = '_id name code path';

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
    this.messageService.add(`HsService: ${message}`);
  }

  /**
   * [初始化全局变量hstree]
   */
  init(): void {
    this.initTree();
    this.socketService.syncUpdates('hierarchyScope', GlobalData.hss, (event, item, array) => {
      this.initTree();
    });
  }

  //构建hstree, 同时初始化hss
  initTree(): void {
    // GlobalData.hss$ = this.getHss();
    // this.getHss().subscribe(hss => {
    GlobalData.hss$ = this.searchHssEncode({path: { $regex: '传奇陶瓷'}});
    this.searchHssEncode({path: { $regex: '传奇陶瓷'}}).subscribe(hss => {
      GlobalData.hss = hss;
      GlobalData.hstree = this.createTree(hss);
    });
  }

  /**
   * [根据hss创建hstree]
   * @param  {IHierarchyScope[]} hss [description]
   * @return {TreeviewItem[]}        [description]
   */
  createTree(hss: IHierarchyScope[]): TreeviewItem[] {
    let root = undefined;
    for (const hs of hss) {
      root = this.insertItem(root, hs);
    }
    return [new TreeviewItem(root)];
  }

  /**
   * insert a hierarchyScope into a tree, 递归,
   * 用于HierarchyScope的选择
   * @param  {TreeItem}        root [the root treeItem]
   * @param  {IHierarchyScope} hs   [a new hierarchyScope]
   * @return {TreeItem}             [the root treeItem
   * which have inserted the new hierarchyScope]
   */
  insertItem(root: TreeItem, hs: IHierarchyScope): TreeItem {
    if (_.isNil(root)) {
      return this.newTreeItem(hs, false);
    }

    const currPath = this.getCurrPath(root.value as IHierarchyScope);
    if (hs.path === currPath) {

      //前三层 Enterprise, Site, Area 默认是打开的，其他默认是关闭的
      root.children.push(this.newTreeItem(hs,
        hs.level !== UtilData.hsLevels[0] &&
        hs.level !== UtilData.hsLevels[1]));
      return root;
    } else if (hs.path.startsWith(currPath) && root.children) {
      for (const child of root.children) {
        this.insertItem(child, hs);
      }
    }

    return root;
  }
   /**
   * create a new treeItem, used one HierarchyScope
   * @param  {IHierarchyScope} hs [a hierarchyScope]
   * @return {TreeItem}           [a new treeItem, if hs null ,return undefined]
   */
  newTreeItem(hs: IHierarchyScope, collapsed: boolean = false): TreeItem {
    if (_.isNil(hs)) {
      return undefined;
    }
    return {
      text: hs.name,
      value: hs,
      checked: false,
      collapsed: collapsed,
      children: []
    };
  }
 
  /**
   * 获取当前的层级路径，如果hs为空，则返回“,”，说明无父层级
   * @param  {IHierarchyScope} hs [description]
   * @return {string}             [description]
   */
  getCurrPath(hs: IHierarchyScope): string {
    if (_.isNil(hs)) {
      return '';
    }
    return hs.path + hs.name + ',';
  }

  /**
   * 判断当前HS 是否为叶子结点
   * @param  {IHierarchyScope} hs [description]
   * @return {boolean}            [description]
   */
  isLeaf(hs: IHierarchyScope): boolean {
    if (_.isNil(hs)) {
      return false;
    }
    return hs.level === UtilData.hsLevels[4] ||
      hs.level === UtilData.hsLevels[6] ||
      hs.level === UtilData.hsLevels[10] ||
      hs.level === UtilData.hsLevels[12] ||
      hs.level === UtilData.hsLevels[14];
  }

  /**
   * 获取所有的层级信息
   * @return {Observable<IHierarchyScope[]>} [层级信息 Array]
   */
  getHss(field: string = '', sort: string = 'path'): Observable<IHierarchyScope[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IHierarchyScope[]>(url)
      .pipe(
        tap(_ => this.log('fetched hss')),
        catchError(this.handleError('getHss', []))
      );
  }

  /** GET hs by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getHsNo404<Data>(query: any): Observable<IHierarchyScope> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IHierarchyScope[]>(url)
      .pipe(
        map(hss => hss[0]), // returns a {0|1} element array
        tap(hs => {
          const outcome = hs ? `fetched` : `did not find`;
          this.log(`${outcome} hs _id=${qstr}`);
        }),
        catchError(this.handleError<IHierarchyScope>(`getHs ${qstr}`))
      );
  }

  /**
   * [getNewHS 从数据库获取一个全新的 Hs,自带 _id]
   * @return {Observable<IHierarchyScope>} [description]
   */
  getNewHS(): Observable<IHierarchyScope> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IHierarchyScope>(url)
      .pipe(
        tap(_ => this.log('fetch new hs ')),
        catchError(this.handleError<IHierarchyScope>('getNewHS'))
      );
  }

  /**
   * 根据 _id 获取单个层级信息
   * @param  {string}                     id [层级的 _id]
   * @return {Observable<IHierarchyScope>}    [单个层级信息]
   */
  getHs(id: string): Observable<IHierarchyScope> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IHierarchyScope>(url)
      .pipe(
        tap(_ => this.log('fetch hs id=${id}')),
        catchError(this.handleError<IHierarchyScope>('getHS'))
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
  searchHss(query: any, field: string = '', sort: string = '_id', limit: number = 0, skip: number = 0): Observable<IHierarchyScope[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IHierarchyScope[]>(url)
      .pipe(
        tap(_ => this.log(`found hss matching "${qstr}"`)),
        catchError(this.handleError<IHierarchyScope[]>('searchHss', []))
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
  searchHssEncode(query: any, field: string = '', sort: string = '_id', limit: number = 0, skip: number = 0): Observable<IHierarchyScope[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IHierarchyScope[]>(url)
      .pipe(
        tap(_ => this.log(`found hss matching "${query}"`)),
        catchError(this.handleError<IHierarchyScope[]>('searchHssEncode', []))
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
    return this.http.get<IHierarchyScope[]>(url)
      .pipe(
        map(hss => hss[0]), // returns a {0|1} element array
        tap(hs => {
          const outcome = hs ? `fetched` : `did not find`;
          this.log(`${outcome} hs _id=${qstr}`);
        }),
        catchError(this.handleError<IHierarchyScope>(`getHs ${qstr}`))
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
   * [getHssElite 获取所有的层级关键信息]
   * @return {Observable<IHSElite[]>} [description]
   */
  getHssElite(): Observable<IHSElite[]> {
    return this.getHss(this.eliteFields);
  }

  /**
   * [getHssProfile 获取所有的层级 profile 信息]
   * @return {Observable<IHSProfile[]>} [description]
   */
  getHssProfile(): Observable<IHSProfile[]> {
    return this.getHss(this.profileFields);
  }

  /**
   * [getHssBy 获取所有的层级信息, 查询条件由 Client 提供]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IHierarchyScope[]>}   [description]
   */
  getHssBy(query: any = {}): Observable<IHierarchyScope[]> {
    return this.searchHss(query);
  }

  /**
   * [getHssEliteBy 获取所有的层级关键信息, 查询条件由 Client 提供]
   * @param  {{}}                          query [description]
   * @return {Observable<IHSElite[]>}       [description]
   */
  getHssEliteBy(query: any = {}): Observable<IHSElite[]> {
    return this.searchHss(query, this.eliteFields);
  }

  /**
   * [getHssProfileBy 获取所有的层级 profile 信息, 查询条件由 Client 提供]
   * @param  {{}}                          query [description]
   * @return {Observable<IHSProfile[]>}       [description]
   */
  getHssProfileBy(query: any = {}): Observable<IHSProfile[]> {
    return this.searchHss(query, this.profileFields);
  }


  /**
   * 在数据库中，创建新的层级信息
   * @param  {HierarchyScope}             hs [待创建的层级信息]
   * @return {Observable<HierarchyScope>}    [新创建的层级信息]
   */
  createHs(hs: HierarchyScope): Observable<HierarchyScope> {
    return this.http
      .post<IHierarchyScope>(this.baseUrl, hs, httpOptions)
      .pipe(
        tap((newHs: IHierarchyScope) => this.log(`added hs w/ id=${newHs._id}`)),
        catchError(this.handleError<IHierarchyScope>('createHs'))
      );
  }

  /**
   * 在数据库中，更新某个层级信息
   * @param  {HierarchyScope}             hs [待更新的层级信息]
   * @return {Observable<HierarchyScope>}    [已更新的层级信息]
   */
  updateHs(hs: HierarchyScope, elite: boolean = false): Observable<any> {
    let strElite = elite ? 'elite' : '';
    const url = `${this.baseUrl}/${hs._id}/${strElite}`;
    return this.http
      .put(url, hs, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hs id=${hs._id}`)),
        catchError(this.handleError<any>('updateHs'))
      );
  }

  patchHs(id: string, patch: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch hs id=${id}`)),
        catchError(this.handleError<any>('patchHs'))
      );
  }

  /**
   * 在数据库中，删除某个层级信息
   * @param  {HierarchyScope}   hs [待删除的层级信息]
   * @return {Observable<void>}    [description]
   */
  deleteHs(hs: HierarchyScope | string): Observable<HierarchyScope> {
    const id = typeof hs === 'string' ? hs : hs._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IHierarchyScope>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete hs id=${id}`)),
        catchError(this.handleError<IHierarchyScope>('deleteHs'))
      );
  }

  /**
   * 根据 HierarchyScope 创建 fullcalendar-schedule 使用的 resources
   * @param  {[type]} HierarchyScope [description]
   * @return {any[]}                 [description]
   */
  createResources(hss: HierarchyScope[]): any[] {
    let resources: any[] = hss
      //Area
      .filter(item => item.level === UtilData.hsLevels[2])
      .map(item => {
        //去掉前后多余的空白
        let paths: string[] = item.path.split(',').filter(item => item.trim() !== '');
        return {
          id: item._id,
          title: item.name,
          name: item.name,
          code: item.code,
          level: item.level,
          path: item.path,
          remark: item.remark,
          enterprise: paths[0],
          site: paths[1],
          children: [],
        };
      });

    //ProcessCell ProductionLine ProductionUnit StorageZone WorkCenter
    let children = hss.filter(item => item.level === UtilData.hsLevels[3] ||
      item.level === UtilData.hsLevels[5] ||
      item.level === UtilData.hsLevels[7] ||
      item.level === UtilData.hsLevels[8] ||
      item.level === UtilData.hsLevels[11]);
    children.forEach(item => {
      let paths: string[] = item.path.split(',').filter(item => item.trim() !== '');

      let resource = resources.find(item => item.name === paths[2]);
      if (resource) {
        resource.children.push({
          id: item._id,
          name: item.name,
          code: item.code,
          level: item.level,
          path: item.path,
          remark: item.remark,
        });
      }

    });

    return resources;
  }



  /**
   * create a new path treeItem, used one hs
   *
   * @param  {IHierarchyScope} hs [a hierarchyScope]
   * @return {TreeItem}           [a new path treeItem]
   */
  newPathItem(hs: IHierarchyScope): TreeItem {
    if (_.isNil(hs)) {
      return {
        text: ',',
        value: ',',
        checked: false,
        children: []
      };
    }
    return {
      text: hs.name,
      value: this.getCurrPath(hs),
      checked: false,
      children: []
    };
  }

  /**
   * insert a new hs to path treeItem root,
   * 用于创建HierarchyScope的层级路径
   * @param  {TreeItem}        root [层级路径的root]
   * @param  {IHierarchyScope} hs   [a new hierarchyScope]
   * @return {TreeItem}             [the root path treeItem]
   */
  insertPathItem(root: TreeItem, hs: IHierarchyScope): TreeItem {
    if (_.isNil(root)) {
      return this.newPathItem(hs);
    }

    if (hs.path === root.value) {
      root.children.push(this.newPathItem(hs));
      return root;
    } else if (hs.path.startsWith(root.value) && root.children) {
      for (const child of root.children) {
        this.insertPathItem(child, hs);
      }
    }

    return root;
  }

  getChildLevel(strPath: string, hss: IHierarchyScope[]): string {
    let paths: string[] = strPath.split(',').filter(item => item.trim() !== '');
    let levels = paths.map(item => {
      let hs = hss.find(hs => hs.name === item);
      return hs ? hs.level : undefined;
      // return hss.find(hs => hs.name === item).level;
    });
    let rnLevel = UtilData.hsLevels[0];
    switch (_.last(levels)) {
      case UtilData.hsLevels[0]:
        rnLevel = UtilData.hsLevels[1];
        break;
      case UtilData.hsLevels[1]:
        rnLevel = UtilData.hsLevels[2];
        break;
      case UtilData.hsLevels[2]:
        rnLevel = UtilData.hsLevels[11];
        break;
      case UtilData.hsLevels[3]:
        rnLevel = UtilData.hsLevels[4];
        break;
      case UtilData.hsLevels[5]:
        rnLevel = UtilData.hsLevels[6];
        break;
      case UtilData.hsLevels[7]:
        rnLevel = UtilData.hsLevels[4];
        break;
      case UtilData.hsLevels[8]:
        rnLevel = UtilData.hsLevels[9];
        break;
      case UtilData.hsLevels[9]:
        rnLevel = UtilData.hsLevels[10];
        break;
      case UtilData.hsLevels[11]:
        rnLevel = UtilData.hsLevels[12];
        break;
      default:
        rnLevel = UtilData.hsLevels[0];
        break;
    }
    return rnLevel;
  }

}
