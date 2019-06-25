import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from '../../../@core/data/message.service';
import {IWorkAlert} from "../../../@core/model/work-alert";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkAlertService {

  // //此3步骤为父组件和子组件共享同一个WorkAlertService并实现双向传值。
  // //1. Observable IWorkAlert sources
  // private workAlertSource = new Subject<IWorkAlert>();
  //
  // //2. Observable IWorkAlert streams
  // workAlert$ = this.workAlertSource.asObservable();
  //
  // //3. Service message commands 将实体参数传递给workAlertSource
  // passWorkAlert(workAlert:IWorkAlert){
  //   this.workAlertSource.next(workAlert);
  // }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private baseUrl = "http://100.13.32.237:9000";

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
   * 获取所有的报警信息
   * @return {Observable<IWorkAlert[]>} [报警信息Array]
   */
  getWorkAlerts(field: string = '', sort: string = '-_id'): Observable<IWorkAlert[]> {
    // const url = `${this.baseUrl}/?field=${field}&sort=${sort}`;
    const url = `${this.baseUrl}/api/workAlerts/`;
    // const url = 'http://v.juhe.cn/weather/index?cityname=%E5%B9%BF%E5%B7%9E&dtype=json&format=1&key=01a8bebfe082b533c7e10c864498871f';
    return this.http.get<IWorkAlert[]>(url)
      .pipe(
        tap(_ => this.log('fetched getWorkAlerts')),
        catchError(this.handleError<IWorkAlert[]>('getWorkAlerts', []))
      )
  }

  /**
   * 根据 _id 获取单个报警信息
   * @param  {string}                 id [报警信息的 _id]
   * @return {Observable<IWorkAlert>}    [单个报警信息]
   */
  getWorkAlert(id: string): Observable<IWorkAlert> {
    const url = `${this.baseUrl}/api/workAlerts/${id}`;
    return this.http.get<IWorkAlert>(url)
      .pipe(
        tap(_ => this.log('fetched getWorkAlert')),
        catchError(this.handleError<IWorkAlert>('getWorkAlert'))
      )
  }
}
