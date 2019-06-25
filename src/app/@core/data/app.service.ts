import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {IHierarchyScope} from "../model/hs";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/internal/operators/tap";
import {catchError} from "rxjs/operators";
import {MessageService} from "./message.service";

@Injectable()
export class AppService{
  private baseUrl = "http://100.13.32.237:9000";
  constructor(
    private http:HttpClient,
    private messageService: MessageService,
  ){}

  createRequestHeader(){
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return headers;
  }

  /**
   * 获取所有的层级信息
   * @return {Observable<IHierarchyScope[]>} [层级信息 Array]
   */
  getHss(field: string = '', sort: string = 'path'): Observable<IHierarchyScope[]> {
    const url = `${this.baseUrl}/api/hierarchyScopes/?field=${field}&sort=${sort}`;
    return this.http.get<IHierarchyScope[]>(url)
      .pipe(
        tap(_ => this.log('fetched hss')),
        catchError(this.handleError('getHss', []))
      );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HsService: ${message}`);
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
}
