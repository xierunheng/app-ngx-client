import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MessageService} from "../../../../../@core/data/message.service";
import {Observable, of} from "rxjs";
import {IJobResponse} from "../../../../../@core/model/job-response";
import * as _ from 'lodash';
import {catchError, map, tap} from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class JobResponseService {
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
    const url = `${this.baseUrl}/api/jobResponses/?${qstr}`;
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
}
