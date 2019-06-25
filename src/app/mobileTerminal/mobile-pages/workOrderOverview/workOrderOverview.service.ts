import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MessageService} from "../../../@core/data/message.service";
import {Observable, of} from "rxjs";
import {IWorkRequest, IWorkRequestElite} from "../../../@core/model/work-req";
import {catchError, tap} from "rxjs/operators";
import * as _ from 'lodash';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkOrderOverviewService{
  private baseUrl = "http://100.13.32.238:9000";

  private eliteFields = '_id oid';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

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
    this.messageService.add(`WorkAlertService: ${message}`);
  }

  /**
   * [获取所有的作业请求信息]
   * @return {Observable<IWorkRequest[]>} [作业请求信息Array]
   */
  getWorkRequests(field: string = '', sort: string = '-_id'): Observable<IWorkRequest[]> {
    const url = `${this.baseUrl}/api/workRequests/?field=${field}&sort=${sort}`;
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        tap(_ => this.log('fetched WorkRequests')),
        catchError(this.handleError('getWorkRequests', []))
      );
  }

  /**
   * [根据 _id 获取单个作业请求信息]
   * @param  {string}                   id [作业请求的_id]
   * @return {Observable<IWorkRequest>}    [单个作业请求信息]
   */
  getWorkRequest(id: string): Observable<IWorkRequest> {
    const url = `${this.baseUrl}/api/workRequests/${id}`;
    return this.http.get<IWorkRequest>(url)
      .pipe(
        tap(_ => this.log('fetch WorkRequest id=${id}')),
        catchError(this.handleError<IWorkRequest>('getWorkRequest'))
      );
  }

  /**
   * [通过过滤条件查询WorkRequests，可设定查询的相关选项]
   * @param  {any}                           query [查询条件，key-value object]
   * @param  {string                     =     ''}        field [查询返回的字段]
   * @param  {string                     =     '-_id'}      sort  [排序字段]
   * @param  {number                     =     0}           limit [查询返回的数量限制]
   * @param  {number                     =     0}           skip  [查询返回的数量限制]
   * @return {Observable<IWorkRequest[]>}       [查询结果，WorkRequest数组]
   */
  searchWorkRequests(query: any, field: string = '', sort: string = '-_id', limit: number = 0, skip: number = 0): Observable<IWorkRequest[]> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/api/workRequests/?${qstr}field=${field}&sort=${sort}&limit=${limit}&skip=${skip}`;
    return this.http.get<IWorkRequest[]>(url)
      .pipe(
        tap(_ => this.log(`found WorkRequests matching "${qstr}"`)),
        catchError(this.handleError<IWorkRequest[]>('searchWorkRequests', []))
      );
  }

  /**
   * [getWorkRequestsEliteBy 通过简单的查询条件，获取相应的作业请求关键信息]
   * @param  {any                          = {}}        query [description]
   * @return {Observable<IWorkRequestElite[]>}   [description]
   */
  getWorkRequestsEliteBy(query: any = {}): Observable<IWorkRequestElite[]> {
    return this.searchWorkRequests(query, this.eliteFields);
  }
}
