import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { IJobOrder } from '../model/job-order';
import { IMlot } from '../model/mlot';
import { IJobResponseElite, IJobResponse, JobResponse, IJobResponseProfile, IJob } from '../model/job-response';
import { IExistService } from './common.service';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class JobResponseService implements IExistService {
  private baseUrl = '/api/jobResponses';
  private eliteFields = '_id oid state';
  private profileFields = '-mAct -oplog';

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
    this.messageService.add(`JobResponseService: ${message}`);
  }

  /**
   * 获取所有的 JobResponse 工单执行信息
   * @return {Observable<IJobResponse[]>} [JobResponse工单执行信息 Array]
   */
  getJobResponses(field: string = '', sort: string = '-_id'): Observable<IJobResponse[]> {
    const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    return this.http.get<IJobResponse[]>(url)
      .pipe(
        tap(_ => this.log('fetched JobResponses')),
        catchError(this.handleError('getJobResponses', []))
      );
  }

  /** GET JobResponse by q. Return `undefined` when id not found */

  /**
   * 通过查询条件，获取层级信息
   * 当查询不到时，返回 undefined
   */
  getJobResponseNo404<Data>(query: any): Observable<IJobResponse> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    } else {
      return of(undefined);
    }
    const url = `${this.baseUrl}/?${qstr}`;
    return this.http.get<IJobResponse[]>(url)
      .pipe(
        map(jrs => jrs[0]), // returns a {0|1} element array
        tap(jr => {
          const outcome = jr ? `fetched` : `did not find`;
          this.log(`${outcome} JobResponse _id=${qstr}`);
        }),
        catchError(this.handleError<IJobResponse>(`getIJobResponse ${qstr}`))
      );
  }

  /**
   * [通过过滤条件查询JobResponses，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IJobResponse[]>}       [查询结果，JobResponse数组]
   */
  searchJobResponses(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IJobResponse[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IJobResponse[]>(url)
      .pipe(
        tap(_ => this.log(`found JobResponses matching "${qstr}"`)),
        catchError(this.handleError<IJobResponse[]>('searchJobResponses', []))
      );
  }

  /**
   * [通过过滤条件查询JobResponses，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IJobResponse[]>}       [查询结果，JobResponse数组]
   */
  searchJobResponsesEncode(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IJobResponse[]> {
    const url = `${this.baseUrl}/?filters=${encodeURIComponent(JSON.stringify(query))}&field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IJobResponse[]>(url)
      .pipe(
        tap(_ => this.log(`found JobResponses matching "${query}"`)),
        catchError(this.handleError<IJobResponse[]>('searchJobResponses', []))
      );
  }

  /**
   * [统计工单的状态信息]
   * @param  {any}               query [description]
   * @return {Observable<any[]>}       [description]
   */
  aggr(group: string, hs: any, startTime: Date, endTime: Date) : Observable<any[]> {
    let query = {
      hs: hs,
      startTime: startTime,
      endTime: endTime
    };
    const url = `${this.baseUrl}/aggr/${group}/?filters=${encodeURIComponent(JSON.stringify(query))}`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(_ => this.log(`aggregate job state matching "${hs}"`)),
        catchError(this.handleError<any[]>('aggr', []))
      );
  }

  /**
   * 获取所有的 JobResponse 工单执行关键信息
   * @return {Observable<IJobResponseElite[]>} [工单执行关键信息 Array]
   */
  getJobResponsesElite(): Observable<IJobResponseElite[]> {
    return this.getJobResponses(this.eliteFields);
  }

  /**
   * [getJobResponsesProfile 获取所有的 JobResponse 工单执行 Profile 信息]
   * @return {Observable<IJobResponse[]>} [description]
   */
  getJobResponsesProfile(): Observable<IJobResponse[]> {
    return this.getJobResponses(this.profileFields);
  }

  /**
   * [getNewJobResponse 从数据库获取一个全新的 JobResponse,自带 _id]
   * @return {Observable<IJobResponse>} [description]
   */
  getNewJobResponse(): Observable<IJobResponse> {
    const url = `${this.baseUrl}/new`;
    return this.http.get<IJobResponse>(url)
      .pipe(
        tap(_ => this.log('fetch new JobResponse ')),
        catchError(this.handleError<IJobResponse>('getNewJobResponse'))
      );
  }

  /**
   * 根据 _id 获取单个工单执行信息
   * @param  {string}                   id [工单执行信息的 _id]
   * @return {Observable<IJobResponse>}    [description]
   */
  getJobResponse(id: string): Observable<IJobResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<IJobResponse>(url)
      .pipe(
        tap(_ => this.log('fetch JobResponse id=${id}')),
        catchError(this.handleError<IJobResponse>('getJobResponse'))
      );
  }

  /**
   * [根据JobResponse's id 获取 jobOrder, 该job 包含 joborder & jobresponse]
   * @param  {string}          id [description]
   * @return {Observable<any>}    [description]
   */
  getJob(id: string): Observable<IJob> {
    const url = `${this.baseUrl}/job/${id}`;
    return this.http.get<IJob>(url)
      .pipe(
        tap(_ => this.log('fetch Job id=${id}')),
        catchError(this.handleError<IJob>('getJob'))
      );
  }

  /**
   * [通过简单的查询条件，获取相应的 JobResponse]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IJobResponse[]>}   [description]
   */
  getJobResponsesBy(query: any = {}): Observable<IJobResponse[]> {
    return this.searchJobResponses(query);
  }

  /**
   * [getJobResponsesEliteBy 通过简单的查询条件，获取相应的 JobResponse 关键信息]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IJobResponseElite[]>}   [description]
   */
  getJobResponsesEliteBy(query: any = {}): Observable<IJobResponseElite[]> {
    return this.searchJobResponses(query, this.eliteFields);
  }

  /**
   * [getJobResponsesProfileBy 通过简单的查询条件，获取相应的 JobResponse Profile信息]
   * @param  {any                     = {}}        query [description]
   * @return {Observable<IJobResponse[]>}   [description]
   */
  getJobResponsesProfileBy(query: any = {}): Observable<IJobResponse[]> {
    return this.searchJobResponses(query, this.profileFields);
  }

  /**
   * [通过简单的查询条件，获取一个JobResponse]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IJobResponse>}   [description]
   */
  getJobResponseBy(query: any = {}): Observable<IJobResponse> {
    return this.getJobResponseNo404(query);
  }

  /**
   * [通过简单的查询条件，获取一个JobResponse]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IJobResponse>}   [description]
   */
/*  getJobResponseEliteBy(query: any = {}): Observable<IJobResponseElite> {
    const url = `${this.baseUrl}/oneeliteby`;
    return this.http
      .post<IJobResponseElite>(url, query)
      .pipe(
        catchError(this.handleError<IJobResponseElite>('getJobResponseEliteBy'))
      );
  }*/

  /**
   * [通过简单的查询条件，获取一个JobResponse]
   * @param  {any                   = {}}        query [description]
   * @return {Observable<IJobResponseProfile>}   [description]
   */
/*  getJobResponseProfileBy(query: any = {}): Observable<IJobResponseProfile> {
    const url = `${this.baseUrl}/oneprofileby`;
    return this.http
      .post<IJobResponseProfile>(url, query)
      .pipe(
        catchError(this.handleError<IJobResponseProfile>('getJobResponseProfileBy'))
      );
  }*/

  /**
   * [获取最新的 JobResponse]
   * @param  {any=                         {}} query         [description]
   * @return {Observable<IJobResponseProfile>}        [description]
   */
  getLastJobResponseProfile(query: any = {}): Observable<IJobResponseProfile> {
    const url = `${this.baseUrl}/lastprofileby`;
    return this.http
      .post<IJobResponseProfile>(url, query)
      .pipe(
        catchError(this.handleError<IJobResponseProfile>('getLastJobResponseProfile'))
      );
  }

  /**
   * [通过简单的查询条件，获取一个 Job 的 Profile，包括一个 joborder 和一个 jobresponse ]
   hs.name:
   proseg.oid:
   * @param  {any          = {}}        query [description]
   * @return {Observable<any>}   [description]
   */
  getJobProfileBy(query: any = {}): Observable<any> {
    const url = `${this.baseUrl}/job/oneprofileby`;
    return this.http
      .post<any>(url, query)
      .pipe(
        catchError(this.handleError<any>('getJobProfileBy'))
      );
  }

  /**
   * 通过jobResponse 的 _id 数组 获取 JobResponse 数组
   * @param  {string[]}               ids [description]
   * @return {Observable<JobOrder[]>}     [description]
   */
  getManyJobResponses(ids: string[]): Observable<IJobResponse[]> {
    let strIds = ids.join(',');
    const url = `${this.baseUrl}/many/${strIds}`;
    return this.http.get<IJobResponse[]>(url)
      .pipe(
        tap(_ => this.log('fetch JobResponses')),
        catchError(this.handleError<IJobResponse[]>('getManyJobResponses'))
      );
  }

  /**
   * [获取 Job 的 mdef 各自的数量，用于统计呈现
   * like {
       jrm: any,
       jom: any
   * }
   * ]
   * @param  {string}          id [description]
   * @return {Observable<any>}    [description]
   */
  getJobMCount(oid: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/mcount/${oid}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetch JobMCount')),
        catchError(this.handleError<any>('getJobMCount'))
      );
  }

  /**
   * [获取当前在喷釉的釉料批次]
   * @return {Observable<IMlot[]>} [description]
   */
  getCurrGlazeLot(): Observable<IMlot[]> {
    const url = `${this.baseUrl}/glazelot`;
    return this.http.get<IMlot[]>(url)
      .pipe(
        tap(_ => this.log('fetch CurrGlazeLot')),
        catchError(this.handleError<IMlot[]>('getCurrGlazeLot'))
      );
  }

  /**
   * [获取当月数据统计值]
   * @return {Observable<any>} [description]
   */
  getCurrMonthQty(): Observable<any> {
    const url = `${this.baseUrl}/aggr/currmonth/qty`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetch CurrMonthQty')),
        catchError(this.handleError<any>('getCurrMonthQty'))
      );
  }
  /**
   * [获取工单生产过程中的质量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  getAggregateQC(oid: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/qc/${oid}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetch AggregateQC')),
        catchError(this.handleError<any>('getAggregateQC'))
      );
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  getAggregateQCItem(oid: string): Observable<any> {
    const url = `${this.baseUrl}/aggr/qci/${oid}`;
    return this.http.get<any>(url)
      .pipe(
        tap(_ => this.log('fetch AggregateQCItem')),
        catchError(this.handleError<any>('getAggregateQCItem'))
      );
  }

  /**
   * [判断工单响应是否存在，根据 field 和 value]
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
    return this.http.get<JobResponse[]>(url)
      .pipe(
        map(jrss => jrss[0]), // returns a {0|1} element array
        tap(jrs => {
          const outcome = jrs ? `fetched` : `did not find`;
          this.log(`${outcome} JobResponse _id=${qstr}`);
        }),
        catchError(this.handleError<JobResponse>(`getJobResponse ${qstr}`))
      );
  }

  /**
   * [判断工单响应是否存在，根据 field 和 value]
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
   * 在数据库中，创建新的JobResponse工单执行信息
   * @param  {IJobResponse}             jr [待创建的JobResponse]
   * @return {Observable<IJobResponse>}    [新创建的JobResponse]
   */
  createJobResponse(jr: IJobResponse): Observable<IJobResponse> {
    return this.http
      .post<JobResponse>(this.baseUrl, jr, httpOptions)
      .pipe(
        tap((newJobResponse: JobResponse) => this.log(`added JobResponse w/ id=${newJobResponse._id}`)),
        catchError(this.handleError<JobResponse>('createOpRequest'))
      );
  }

  /**
   * 在数据库中，更新某个JobResponse工单执行信息
   * @param  {IJobResponse}             jr [待更新的JobResponse]
   * @return {Observable<IJobResponse>}    [已更新的JobResponse]
   */
  updateJobResponse(jr: IJobResponse): Observable<IJobResponse> {
    const url = `${this.baseUrl}/${jr._id}`;
    return this.http
      .put(url, jr, httpOptions)
      .pipe(
        tap(_ => this.log(`updated opr id=${jr._id}`)),
        catchError(this.handleError<any>('updateOpRequest'))
      );
  }

  /**
   * [新增patch方法，用于更新JobResponse]
   * @param  {IJobResponse}             jr    [description]
   * @param  {any}                      patch [description]
   * @return {Observable<IJobResponse>}       [description]
   */
  patchJobResponse(jr: IJobResponse, patch: any): Observable<IJobResponse> {
    const url = `${this.baseUrl}/${jr._id}`;
    return this.http
      .patch(url, patch, httpOptions)
      .pipe(
        tap(_ => this.log(`patch JobResponse id=${jr._id}`)),
        catchError(this.handleError<any>('patchOpRequest'))
      );
  }

  /**
   * 在数据库中，删除某个JobResponse工单执行信息
   * @param  {IJobResponse}     jr [待删除的JobResponse]
   * @return {Observable<void>}    [description]
   */
  deleteJobResponse(jr: IJobResponse): Observable<IJobResponse> {
    const id = typeof jr === 'string' ? jr : jr._id;
    const url = `${this.baseUrl}/${jr._id}`;
    return this.http.delete<JobResponse>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`delete jr id=${id}`)),
        catchError(this.handleError<JobResponse>('deleteOpRequest'))
      );
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  aggrReasonMonthly(month: number, query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/reason/month/${month}`;
    return this.http
      .post<any>(url, query)
      .pipe(
        catchError(this.handleError<any>('aggrReasonMonthly'))
      );
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  aggrReasonTimely( start: string, end: string, query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/reason/time/${start}/${end}`;
    return this.http
      .post<any>(url, query)
      .pipe(
        catchError(this.handleError<any>('aggrReasonTimely'))
      );
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  aggrTotalQtyMonthly(month: number, query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/totalqty/month/${month}`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError<any>('aggrTotalQtyMonthly'))
      );
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  aggrTotalQtyTimely(start: string, end: string, query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/totalqty/time/${start}/${end}`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError<any>('aggrTotalQtyTimely'))
      );
  }

  /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  aggrQtyMonthly(month: number, query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/qty/month/${month}`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError<any>('aggrQtyMonthly'))
      );
  }

    /**
   * [获取工单生产过程中的产量统计信息]
   * @param  {string}          oid [description]
   * @return {Observable<any>}     [description]
   */
  aggrQtyTimely( start: string, end: string, query = {}): Observable<any> {
    const url = `${this.baseUrl}/aggr/qty/time/${start}/${end}`;
    return this.http
      .post<any>(url, query, httpOptions)
      .pipe(
        catchError(this.handleError<any>('aggrQtyTimely'))
      );
  }




  // private handleError(error: any): Promise<any> {
  //   console.error('HierarchyScope Service 发生错误', error);
  //   return Promise.reject(error.message || error);
  // }
}
