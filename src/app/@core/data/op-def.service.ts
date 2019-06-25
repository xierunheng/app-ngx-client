import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IOpDefElite, IOpDef, IOpseg, Opseg } from '../model/op-def';
import { IProseg } from '../model/proseg';
import {IExistService} from './common.service';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { MessageService } from './message.service';
import { UtilData } from './util.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OpDefService implements IExistService {
  private baseUrl = '/api/opDefinitions';
  private eliteFields = '_id oid ver code';
  private profileFields = '-opseg -opmb';

  constructor(private http: HttpClient,
    private messageService: MessageService) {
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
    this.messageService.add(`OpDefinitionService: ${message}`);
  }

  /**
   * 获取所有的操作定义信息
   * @return {Observable<IOpDef[]>} [操作定义信息Array]
   */
  getOpDefinitions(field: string = '', sort: string = '-_id'): Observable<IOpDef[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IOpDef[]>(this.baseUrl)
      .pipe(
        tap(_ => this.log('fetched opDefs')),
        catchError(this.handleError('getOpDefinitions', []))
      );
  }


  /** GET OpDefinition by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getOpDefNo404<Data>(query: any): Observable<IOpDef> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IOpDef[]>(url)
      .pipe(
        map(opds => opds[0]), // returns a {0|1} element array
        tap(opd => {
          const outcome = opd ? `fetched` : `did not find`;
          this.log(`${outcome} OpDef _id=${qstr}`);
        }),
        catchError(this.handleError<IOpDef>(`getOpDef ${qstr}`))
      );
  }

  /**
   * 获取所有的操作定义关键信息
   * @return {Observable<IOpDefElite[]>} [操作定义关键信息Array]
   */
  getOpDefinitionsElite(): Observable<IOpDefElite[]> {
    return this.getOpDefinitions(this.eliteFields);
  }

  /**
   * [getOpDefinitionsProfile 获取所有的操作定义 Profile 信息]
   * @return {Observable<IOpDef[]>} [description]
   */
  getOpDefinitionsProfile(): Observable<IOpDef[]> {
    return this.getOpDefinitions(this.profileFields);
  }

