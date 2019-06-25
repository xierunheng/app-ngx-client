import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IEclass } from '../model/eclass';
import { IEquipment, Equipment,
  IEquipmentProfile, IEquipmentElite } from '../model/equipment';
import {IExistService} from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EquipmentService implements IExistService {
  private baseUrl = '/api/equipments';

  private eliteFields = '_id oid name';
  private profileFields = '-prop -emaints -esubs';

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
    this.messageService.add(`EquipmentService: ${message}`);
  }

  /**
   * 获取所有的设备信息
   * @return {Observable<IEquipment[]>} [id设备信息Array]
   */
  getEquipments(field: string = '', sort: string = '-_id'): Observable<IEquipment[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IEquipment[]>(url)
      .pipe(
        tap(_ => this.log('fetched Equipments')),
        catchError(this.handleError('getEquipments', []))
      );
  }

  /**
   * 获取所有的设备关键信息
   * @return {Observable<IEquipmentProfile[]>} [设备关键信息 + Context's Array]
   */
  getEquipmentsElite(): Observable<IEquipmentElite[]> {
    return this.getEquipments(this.eliteFields);
  }

  /**
   * 获取所有的设备关键信息 + Context
   * @return {Observable<IEquipmentProfile[]>} [设备关键信息 + Context's Array]
   */
  getEquipmentsProfile(): Observable<IEquipmentProfile[]> {
    return this.getEquipments(this.profileFields);
  }

  /**
   * [getNewEquipment 从数据库获取一个全新的 Equipment,自带 _id]
   * @return {Observable<IEquipment>} [description]
   */
  getNewEquipment(): Observable<IEquipment> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IEquipment>(url)
      .pipe(
        tap(_ => this.log('fetched new Equipment')),
        catchError(this.handleError<IEquipment>('getNewEquipment'))
      );
  }

  /**
   * 根据 _id 获取单个设备信息
   * @param  {string}                 id [设备的 _id]
   * @return {Observable<IEquipment>}    [单个设备信息]
   */
  getEquipment(id: string): Observable<IEquipment> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IEquipment>(url)
      .pipe(
        tap(_ => this.log('fetched Equipment id=${id}')),
        catchError(this.handleError<IEquipment>('getEquipment'))
      );
  }

  /**
   * 通过查询条件，获取设备信息
   * 当查询不到时，返回 undefined
   */
  getEquipNo404<Data>(query: any): Observable<IEquipment> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IEquipment[]>(url)
      .pipe(
        map(Equipments => Equipments[0]), // returns a {0|1} element array
        tap(Equipment => {
          const outcome = Equipment ? `fetched` : `did not find`;
          this.log(`${outcome} Equipment _id=${qstr}`);
        }),
        catchError(this.handleError<IEquipment>(`getEquipment ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询 Equipments，可设定查询的相关选项]
   * @param  {any}                      query [查询条件，key-value object]
   * @param  {string                =     ''}          field [查询返回的字段]
   * @param  {string                =     '-_id'}      sort  [排序字段]
   * @param  {number                =     0}           limit [查询返回的数量限制]
   * @param  {number                =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEquipment[]>}       [查询结果，Equipment 数组]
   */
  searchEquips(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEquipment[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEquipment[]>(url)
      .pipe(
        tap(_ => this.log(`found Equips matching "${qstr}"`)),
        catchError(this.handleError<IEquipment[]>('searchEquips', []))
      );
  }

  /**
   * [通过过滤条件查询 Equipments，可设定查询的相关选项]
   * @param  {any}                      query [查询条件，key-value object]
   * @param  {string                =     ''}          field [查询返回的字段]
   * @param  {string                =     '-_id'}      sort  [排序字段]
   * @param  {number                =     0}           limit [查询返回的数量限制]
   * @param  {number                =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IEquipment[]>}       [查询结果，Equipment 数组]
   */
  searchEquipsEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IEquipment[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IEquipment[]>(url)
      .pipe(
        tap(_ => this.log(`found Equips matching "${query}"`)),
        catchError(this.handleError<IEquipment[]>('searchEquips', []))
      );
  }

  /**
   * [统计员工的类型信息]
   * @param  {any}               query [description]
   * @return {Observable<any[]>}       [description]
   */
  aggrClass(hs: any) : Observable<any[]> {
    const url = `${this.baseUrl}/aggr/?filters=${encodeURIComponent(JSON.stringify(hs))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`found Equipments matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggrClass', []))
      );
  }

  /**
   * [getEquipmentsBy 获取所有的设备信息，查询条件由 Client 提供]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IEquipment[]>}   [description]
   */
  getEquipmentsBy(query: any = {}): Observable<IEquipment[]> {
    return this.searchEquips(query);
  }

  /**
   * [getEquipmentsEliteBy 获取所有的设备关键信息，查询条件由 Client 提供]
   * @param  {any                        = {}}        query [description]
   * @return {Observable<IEquipmentElite[]>}   [设备关键信息 Array]
   */
  getEquipmentsEliteBy(query: any = {}): Observable<IEquipmentElite[]> {
    return this.searchEquips(query, this.eliteFields);
  }

  /**
   * [getEquipmentsProfileBy 获取所有的设备关键信息 + Context, 查询条件由 Client 提供]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IEquipmentProfile[]>}   [description]
   */
  getEquipmentsProfileBy(query: any = {}): Observable<IEquipmentProfile[]> {
    return this.searchEquips(query, this.profileFields);
  }

  getEquipmentBy(query: any = {}): Observable<IEquipment> {
    return this.getEquipNo404(query);
  }

  /**
   * 判断设备是否存在，根据 field 和 value
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
    return this.http.get<IEquipment[]>(url)
      .pipe(
        map(Equipments => Equipments[0]), // returns a {0|1} element array
        tap(Equipment => {
          const outcome = Equipment ? `fetched` : `did not find`;
          this.log(`${outcome} Equipment _id=${qstr}`);
        }),
        catchError(this.handleError<IEquipment>(`getEquipment ${qstr}`))
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

  next(prex: string): Observable<string> {
    prex = prex ? prex : '000000';
    const url = `${this.baseUrl}/next/${prex}`;
    return this.http.get<string>(url)
      .pipe(
        catchError(this.handleError<string>('next'))
      );
  }

  /**
   * 在数据库中，创建新的设备信息
   * @param  {IEquipment}             e [待创建的设备信息]
   * @return {Observable<IEquipment>}   [新创建的设备信息]
   */
  createEquipment(e: IEquipment): Observable<IEquipment> {
    return this.http
      .post<IEquipment>(this.baseUrl, e, httpOptions)
      .pipe(
        tap((NewEquip: IEquipment) => this.log(`added Equipment w/ id=${NewEquip._id}`)),
        catchError(this.handleError<IEquipment>('createEquipment'))
      );
  }

   /**
   * 在数据库中，批量创建或更新设备信息
   * @param  {IEquipment[]}               [待创建的设备信息]
   * @return {Observable<IEquipment[]>}   [新创建的设备信息]
   */
  upsertEquipments(es: IEquipment[]): Observable<IEquipment[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<IEquipment[]>(url, es, httpOptions)
      .pipe(
        catchError(this.handleError<IEquipment[]>('upsertEquipments'))
      );
  }

  /**
   * [在数据库中，更新某个设备信息]
   * @param  {IEquipment}             e [description]
   * @return {Observable<IEquipment>}   [description]
   */
  updateEquipment(e: IEquipment): Observable<IEquipment> {
    const url = `${this.baseUrl}/${e._id}`;
    return this.http
      .put<IEquipment>(url, e, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Equipment id=${e._id}`)),
        catchError(this.handleError<any>('updateEquipment'))
      );
  }

  patchEquipment(id: string, patch: any): Observable<IEquipment> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Equipment id=${id}`)),
        catchError(this.handleError<any>('patchEquipment'))
      );
  }

  /**
   * 在数据库中，删除某个设备信息
   * @param  {IEquipment}       e [待删除的设备信息]
   * @return {Observable<void>}   [description]
   */
  deleteEquipment(e: IEquipment): Observable<IEquipment> {
    const id = typeof e === 'string' ? e : e._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IEquipment>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Equipment id=${id}`)),
        catchError(this.handleError<IEquipment>('deleteEquipment'))
      );
  }

  /**
   * [创建新的设备定义 Tree，包含设备类型和设备定义信息]
   * @param  {IEquipmentProfile[]}    ese [description]
   * @param  {boolean} collapse
   * @param  {IEquipmentProfile[] =   []}          sels [description]
   * @return {TreeviewItem[]}           [description]
   */
  newEquipmentTree(ese: IEquipmentProfile[], collapsed: boolean = false, sels: any = []): TreeviewItem[] {
    console.log(ese);
    console.log(sels);
    let rntree: TreeviewItem[] =[];
    if(ese && ese.length > 0) {
      rntree = _.map(_.groupBy(ese, 'eclass[0]._id'), (value, key) => {
        return new TreeviewItem({
          text: value[0].eclass[0].oid,
          value: value[0].eclass[0],
          checked: false,
          collapsed: collapsed,
          children: value.map(e => {
            return {
              text: `${e.oid}-[${e.name}]`,
              value: e,
              checked: sels ? sels.findIndex(sel => sel._id === e._id) >= 0 : false,
              children: []
            }
          })
        });
      });
    }
    return rntree;
  }

  deriveFromEclasss(e: IEquipment, ecs: IEclass[]): IEquipment {
    e.hs = ecs[0].hs;
    ecs.forEach((value, index, array) => {
      e.prop = _.unionBy(e.prop, value.prop, '_id');
    });
    e.eclass = ecs.map((value, index, array) => {
      return {
        _id: value._id,
        oid: value.oid,
        code: value.code
      };
    });
    return e;
  }

}
