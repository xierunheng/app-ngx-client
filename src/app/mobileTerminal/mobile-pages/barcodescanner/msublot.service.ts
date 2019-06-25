import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from "../../../@core/data/message.service";
import {IMsubLot} from "../../../@core/model/msublot";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class MsubLotService {

  private baseUrl = "http://100.13.32.237:9000";

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ){

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
      console.error(error,123123123); // log to console instead

      // TODO: better jobOrder of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`MsubLotService: ${message}`);
  }

  /**
   * [通过oid查询msublot]
   * @param  {string}               oid [description]
   * @return {Observable<IMsubLot>}     [description]
   */
  getMsubLotByOid(oid: string): Observable<IMsubLot> {
    const url = this.baseUrl+`/api/materialSubLots/oid/${oid}`;
    return this.http.get<IMsubLot>(url,httpOptions)
      .pipe(
        tap(_ => this.log('fetched MsubLot by oid oid=${oid}')),
        catchError(this.handleError<IMsubLot>('getMsubLotByOid'))
      );
  }

}
