import { Injectable } from '@angular/core';

@Injectable()
export class CustomerService {

  data = [{
    oid: 'CQC',
    name: 'CQC',
    //name abbreviate
    addr: 'CZ',
    contact: '',
  }, {
    oid: 'DFD',
    name: 'DFD',
    addr: 'CZ',
    contact: '',
  }];

  getData() {
    return this.data;
  }
}
