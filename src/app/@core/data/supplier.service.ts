import { Injectable } from '@angular/core';

@Injectable()
export class SupplierService {

  //设备的供应商
  data = [{
    oid: '传奇',
    //name abbreviate
    code: 'CG',
  }, {
    oid: 'DR',
    code: 'DR',
  }];

  //工装类型的生产厂家
  Mfacturedata = [{
    oid: '施耐德',
    //name abbreviate
    code: 'schneider',
  }, {
    oid: '西门子',
    code: 'SIEMENS',
  }];

  getData() {
    return this.data;
  }

  getMfactureData() {
    return this.Mfacturedata;
  }
}