/**
 * [getNewOpDefinition 从数据库获取一个全新的 OpDefinition,自带 _id]
 * @return {Observable<IOpDef>} [description]
 */
  getNewOpDefinition(): Observable<IOpDef> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IOpDef>(url)
      .pipe(
        tap(_ => this.log('fetch new opDef ')),
        catchError(this.handleError<IOpDef>('getNewOpDefinition'))
      );
  }

  /**
   * 根据 _id 获取单个操作定义信息
   * @param  {string}             id [操作定义的_id]
   * @return {Observable<IOpDef>}    [单个操作定义信息]
   */
  getOpDefinition(id: string): Observable<IOpDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IOpDef>(url)
      .pipe(
        tap(_ => this.log('fetch opDef id=${id}')),
        catchError(this.handleError<IOpDef>('getOpDefinition'))
      );
  }

  /**
   * [通过过滤条件查询OpDefs，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IHierarchyScope[]>}       [查询结果，OpDef数组]
   */
  searchOpDefs(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpDef[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpDef[]>(url)
      .pipe(
        tap(_ => this.log(`found searchOpdDefs matching "${qstr}"`)),
        catchError(this.handleError<IOpDef[]>('searchOpdDefs', []))
      );
  }

  /**
   * [通过过滤条件查询OpDefs，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IOpDef[]>}       [查询结果，hs数组]
   */
  searchOpDefEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IOpDef[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IOpDef[]>(url)
      .pipe(
        tap(_ => this.log(`found OpDef matching "${query}"`)),
        catchError(this.handleError<IOpDef[]>('searchOpDef', []))
      );
  }


  /**
   * [getOpDefinitionsBy 通过简单的查询条件，获取相应的操作定义信息]
   * @param  {any               = {}}        query [description]
   * @return {Observable<IOpDef[]>}   [description]
   */
  getOpDefinitionsBy(query: any = {}): Observable<IOpDef[]> {
    return this.searchOpDefs(query);
  }

  getManyOpDefinitions(ids:string[]): Observable<IOpDef[]> {
    return this.getOpDefinitionsBy({_id: { $in: ids }});
  }

  /**
   * [getOpDefinitionsEliteBy 通过简单的查询条件，获取相应的操作定义关键信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IOpDefElite[]>}   [description]
   */
  getOpDefinitionsEliteBy(query: any = {}): Observable<IOpDefElite[]> {
    return this.searchOpDefs(query, this.eliteFields);
  }

  /**
   * [getOpDefinitionsProfileBy 通过简单的查询条件，获取相应的操作定义 Profile 信息]
   * @param  {any                    = {}}        query [description]
   * @return {Observable<IOpDefElite[]>}   [description]
   */
  getOpDefinitionsProfileBy(query: any = {}): Observable<IOpDef[]> {
    return this.searchOpDefs(query, this.profileFields);
  }

  getOpDefinitionBy(query: any = {}): Observable<IOpDef> {
    return this.getOpDefNo404(query);
  }

  /**
   * [判断操作定义是否存在，根据 field 和 value]
   * @param  {string}           field [description]
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
    return this.http.get<IOpDef[]>(url)
      .pipe(
        map(opds => opds[0]), // returns a {0|1} element array
        tap(opd => {
          const outcome = opd ? `fetched` : `did not find`;
          this.log(`${outcome} OpDef _id=${qstr}`);
        }),
        catchError(this.handleError<IOpDef>(`getOpDef ${qstr}`))
      );
  }

  /**
   * [判断操作定义名称是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的操作定义信息
   * @param  {IOpDef}             opd [待创建的操作定义信息]
   * @return {Observable<IOpDef>}     [新创建的操作定义信息]
   */
  createOpDefinition(opd: IOpDef): Observable<IOpDef> {
    return this.http
      .post<IOpDef>(this.baseUrl, opd, httpOptions)
      .pipe(
        tap((newOpDef: IOpDef) => this.log(`added opd w/ id=${newOpDef._id}`)),
        catchError(this.handleError<IOpDef>('createOpDefinition'))
      );
  }

  /**
   * 在数据库中，更新某个操作定义信息
   * @param  {IOpDef}             opd [待更新的操作定义信息]
   * @return {Observable<IOpDef>}     [更新后的操作定义信息]
   */
  updateOpDefinition(opd: IOpDef): Observable<IOpDef> {
    const url = `${this.baseUrl}/${opd._id}`;
    return this.http
      .put(url, opd, httpOptions)
      .pipe(
        tap(_ => this.log(`updated opd id=${opd._id}`)),
        catchError(this.handleError<any>('updateOpDefinition'))
      );
  }

  patchOpDefinition(id: string, patch: any): Observable<IOpDef> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch opd id=${id}`)),
        catchError(this.handleError<any>('patchOpDefinition'))
      );
  }

  /**
   * 在数据库中，删除某个操作定义信息
   * @param  {IOpDef}           opd [待删除的操作定义信息]
   * @return {Observable<void>}     [description]
   */
  deleteOpDefinition(opd: IOpDef): Observable<IOpDef> {
    const id = typeof opd === 'string' ? opd : opd._id;
    const url = `${this.baseUrl}/${opd._id}`;
    return this.http.delete<IOpDef>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete opd id=${id}`)),
        catchError(this.handleError<IOpDef>('deleteOpDefinition'))
      );
  }

  /**
   * [获取操作定义树，方便操作定义的选取]
   * @param  {IOpDefElite[]}    ods [description]
   * @param  {IOpDefElite[] =   []}          sels [description]
   * @return {TreeviewItem[]}       [description]
   */
  newOpDefTree(ods: IOpDefElite[], sels: IOpDefElite[] = []): TreeviewItem[] {
    return ods && ods.length > 0 ? ods.map(item => {
      return new TreeviewItem({
        text: `${item.oid}-${item.ver}`,
        value: item,
        checked: sels ? sels.findIndex(sel => sel._id === item._id) > -1 : false,
        children: []
      });
    }) : [];
  }
  /**
   * 获取单个操作段信息
   * @param  {string}             id    [操作定义的_id]
   * @param  {string}             segid [操作段的_id]
   * @return {Observable<IOpDef>}       [操作段信息]
   */
  getOpseg(id: string, segid: string): Observable<IOpseg> {
    const url = `${this.baseUrl}/${id}/seg/${segid}`;
    return this.http.get<IOpseg>(url)
      .pipe(
        tap(_ => this.log('fetch opSeg segid=${segid}')),
        catchError(this.handleError<IOpseg>('getOpseg'))
      );
  }

  createOpseg(id: string, opseg: IOpseg): Observable<IOpDef> {
    const url = `${this.baseUrl}/${id}/seg`;
    Reflect.deleteProperty(opseg, '_id');
    return this.http
      .post<IOpDef>(url, opseg, httpOptions)
      .pipe(
        tap((newSeg: IOpDef) => this.log(`added seg w/ segid=${newSeg._id}`)),
        catchError(this.handleError<IOpDef>('createOpseg'))
      );
  }

  /**
   * 更新单个操作段信息
   * @param  {string}             id  [description]
   * @param  {IOpseg}             ops [description]
   * @return {Observable<IOpDef>}     [description]
   */
  updateOpseg(id: string, segid: string, ops: IOpseg): Observable<IOpDef> {
    const url = `${this.baseUrl}/${id}/seg/${segid}`;
    return this.http
      .put(url, ops, httpOptions)
      .pipe(
        tap(_ => this.log(`updated segReq id=${ops._id}`)),
        catchError(this.handleError<any>('updateOpseg'))
      );
  }

  patchOpseg(id: string, segid: string, patch: any): Observable<IOpDef> {
    const url =`${this.baseUrl}/${id}/seg/${segid}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch segReq id=${segid}`)),
        catchError(this.handleError<any>('patchOpseg'))
      );
  }

  deleteOpseg(id: string, opseg: IOpseg): Observable<IOpseg> {
    const url = `${this.baseUrl}/${id}/seg/${opseg._id}`;
    return this.http.delete<IOpseg>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete opseg id=${id}`)),
        catchError(this.handleError<IOpseg>('deleteOpseg'))
      );
  }

  /**
   *　从单个的ProcessSegment中获取OpSegment相关属性
   * @param  {IOpseg}  os [需要获取相关属性的原始OpSegment]
   * @param  {IProseg} ps [获取信息的源头]
   * @return {IOpseg}     [获取信息后的OpSegment]
   */
  getOpsegmentByProseg(ps: IProseg): IOpseg {
    let model = new Opseg();
    model.DeriveFromProseg(ps);
    return model;
  }

  createOpTree(opds: IOpDef[], collapsed: boolean = false): TreeviewItem[] {
    let tree: TreeviewItem[] = opds && opds.length > 0 ? opds.map(opd => {
      return new TreeviewItem({
        text: `${opd.oid}-${opd.ver}`,
        value: opd,
        checked: false,
        collapsed: collapsed,
        children: opd.opseg && opd.opseg.length > 0 ? opd.opseg.map(seg => {
          return {
            text: `${seg.oid}`,
            value: seg,
            checked: false
          };
        }) : undefined,
      }); // end of return new TreeviewItem
    }) : [];
    let root: TreeviewItem = new TreeviewItem({
      text: UtilData.systemObj.opdef.name,
      value: UtilData.systemObj.opdef.name,
      checked: false,
      collapsed: false,
      children: tree
    });
    return [root];
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
