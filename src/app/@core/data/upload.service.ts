import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UploadService {
  constructor(private http: HttpClient,
    private messageService: MessageService) {
  }

  private baseUrl = '/api/upload';

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
    this.messageService.add(`UploadService: ${message}`);
  }

  /**
   * @param  {file}               [图片信息]
   * @return {Observable<any>}    [图片path]
   */
  uploadImage(img: any): Observable<any> {
     const url = `${this.baseUrl}/image`;
    return this.http
      .post(url, img)
      .pipe(
        tap(_ => this.log('fetcht uploadImage')),
        catchError(this.handleError('uploadImage'))
      )
  }

}
