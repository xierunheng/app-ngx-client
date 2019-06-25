import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';

import { IPclass } from '../model/pclass';
import { IPersonProfile, IPersonElite, IPerson, Person } from '../model/person';
import { IExistService } from './common.service';
import { SocketService } from '../socket/socket.service';
import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ScadaDataService implements IExistService{
  private baseUrl = '/api/scadaDatas';

  private eliteFields = '_id oid name code mobile';
  private profileFields = '_id oid name code mobile hs pclass';

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
    this.messageService.add(`PersonService: ${message}`);
  }

  /**
   * [获取SQL数据库中 productionline 数据表的数据]
   * @return {Observable<any>} [description]
   */
  getProductionLine(): Observable<any> {
    const url = `${this.baseUrl}/productionline`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched ProductionLine')),
        catchError(this.handleError('getProductionLine', {}))
      );
  }

  /**
   * [获取SQL数据库中 countdata 数据表的数据]
   * @return {Observable<any>} [description]
   */
  getCountData(): Observable<any> {
    const url = `${this.baseUrl}/countdata`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched CountData')),
        catchError(this.handleError('getCountData', {}))
      );
  }

  /**
   * [获取SQL数据库中 countdata 数据表的数据系列数据]
   * @return {Observable<any>} [description]
   */
  getCountDatas(): Observable<any> {
    const url = `${this.baseUrl}/countdatas`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched CountData')),
        catchError(this.handleError('getCountData', {}))
      );
  }

  /**
   * [获取SQL数据库中 maintenacepara 数据表的数据]
   * @return {Observable<any>} [description]
   */
  getMaintenacePara(): Observable<any> {
    const url = `${this.baseUrl}/maintenacepara`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched MaintenancePara')),
        catchError(this.handleError('getMaintenancePara', {}))
      );
  }

  /**
   * [获取SQL数据库中 period 数据表的数据]
   * @return {Observable<any>} [description]
   */
  getPeriod(): Observable<any> {
    const url = `${this.baseUrl}/period`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched Period')),
        catchError(this.handleError('getPeriod', {}))
      );
  }

  /**
   * [获取SQL数据库中 period 数据表的系列数据]
   * @return {Observable<any>} [description]
   */
  getPeriods(): Observable<any> {
    const url = `${this.baseUrl}/periods`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched Periods')),
        catchError(this.handleError('getPeriods', {}))
      );
  }

  /**
   * [获取SQL数据库中 supervision 数据表的数据]
   * @return {Observable<any>} [description]
   */
  getSupervision(): Observable<any> {
    const url = `${this.baseUrl}/supervision`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched Supervision')),
        catchError(this.handleError('getSupervision', {}))
      );
  }

  /**
   * [获取SQL数据库中 proctionscode 数据表的数据]
   * @return {Observable<any>} [description]
   */
  getProctionsCode(): Observable<any> {
    const url = `${this.baseUrl}/proctionscode`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetched ProctionsCode')),
        catchError(this.handleError('getProctionsCode', {}))
      );
  }

  /**
   * 获取所有的员工信息
   * @return {Observable<IPerson[]>} [员工信息Array]
   */
  getPersons(field: string = '', sort: string = 'oid'): Observable<IPerson[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IPerson[]>(url)
      .pipe(
        tap(_ => this.log('fetched Persons')),
        catchError(this.handleError('getPersons', []))
      );
  }

  getPersonsNo404<Data>(query: any): Observable<IPerson> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IPerson[]>(url)
      .pipe(
        map(hss => hss[0]), // returns a {0|1} element array
        tap(hs => {
          const outcome = hs ? `fetched` : `did not find`;
          this.log(`${outcome} Person _id=${qstr}`);
        }),
        catchError(this.handleError<IPerson>(`getPerson ${qstr}`))
      );
  }

  /**
   * [getNewPerson 从数据库获取一个全新的 Person,自带 _id]
   * @return {Observable<IPerson>} [description]
   */
  getNewPerson(): Observable<IPerson> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IPerson>(url)
      .pipe(
        tap(_ => this.log('fetched new Person')),
        catchError(this.handleError<IPerson>('getNewPerson'))
      );
  }

  /**
   * 根据 _id 获取单个员工信息
   * @param  {string}              id [description]
   * @return {Observable<IPerson>}    [description]
   */
  getPerson(id: string): Observable<IPerson> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IPerson>(url)
      .pipe(
        tap(_ => this.log('fetched Person id=${id}')),
        catchError(this.handleError<IPerson>('getPerson'))
      );
  }

