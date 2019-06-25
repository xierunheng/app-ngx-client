import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import * as moment from 'moment';
import { UtilData, WorkData, MaterialData, IDCmpFn } from '../../../../../@core/data/util.service';
import { IMOpLog } from '../../../../../@core/model/base/oplog';
import { PersonService } from '../../../../../@core/data/person.service';
import { IPersonProfile } from '../../../../../@core/model/person';
import { IPsubProfile, PsubProfile} from '../../../../../@core/model/psub';
import { Terminal, IBodyOp } from '../../../../../@core/model/terminal';
// import { IProsegElite } from '../../../../@core/model/proseg';

@Component({
  selector: 'mes-wgmodal',
  templateUrl: './wgmodal.component.html',
  styleUrls: ['./wgmodal.component.scss']
})
export class WGModalComponent implements OnInit {
  //判断是 外购质检 或 外协质检
  op: IBodyOp;

  // like: {
  //    mold: IMOpLog,
  // }
  model: object;

  ops: IBodyOp[] = [];

  /**
   * [like {
   *   mold: IPersonProfile
   * }]
   * @type {object}
   */
  persons: object;

  constructor( protected activeModal: NgbActiveModal,
    private personService: PersonService) {
    this.ops = _.values(MaterialData.BodyOps)
      .filter(item => item.text==='mold' || item.url.startsWith('/terminals/jobOrder'));
    this.model = {};
    this.ops.forEach(op => {
      this.model[op.text] = {
        op: op.text,
        date: new Date(),
        psub: new PsubProfile(),
      };
    })
    console.log(this.model);
  }

  ngOnInit() {
    let hsPart: string = this.op.name.substr(0, 2);
    this.personService.getPersonsProfileBy({
      "hs.path": { 
        "$regex": hsPart, 
        "$options": "i"
      }
    }).subscribe(persons => {
      this.persons = {};
      this.ops.forEach(op => {
        this.persons[op.text] = persons.filter(item => item.pclass[0].oid === op.oper);
      })
    });
  }

  /**
   * [正常关闭Modal，返回对应的结果]
   */
  closeModal() {
    // _.forOwn(this.model, (value, key) => {
    //   value.psub.pclass = value.psub.person.pclass;
    //   value.psub.oid = value.psub.person.oid + moment(value.date).format('YYMMDD');
    //   value.psub.hs = value.psub.person.hs;
    // });
    this.activeModal.close(_.values(this.model));
  }

   /**
   * [异常关闭Modal, dismiss 该Modal ]
   */
  dismissModal() {
    this.activeModal.dismiss();
  }

}
