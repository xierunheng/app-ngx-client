import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { SocketService } from '../socket/socket.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { UtilData } from './util.service';
import { GlobalData } from '../model/global';
import { IPhysicalAsset, PhysicalAsset, IPAElite, IPAProfile } from '../model/physical-asset';
import { IPaclass } from '../model/paclass';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PhysicalAssetService implements IExistService {
  private baseUrl = '/api/physicalAssets';

  private eliteFields = '_id oid name ';
  private profileFields = '_id oid name hs loc ';

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
    this.messageService.add(`PhysicalAssetService: ${message}`);
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
  getPhysicalAssets(field: string = '', sort: string = '-_id'): Observable<IPhysicalAsset[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IPhysicalAsset[]>(url)
      .pipe(
        tap(_ => this.log('fetched physicalAssets')),
        catchError(this.handleError('getPhysicalAssets', []))
      );
  }

  /**
   * 通过查询条件，获取paclass信息
   * 当查询不到时，返回 undefined
   */
  getPhysicalAssetNo404<Data>(query: any): Observable<IPhysicalAsset> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IPhysicalAsset[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `fetched` : `did not find`;
          this.log(`${outcome} physicalAsset ${qstr}`);
        }),
        catchError(this.handleError<IPhysicalAsset>(`getPhysicalAssetNo404 ${qstr}`))
      );
  }

  /**
   * 根据 _id 获取单个层级信息
   * @param  {number}                     id [层级的 _id]
   * @return {Observable<PhysicalAsset>}    [单个层级信息]
   */
  getPhysicalAsset(id: string): Observable<IPhysicalAsset> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IPhysicalAsset>(url)
      .pipe(
        tap(_ => this.log('fetch PhysicalAsset id=${id}')),
        catchError(this.handleError<IPhysicalAsset>('getPaclass'))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPhysicalAsset[]>}       [查询结果，hs数组]
   */
  searchPhysicalAssets(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPhysicalAsset[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPhysicalAsset[]>(url)
      .pipe(
        tap(_ => this.log(`found PhysicalAssets matching "${qstr}"`)),
        catchError(this.handleError<IPhysicalAsset[]>('searchPhysicalAssets', []))
      );
  }

  /**
   * [通过过滤条件查询Hss，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPhysicalAsset[]>}       [查询结果，hs数组]
   */
  searchPhysicalAssetsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IPhysicalAsset[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPhysicalAsset[]>(url)
      .pipe(
        tap(_ => this.log(`found PhysicalAsset matching "${query}"`)),
        catchError(this.handleError<IPhysicalAsset[]>('searchPhysicalAssetsEncode', []))
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
    return this.http.get<IPhysicalAsset[]>(url)
      .pipe(
        map(items => items[0]), // returns a {0|1} element array
        tap(item => {
          const outcome = item ? `exist` : `did not exist`;
          this.log(`${outcome} physicalAsset _id=${qstr}`);
        }),
        catchError(this.handleError<IPhysicalAsset>(`exist ${qstr}`))
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
   * 在数据库中，创建新的层级信息
   * @param  {IPhysicalAsset}             item [待创建的层级信息]
   * @return {Observable<IPhysicalAsset>}    [新创建的层级信息]
   */
  createPhysicalAsset(item: IPhysicalAsset): Observable<IPhysicalAsset> {
    return this.http
      .post<IPhysicalAsset>(this.baseUrl, item, httpOptions)
      .pipe(
        tap((rnItem: IPhysicalAsset) => this.log(`added PhysicalAsset w/ id=${rnItem._id}`)),
        catchError(this.handleError<IPhysicalAsset>('createPhysicalAsset'))
      );
  }

  /**
   * 在数据库中，更新某个层级信息
   * @param  {IPhysicalAsset}             item [待更新的层级信息]
   * @return {Observable<IPhysicalAsset>}    [已更新的层级信息]
   */
  updatePhysicalAsset(item: IPhysicalAsset): Observable<any> {
    const url = `${this.baseUrl}/${item._id}`;
    return this.http
      .put(url, item, httpOptions)
      .pipe(
        tap(_ => this.log(`updated PhysicalAsset id=${item._id}`)),
        catchError(this.handleError<any>('updatePhysicalAsset'))
      );
  }

  patchPhysicalAsset(id: string, patch: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch PhysicalAsset id=${id}`)),
        catchError(this.handleError<any>('patchPhysicalAsset'))
      );
  }

  /**
   * 在数据库中，删除某个层级信息
   * @param  {IPhysicalAsset}   item [待删除的层级信息]
   * @return {Observable<void>}    [description]
   */
  deletePhysicalAsset(item: IPhysicalAsset | string): Observable<IPhysicalAsset> {
    const id = typeof item === 'string' ? item : item._id;
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<IPhysicalAsset>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete PhysicalAsset id=${id}`)),
        catchError(this.handleError<IPhysicalAsset>('deletePhysicalAsset'))
      );
  }

  deriveFromPaclasss(pa: IPhysicalAsset, pacs: IPaclass[]): IPhysicalAsset {
    if (pacs && pacs.length > 0) {
      pa.hs = pacs[0].hs;
      pacs.forEach((value, index, array) => {
        pa.prop = _.unionBy(pa.prop, value.prop, '_id');
      });
      pa.paclass = pacs.map((value, index, array) => {
        return _.pick(value, ['_id', 'oid']);
      })
    }
    return pa;
  }

}
