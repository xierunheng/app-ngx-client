import { Observable } from 'rxjs/Observable';

/**
 * 该 Interface 保证相应的 Service 都具备 exist 方法，
 * 该方法用于判断 某个字段在数据库中是否存在
 */
export interface IExistService {
  existField(field: string, value: any): Observable<boolean>;

}
