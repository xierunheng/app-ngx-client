import { Directive, Input } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Observable } from "rxjs/Observable";
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/observable/timer';
// import 'rxjs/add/operator/distinctUntilChanged';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, timer} from 'rxjs';
import { catchError, map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';

export function groupExistsValidator(id: string, group: any, service: any): AsyncValidatorFn {
	return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
		return control.pristine || !control.value ? of(null) :
			timer(600).pipe(
					distinctUntilChanged(),
					switchMap(() => {
					group[id] = control.value;
					return service.exist(group).map(
						exist => {
							return exist ? { "groupExists": true } : null;
						});
					})
			)

	};
}

@Directive({
	selector: '[groupExists][formControlName],[groupExists][formControl],[groupExists][ngModel]',
	providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: GroupExistsValidatorDirective, multi: true }]
})
export class GroupExistsValidatorDirective implements AsyncValidator {
	@Input('id') id: string;
	@Input('group') group: any;
	@Input('service') service: any;

	validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
		return groupExistsValidator(this.id, this.group, this.service)(control);
	}
}

