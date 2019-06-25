import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import * as _ from 'lodash';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' })
};

@Injectable()
export class SmsService {
	private account: string = 'cqtc';
	private pwd: string = 'a4bb0731856bdde717c35ebda';
	private signId: string ='62089';
  private data = {
    'Account': 'cqtc',
    'Pwd': 'a4bb0731856bdde717c35ebda',
    'Content': '',
    'Mobile': '',
    'SignId': '62089'
  };

  constructor(private http: HttpClient,
    private messageService: MessageService) {

  }

  private baseUrl = '/api/smss';
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
    this.messageService.add(`SmsService: ${message}`);
  }

  /**
   * [send description]
   * @param  {string}          mobile  [description]
   * @param  {string}          content [description]
   * @return {Observable<any>}         [format like this:]
   * {
	    "Code":0,
	    "Message":"OK",
	    "SendId":"2016072909264497197473179",
	    "InvalidCount":0,
	    "SuccessCount":1,
	    "BlackCount":0
		}
   */
  send(mobile: string, content: string): Observable<any> {
  	this.data.Mobile = mobile;
  	this.data.Content = content;
  	const url = `${this.baseUrl}/send`;
    return this.http
      .post(url, this.data, httpOptions)
      .pipe(
        tap(_ => this.log('fetcht send')),
        catchError(this.handleError('send'))
      )
  }

}
