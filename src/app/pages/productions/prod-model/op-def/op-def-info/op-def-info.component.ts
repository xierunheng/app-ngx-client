import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NbDialogRef } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../../@core/model/global';
import { ViewConfig } from '../../../../../@core/utils/config';

import { UtilData, IDCmpFn, OIDCmpFn, WorkData, TableSettings, winSize } from '../../../../../@core/data/util.service';
import { IOpDef, OpDef, IOpsegProfile, Opseg, OpMBill } from '../../../../../@core/model/op-def';
import { OpDefService } from '../../../../../@core/data/op-def.service';
import { IProsegElite } from '../../../../../@core/model/proseg';
import { ProsegService } from '../../../../../@core/data/proseg.service';

@Component({
  selector: 'mes-op-def-info',
  templateUrl: './op-def-info.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],

})
export class OpDefInfoComponent implements OnInit {

  //工艺段下拉列表
  pss: IProsegElite[];

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  // copied from server's OpDefinitionSchema
  //model: IOpDef;
  @Input() model: IOpDef;

  //界面配置接口
  vConfig: ViewConfig;

  // opType 的可选项
  opTypes: string[] = WorkData.opTypes;

  //hs 的比较函数
  idCmpFn = IDCmpFn;

  oidCmpFn = OIDCmpFn;

  proseg: any[];

  // [opseg's oid ,方便 首工序 尾工序的 下拉可选项]
  osOids: any[];
  ssize: string;

  get oidver() {
    return {
      oid: this.model.oid,
      ver: this.model.ver
    };
  }

  get hstree() {
    return GlobalData.hstree;
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: OpDefService,
    private psService: ProsegService,
    protected ref: NbDialogRef<OpDefInfoComponent>) {

  }


  initOsOids() {
    this.proseg = this.model.opseg.map(os => os.proseg);
    this.osOids = this.model.opseg.map(os => {
      return {
        _id: os._id,
        oid: os.oid
      };
    });
  }

  ngOnInit(): void {
    //弹窗自适应大小
    this.ssize = winSize();

    this.psService.getProsegsElite().subscribe(pss => {
      this.pss = pss;
      //通过 route 的 data 区分新建数据和修改数据
      // this.route.data.subscribe(data => {
      //   this.vConfig = ViewConfig.create(data.config);
      //   if (this.vConfig.type === UtilData.txtUpdateType) {
      //     this.route.params.switchMap((params: Params) =>
      //       this.service.getOpDefinition(params['opdid'])).subscribe(item => {
      //         this.model = new OpDef(item);
      //         this.initOsOids();
      //         this.modelObserver = jsonpatch.observe(this.model);
      //       });
      //   }
      //   else {
      //     this.model = new OpDef();
      //   }
      // });
    });
  }

  /**
   * [当选择的 proseg 发生变化时，从其中继承相关的属性，特别是 opseg & opmb ]
   * @param {[type]} items [description]
   */
  onPsChange(items): void {
    if (items && items.length > 0) {
      let psids = items.map(item => item._id);
      this.psService.getManyProsegs(psids).subscribe(pss => {
        this.model.opseg = pss.map(ps => {
          let os = new Opseg();
          os.DeriveFromProseg(ps);
          return os;
        });
        this.model.opmb = pss.map(ps => {
          let opmb = new OpMBill();
          opmb.DeriveFromProseg(ps);
          return opmb;
        });

        this.initOsOids();
      });
    } else {
      this.model.opseg = [];
      this.model.opmb = [];
      this.initOsOids();
    }
  }

  onFirstSegChange(event) {
    this.model.firstSeg = event;
  }

  /**
   * [当操作段选择发生变化是，自动更新操作段规格的内容
   * @param {any[]} selItems [description]
   */
  onSelectedChange(selItems: IProsegElite[]): void {
  }

  /**
   * [在更新状态下，如果版本发生变化，默认操作时在当前def的基础上，创建新的def]
   * @param {[type]} items [description]
   */
  onVerChange(items): void {
    if (this.vConfig.type === UtilData.txtUpdateType) {
      this.vConfig.type = UtilData.txtCreateType;
      this.vConfig.buttonText = UtilData.txtNew;
      this.onPsChange(this.proseg);
      if (this.model._id) {
        Reflect.deleteProperty(this.model, '_id');
      }
      //新版本的def的发布时间，为当前时间
      this.model.pubDate = new Date();
    }
  }

  cancel(): void {
    this.ref.close();
  }

  onSubmit(value: any): void {
    this.ref.close(this.model);
    // if (this.vConfig.type === UtilData.txtUpdateType) {
    //   let patch = jsonpatch.generate(this.modelObserver);
    //   if (patch.findIndex(p => /\d/.test(p.path)) >= 0) {
    //     this.service.updateOpDefinition(this.model).subscribe(item => this.goBack());
    //   }else{
    //     this.service.patchOpDefinition(this.model._id, patch).subscribe(item => this.goBack());
    //   }
    // } else if (this.vConfig.type === UtilData.txtCreateType) {
    //   console.log(this.model);
    //   this.service.createOpDefinition(this.model).subscribe(item => this.goBack());
    // }
  }

}