/**
 * [通过过滤条件查询Persons，可设定查询的相关选项]
 * @param  {any}                   query [查询条件，key-value object]
 * @param  {string             =     ''}          field [查询返回的字段]
 * @param  {string             =     '-_id'}      sort  [排序字段]
 * @param  {number             =     0}           limit [查询返回的数量限制]
 * @param  {number             =     0}           skip  [查询返回的数量限制]
 * @return {Observable<IPerson[]>}       [查询结果，Person 数组]
 */
  searchPersons(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<IPerson[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPerson[]>(url)
      .pipe(
        tap(_ => this.log(`found Persons matching "${qstr}"`)),
        catchError(this.handleError<IPerson[]>('searchPersons', []))
      );
  }

  /**
   * [通过过滤条件查询Persons，可设定查询的相关选项]
   * @param  {any}                   query [查询条件，key-value object]
   * @param  {string             =     ''}          field [查询返回的字段]
   * @param  {string             =     '-_id'}      sort  [排序字段]
   * @param  {number             =     0}           limit [查询返回的数量限制]
   * @param  {number             =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IPerson[]>}       [查询结果，Person 数组]
   */
  searchPersonsEncode(query: any, field: string = '', sort: string = 'oid', limit: number = 0, skip: number = 0): Observable<IPerson[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IPerson[]>(url)
      .pipe(
        tap(_ => this.log(`found Persons matching "${query}"`)),
        catchError(this.handleError<IPerson[]>('searchPersons', []))
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
        tap(_ => this.log(`found Persons matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggrPclass', []))
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
    return this.http.get<IPerson[]>(url)
      .pipe(
        map(Persons => Persons[0]), // returns a {0|1} element array
        tap(Person => {
          const outcome = Person ? `fetched` : `did not find`;
          this.log(`${outcome} Person _id=${qstr}`);
        }),
        catchError(this.handleError<IPerson>(`getPerson ${qstr}`))
      );
  }


  /**
   * [getPersonsElite 获取所有的员工关键信息]
   * @return {Observable<IPersonElite[]>} [description]
   */
  getPersonsElite(): Observable<IPersonElite[]> {
    return this.getPersons(this.eliteFields);
  }

  /**
   * 获取所有的员工关键信息 + Context
   * @return {Observable<IPersonProfile[]>} [员工关键信息 + Context's Array]
   */
  getPersonsProfile(): Observable<IPersonProfile[]> {
    return this.getPersons(this.profileFields);
  }

  /**
   * [getPersonsByQuery 通过简单的查询条件，获取相应的员工信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IPerson[]>}   [description]
   */
  getPersonsBy(query: any = {}): Observable<IPerson[]> {
    return this.searchPersons(query);
  }

  /**
   * [getPersonsEliteBy 通过简单的查询条件，获取相应的员工关键信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IPersonElite[]>}   [description]
   */
  getPersonsEliteBy(query: any = {}): Observable<IPersonElite[]> {
    return this.searchPersons(query, this.eliteFields);
  }

  /**
   * [getPersonsProfileBy 通过简单的查询条件，获取相应的员工 Profile 信息]
   * @param  {any                = {}}        query [description]
   * @return {Observable<IPerson[]>}   [description]
   */
  getPersonsProfileBy(query: any = {}): Observable<IPerson[]> {
    return this.searchPersonsEncode(query, this.profileFields);
  }

  getPersonBy(query: any = {}): Observable<IPerson> {
    return this.getPersonsNo404(query);
  }

  /**
   * [获取某个成型工唯一的坯体]
   * @param  {string}               id [description]
   * @return {Observable<string[]>}    [description]
   */
  getDistinctMold(id: string): Observable<string[]> {
    const url = `${this.baseUrl}/${id}/distinctmold`;
    return this.http.get<string[]>(url)
      .pipe(
        tap(_ => this.log('fetched DistinctMold')),
        catchError(this.handleError('getDistinctMold', []))
      );
  }

  /**
   * [判断员工是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的员工信息
   * @param  {IPerson}             p [待创建的员工信息]
   * @return {Observable<IPerson>}   [新创建的员工信息]
   */
  createPerson(p: IPerson): Observable<IPerson> {
    return this.http
      .post<IPerson>(this.baseUrl, p, httpOptions)
      .pipe(
        tap((NewPerson: IPerson) => this.log(`added Person w/ id=${NewPerson._id}`)),
        catchError(this.handleError<IPerson>('createPerson'))
      );
  }

   /**
   * 在数据库中，批量创建或更新员工信息
   * @param  {IPerson[]}               [待创建的员工信息]
   * @return {Observable<IPerson[]>}   [新创建的员工信息]
   */
  upsertPersons(ps: IPerson[]): Observable<IPerson[]> {
    const url = `${this.baseUrl}/many`;
    return this.http
      .post<IPerson[]>(url, ps, httpOptions)
      .pipe(
        catchError(this.handleError<IPerson[]>('upsertPersons'))
      );
  }

  /**
   * [在数据库中，更新员工信息]
   * @param  {IPerson}             p [description]
   * @return {Observable<IPerson>}   [description]
   */
  updatePerson(p: IPerson): Observable<IPerson> {
    const url = `${this.baseUrl}/${p._id}`;
    return this.http
      .put<IPerson>(url, p, httpOptions)
      .pipe(
        tap(_ => this.log(`updated Person id=${p._id}`)),
        catchError(this.handleError<any>('updatePerson'))
      );
  }

  //新增patch方法
  patchPerson(id: string, patch: any): Observable<IPerson> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch Person id=${id}`)),
        catchError(this.handleError<any>('patchPerson'))
      );
  }

  /**
   * 在数据库中，删除某个员工信息
   * @param  {IPerson}          p [待删除的员工信息n]
   * @return {Observable<void>}   [description]
   */
  deletePerson(p: IPerson): Observable<IPerson> {
    const id = typeof p === 'string' ? p : p._id;
    const url = `${this.baseUrl}/${id}`;
    //return this.http.delete(url, { headers: this.headers })
    return this.http.delete<IPerson>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete Person id=${id}`)),
        catchError(this.handleError<IPerson>('deletePerson'))
      );
  }

  /**
   * [创建新的员工定义 Tree，包含员工类型和员工信息]
   * @param  {IPersonProfile[]}    pse [description]
   * @param  {IPersonProfile[] =   []}          sels [description]
   * @param  {boolean}  collapsed:
   * @return {TreeviewItem[]}        [description]
   */
  newPersonTree(pse: IPersonProfile[], collapsed: boolean = false, sels: IPersonElite[] = []): TreeviewItem[] {
    let rntree: TreeviewItem[] = [];
    if (pse && pse.length > 0) {
      rntree = _.map(_.groupBy(pse, 'pclass[0]._id'), (value, key) => {
        return new TreeviewItem({
          text: value[0].pclass[0].oid,
          value: value[0].pclass[0],
          checked: false,
          collapsed: collapsed,
          children: value.map(p => {
            return {
              text: `${p.name} [${p.oid}]`,
              value: p,
              checked: sels ? sels.findIndex(sel => sel._id === p._id) >= 0 : false,
              children: []
            }
          })
        });
      });
    }
    return rntree;
  }

  deriveFromPclasss(p: IPerson, pcs: IPclass[]): IPerson {
    if (pcs && pcs.length > 0) {
      p.hs = pcs[0].hs;
      pcs.forEach((value, index, array) => {
        p.prop = _.unionBy(p.prop, value.prop, '_id');
      });
      p.pclass = pcs.map((value, index, array) => {
        return _.pick(value, ['_id', 'oid']);
      })
    }
    return p;
  }

}
