import { Directive, Input } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Observable } from "rxjs/Observable";
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/observable/timer';
// import 'rxjs/add/operator/distinctUntilChanged';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';

export function fieldExistsValidator(id: string, service: any): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.pristine || !control.value ? of(null) :
      timer(600).pipe(
        distinctUntilChanged(),
        switchMap(() => {
          return service.existField(id, control.value).pipe(
            map(exist => { return exist ? { "fieldExists": true } : null }),
            catchError(() => null)
          );
        })
      )
      };
}

@Directive({
  selector: '[fieldExists][formControlName],[fieldExists][formControl],[fieldExists][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: FieldExistsValidatorDirective, multi: true }]
})
export class FieldExistsValidatorDirective implements AsyncValidator {
  @Input('id') id: string;
  @Input('service') service: any;

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return fieldExistsValidator(this.id, this.service)(control);
  }
}

