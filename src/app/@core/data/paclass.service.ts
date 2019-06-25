import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { SocketService } from '../socket/socket.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { UtilData } from './util.service';
import { GlobalData } from '../model/global';
import { IPaclass, IPaclassElite } from '../model/paclass';
import { IPhysicalAsset, IPAElite } from '../model/physical-asset';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PaclassService implements IExistService {
  private baseUrl = '/api/physicalAssetClasss';

  private eliteFields = '_id oid code';
  private profileFields = '_id oid code hs manufacture';

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
    this.messageService.add(`PaclassService: ${message}`);
  }

  // /**
  //  * [初始化全局变量hstree]
  //  */
  // init(): void {
  //   this.initTree();
  //   this.socketService.syncUpdates('hierarchyScope', GlobalData.hss, (event, item, array) => {
  //     this.initTree();
  //   });
  // }

  // //构建hstree, 同时初始化hss
  // initTree(): void {
  //   this.getHss().subscribe(hss => {
  //     GlobalData.hss = hss;
  //     GlobalData.hstree = this.createTree(hss);
  //   });
  // }

  // /**
  //  * [根据hss创建hstree]
  //  * @param  {IHierarchyScope[]} hss [description]
  //  * @return {TreeviewItem[]}        [description]
  //  */
  // createTree(hss: IHierarchyScope[]): TreeviewItem[] {
  //   let root = undefined;
  //   for (const hs of hss) {
  //     root = this.insertItem(root, hs);
  //   }
  //   return [new TreeviewItem(root)];
  // }

  // /**
  //  * 获取当前的层级路径，如果hs为空，则返回“,”，说明无父层级
  //  * @param  {IHierarchyScope} hs [description]
  //  * @return {string}             [description]
  //  */
  // getCurrPath(hs: IHierarchyScope): string {
  //   if (_.isNil(hs)) {
  //     return '';
  //   }
  //   return hs.path + hs.name + ',';
  // }

  // /**
  //  * 判断当前HS 是否为叶子结点
  //  * @param  {IHierarchyScope} hs [description]
  //  * @return {boolean}            [description]
  //  */
  // isLeaf(hs: IHierarchyScope): boolean {
  //   if (_.isNil(hs)) {
  //     return false;
  //   }
  //   return hs.level === UtilData.hsLevels[4] ||
  //     hs.level === UtilData.hsLevels[6] ||
  //     hs.level === UtilData.hsLevels[10] ||
  //     hs.level === UtilData.hsLevels[12] ||
  //     hs.level === UtilData.hsLevels[14];
  // }

  /**
   * 获取所有的paclass信息
   * @return {Observable<IPaclass[]>} [paclass Array]
   */
  getPaclasss(field: string = '', sort: string = '-_id'): Observable<IPaclass[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IPaclass[]>(url)
      .pipe(
        tap(_ => this.log('fetched paclasss')),
        catchError(this.handleError('getPaclasss', []))
      );
  }

  /**
   * [获取所有的实物资产类型关键信息]
   * @return {Observable<IPaclassElite[]>} [description]
   */
  getPaclasssElite(): Observable<IPaclassElite[]> {
    return this.getPaclasss(this.eliteFields);
  }


  /**
   * 通过查询条件，获取paclass信息
   * 当查询不到时，返回 undefined
   */
  getPaclassNo404<Data>(query: any): Observable<IPaclass> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IPaclass[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} paclass ${qstr}`);
        }),
        catchError(this.handleError<IPaclass>(`getPaclassNo404 ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个层级信息
   * @param  {number}                     id [层级的 _id]
   * @return {Observable<IPaclass>}    [单个层级信息]
   */
  getPaclass(id: string): Observable<IPaclass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IPaclass>(url)
      .pipe(
        tap(_ => this.log('fetch paclass id=${id}')),
        catchError(this.handleError<IPaclass>('getPaclass'))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPaclass[]>}       [查询结果，hs数组]
   */
  searchPaclasss(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPaclass[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPaclass[]>(url)
      .pipe(
        tap(_ => this.log(`found paclasss matching "${qstr}"`)),
        catchError(this.handleError<IPaclass[]>('searchPaclasss', []))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPaclass[]>}       [查询结果，hs数组]
   */
  searchPaclasssEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPaclass[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPaclass[]>(url)
      .pipe(
        tap(_ => this.log(`found paclasss matching "${query}"`)),
        catchError(this.handleError<IPaclass[]>('searchPaclasssEncode', []))
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
    return this.http.get<IPaclass[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `exist` : `did not exist`;
          this.log(`${outcome} hs _id=${qstr}`);
        }),
        catchError(this.handleError<IPaclass>(`exist ${qstr}`))
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
   * [通过实物资产类型 的 _id 数组 获取 实物资产类型 数组]
   * @param  {string[]}               ids [description]
   * @return {Observable<IPaclass[]>}     [description]
   */
  getManyPaclasss(ids: string[]): Observable<IPaclass[]> {
    return this.searchPaclasssEncode({_id: { $in: ids }});
  }

  /**
   * 在数据库中，创建新的层级信息
   * @param  {IPaclass}             item [待创建的层级信息]
   * @return {Observable<IPaclass>}    [新创建的层级信息]
   */
  createPaclass(item: IPaclass): Observable<IPaclass> {
    return this.http
      .post<IPaclass>(this.baseUrl, item, httpOptions)
      .pipe(
        tap((rnItem: IPaclass) => this.log(`added paclass w/ id=${rnItem._id}`)),
        catchError(this.handleError<IPaclass>('createPaclass'))
      );
  }

  /**
   * 在数据库中，更新某个层级信息
   * @param  {IPaclass}             item [待更新的层级信息]
   * @return {Observable<IPaclass>}    [已更新的层级信息]
   */
  updatePaclass(item: IPaclass): Observable<any> {
    const url = `${this.baseUrl}/${item._id}`;
    return this.http
      .put(url, item, httpOptions)
      .pipe(
        tap(_ => this.log(`updated paclass id=${item._id}`)),
        catchError(this.handleError<any>('updatePaclass'))
      );
  }

  patchPaclass(id: string, patch: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch paclass id=${id}`)),
        catchError(this.handleError<any>('patchPaclass'))
      );
  }

  /**
   * 在数据库中，删除某个层级信息
   * @param  {IPaclass}   item [待删除的层级信息]
   * @return {Observable<void>}    [description]
   */
  deletePaclass(item: IPaclass | string): Observable<IPaclass> {
    const id = typeof item === 'string' ? item : item._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IPaclass>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete paclass id=${id}`)),
        catchError(this.handleError<IPaclass>('deletePaclass'))
      );
  }

  createPaTree(pacs: IPaclass[], collapsed: boolean = true, withPA: boolean = true): TreeviewItem[] {
    let patree: TreeviewItem[] = pacs && pacs.length > 0 ? pacs.map(pac => {
      return new TreeviewItem({
        text: pac.oid,
        value: pac,
        checked: false,
        collapsed: collapsed,
        children: withPA ? _.sortBy(pac.physicalAssets, 'oid').map(pa => {
          return {
            text: `${pa.oid} ${pa.name}`,
            value: pa,
            checked: false
          };
        }) : undefined,
      });
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.physicalAsset.name,
      value: UtilData.systemObj.physicalAsset.name,
      checked: false,
      collapsed: false,
      children: patree
    });
    return [root];
  }

}
