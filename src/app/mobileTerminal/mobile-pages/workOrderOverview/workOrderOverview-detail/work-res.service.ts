import {Observable, of} from "rxjs";
import {IWork} from "../../../../@core/model/work-res";
import {catchError, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "../../../../@core/data/message.service";
import * as _ from 'lodash';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkResponseService {
  private baseUrl = 'http://100.13.32.238:9000';

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
    this.messageService.add(`WorkResponseService: ${message}`);
  }

  /**
   * [根据 _id 获取单个作业的详细信息，包括作业请求和作业执行]
   * @param  {string}            id [description]
   * @return {Observable<IWork>}    [description]
   */
  getWork(query: any): Observable<IWork> {
    let qstr = '';
    if (query) {
      _.forOwn(query, (value, key) => {
        qstr += `${key}=${value}&`;
      });
    }
    const url = `${this.baseUrl}/api/workResponses/work/?${qstr}`;
    console.log(url);
    return this.http.get<IWork>(url)
      .pipe(
        tap(_ => this.log('fetch Work id=${id}')),
        catchError(this.handleError<IWork>('getWork'))
      );
  }
}


