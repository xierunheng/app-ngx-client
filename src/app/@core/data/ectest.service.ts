import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import * as _ from 'lodash';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { IECapTestSpecElite } from '../model/ectest-spec';
import { IECapTestElite, IECapTest, ECapTest } from '../model/ectest';
import { IEclass } from '../model/eclass';
import { IEquipment, IEquipmentElite } from '../model/equipment';
import { IExistService } from './common.service';

function handleError(err) {
  return Observable.throw(err.json().error || 'Server error');
}

@Injectable()
export class ECapTestService implements IExistService {
  constructor(private http: Http) {
  }

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private baseUrl = '/api/equipmentCapTests';

  /**
   * 获取所有的设备性能测试信息
   * @return {Observable<IECapTest[]>} [设备性能测试 Array]
   */
  getECapTests(): Observable<IECapTest[]> {
    return this.http.get(this.baseUrl)
      .map((res: Response) => res.json())
      .catch(handleError);
  }

  /**
   * 获取所有的设备性能测试关键信息
   * @return {Observable<IECapTestElite[]>} [设备性能测试关键信息Array]
   */
  getECapTestsElite(): Observable<IECapTestElite[]> {
    const url = `${this.baseUrl}/elite`;
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(handleError);
  }


  /**
   * 根据 _id 获取单个设备性能检测
   * @param  {string}            id [设备性能检测的_id]
   * @return {Observable<IECapTest>}    [单个设备性能检测]
   */
  getECapTest(id: string): Observable<IECapTest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(handleError);
  }


  /**
   * [判断设备性能检测是否存在，根据 field 和 value]
   * @param  {any}              value [description]
   * @return {Observable<void>}       [description]
   */
  exist(query: any): Observable<boolean> {
    const url = `${this.baseUrl}/exist`;
    return this.http
      .post(url, query)
      .map((res: Response) => res.status === 204)
      .catch(handleError);
  }

  /**
   * [判断设备性能检测是否存在，根据 field 和 value]
   * @param  {string}           field [description]
   * @param  {any}              value [description]
   * @return {Observable<void>}       [description]
   */
  existField(field: string, value: any): Observable<boolean> {
    let body = {};
    body[field] = value;
    return this.exist(body);
  }

  /**
   * 在数据库中，创建新的设备性能检测
   * @param  {IECapTest}             mt [待创建的设备性能检测]
   * @return {Observable<IECapTest>}    [新创建的设备性能检测]
   */
  createECapTest(ecapt: IECapTest): Observable<IECapTest> {
    return this.http
      .post(this.baseUrl, ecapt)
      .map((res: Response) => res.json())
      .catch(handleError);
  }

  /**
   * 在数据库中，更新某个设备性能检测信息
   * @param  {IECapTest}             ml [待更新的设备性能检测]
   * @return {Observable<IECapTest>}    [更新后的设备性能检测]
   */
  updateECapTest(ecapt: IECapTest): Observable<IECapTest> {
    const url = `${this.baseUrl}/${ecapt._id}`;
    return this.http
      .put(url, ecapt)
      .map((res: Response) => res.json())
      .catch(handleError);
  }

  patchECapTest(id: string, patch: any): Observable<IECapTest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .patch(url, patch)
      .map((res: Response) => res.json())
      .catch(handleError);
  }


  /**
   * 在数据库中，删除某个设备性能检测
   * @param  {IECapTest}            mt [description]
   * @return {Observable<void>}    [description]
   */
  deleteECapTest(ecapt: IECapTest): Observable<IECapTest> {
    const url = `${this.baseUrl}/${ecapt._id}`;
    return this.http.delete(url)
      .map(() => ecapt)
      .catch(handleError);
  }

}


