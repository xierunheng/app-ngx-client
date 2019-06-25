import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';
import { GlobalData } from '../../../../../@core/model/global';
import { UtilData, IDCmpFn, WorkData, TableSettings, winSize } from '../../../../../@core/data/util.service';
import { ViewConfig } from '../../../../../@core/utils/config';

import { IProseg, Proseg, IProsegElite } from '../../../../../@core/model/proseg';
import { ProsegService } from '../../../../../@core/data/proseg.service';

@Component({
  selector: 'mes-proseg-info',
  templateUrl: './proseg-info.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class ProsegInfoComponent implements OnInit {

  //已存在的 proseg
  prosegs: IProsegElite[];

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's ProcessSegmentSchema
  //model: IProseg;
  @Input() model: IProseg;

  modelObserver: any;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;
  ssize: string;

  // opType 的可选项
  opTypes: string[] = WorkData.opTypes;

  // array of duration unit
  tunits: string[] = UtilData.tuints;

  get hstree() {
    return GlobalData.hstree;
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: ProsegService,
    protected ref: NbDialogRef<ProsegInfoComponent>) {
  }

  ngOnInit(): void {
    //弹窗自适应大小
    this.ssize = winSize();

    //通过 route 的 data 区分新建数据和修改数据
    // this.route.data.subscribe(data => {
    //   this.vConfig = ViewConfig.create(data.config);
    //   this.isUpdate = this.vConfig.type === UtilData.txtUpdateType;
    //   this.route.params.subscribe(params => {
    //     if (this.isUpdate) {
    //       this.service.getProseg(params['psid']).subscribe(ps => {
    //         this.model = new Proseg(ps);
    //         if (params['subpsid']) {
    //           this.parent = this.model;
    //           this.model = new Proseg(ps.subPs.find(sub => sub._id === params['subpsid']));
    //         }
    //         this.modelObserver = jsonpatch.observe(this.model);
    //       })
    //     } else {
    //       if (params['psid']) {
    //         this.service.getProseg(params['psid']).subscribe(ps => {
    //           this.parent = new Proseg(ps);
    //         });
    //       }
    //       this.model = new Proseg();
    //     }
    //   })
    // });
  }

  onOidChange(event): void {
    if (!this.model.pubDate) {
      this.model.pubDate = new Date();
    }
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
    // if (this.parent) {
    //   if (this.vConfig.type === UtilData.txtUpdateType) {
    //     this.parent.subPs.splice(this.parent.subPs.findIndex(sp => sp._id === this.model._id), 1, this.model);
    //   } else {
    //     this.parent.subPs.push(this.model);
    //   }
    //   this.service.updateProseg(this.parent).subscribe(item => this.goBack());
    // } else {
    //   if (this.vConfig.type === UtilData.txtUpdateType) {
    //     this.service.updateProseg(this.model).subscribe(item => this.goBack());
    //     // let patch = jsonpatch.generate(this.modelObserver);
    //     // this.service.patchProseg(this.model._id, patch)
    //     //   .subscribe(item => this.goBack());
    //   } else if (this.vConfig.type === UtilData.txtCreateType) {
    //     this.service.createProseg(this.model).subscribe(item => this.goBack());
    //   }
    // }

  }

}
