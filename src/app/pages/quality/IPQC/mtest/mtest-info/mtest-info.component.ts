import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../../@core/model/global';

import { TreeviewItem } from 'ngx-treeview';
import { ITestResult, TestResult, IResult, Result } from '../../../../../@core/model/common';
import { IMTest, MTest } from '../../../../../@core/model/mtest';
import { MTestService } from '../../../../../@core/data/mtest.service';
import { IMTestSpecElite, MTestSpec } from '../../../../../@core/model/mtest-spec';
import { MTestSpecService } from '../../../../../@core/data/mtest-spec.service';
import { MlotService } from '../../../../../@core/data/mlot.service';
import { MsubLotService } from '../../../../../@core/data/msublot.service';
import { UtilData, IDCmpFn, TableSettings } from '../../../../../@core/data/util.service';
import { ViewConfig } from '../../../../../@core/utils/config';


@Component({
  selector: 'ngx-mtest-info',
  templateUrl: './mtest-info.component.html',
  styleUrls: ['./mtest-info.component.scss']
})
export class MtestInfoComponent implements OnInit {


  model: MTest;
  modelObserver: any;

  //界面配置接口
  // vConfig: IViewConfig = new ViewConfig();
  vConfig: ViewConfig;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  propcolumns: any = TableSettings.resPropColumns;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[3]];

  //可供选择的的物料检测规格
  mtSpecs: IMTestSpecElite[];

  /**
   * [简写]
   * @type {[type]}
   */
  objectKeys = Object.keys;

  strSplit = _.split;
  imgFiles: any[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: MTestService,
    private mtsService: MTestSpecService,
    private mlService: MlotService,
    private mslService: MsubLotService) {
  }

  // array of Mclass, 物料类型
  get mcs() {
    return GlobalData.mcs;
  }

  get hstree() {
    return GlobalData.hstree;
  }

  //检验配套项
  testContext: any;

  //检验参数项
  testParas: any;

  ngOnInit(): void {
    //通过route的data区分新建数据和修改数据
    this.route.data.subscribe(data => {
      this.vConfig = ViewConfig.create(data.config);
      this.mtsService.getMTestSpecsElite().subscribe(items => {
        this.mtSpecs = items;
        if (this.vConfig.type === UtilData.txtUpdateType) {
          this.route.params.switchMap((params: Params) =>
            this.service.getMTest(params['mtid'])).subscribe(item => {
              this.model = new MTest(item);
              this.modelObserver = jsonpatch.observe(this.model);
            });
        } else {
          this.model = new MTest();
        }
      });
    });
  }

  /**
   * [当物料检测规格 发生变化后，需要执行的操作]
   * @param {[type]} event [description]
   */
  onMtSpecChange(event): void {
    this.mtsService.getMTestSpec(this.model.mtSpec._id).subscribe(item => {
      this.service.getNextOid(item.oid).subscribe(oid => {
        this.model.desc = item.desc;
        this.model.hs = item.hs;
        this.model.loc = item.loc;
        this.model.oid = oid;
        this.model.prop = GlobalData.paras.filter(para => item.testedMclassProp.findIndex(item => item.prop.oid === para.oid) >= 0 ||
          item.testedMdefProp.findIndex(item => item.prop.oid === para.oid) >= 0 ||
          item.testedMlotProp.findIndex(item => item.prop.oid === para.oid) >= 0);
        this.model.prop.forEach(p => {
          p.testSpec = [this.model.mtSpec];
          let tr = new TestResult();
          let result = new Result();
          result.unit = p.value.unit;
          tr.result = [result];
          p.testResult = [tr];
        });
        this.testContext = _.keyBy(this.model.prop.filter(p => p.tags.includes('检测配套')), 'oid');
        this.testParas = _.keyBy(this.model.prop.filter(p => p.tags.includes('物料检测') && !p.tags.includes('检测配套')), 'oid');
        console.log(this.testContext);
        console.log(this.testParas);
      });
    });
  }

  /**
   * [当物料批次发生变化时，需要更新 testResult 的 oid]
   * @param {[type]} event [description]
   */
  onLotOidChange(event): void {
    console.log(this.model.mlot);
    this.mlService.getMlotBy({ oid: this.model.mlot.oid }).subscribe(mlot => {
      this.model.mlot = mlot;
      this.model.prop.forEach(p => {
        p.testResult[0].oid = this.model.mlot.oid + p.oid;
      });
    })
  }

  /**
   * [当物料子批次发生变化时，需要更新 testResult 的 oid]
   * @param {[type]} event [description]
   */
  onSublotOidChange(event): void {
    console.log(this.model.msublot);
    this.mslService.getMsubLotBy({ oid: this.model.msublot.oid }).subscribe(msublot => {
      this.model.msublot = msublot;
      this.model.prop.forEach(p => {
        p.testResult[0].oid = this.model.msublot.oid + p.oid;
      });
    })
  }

  /**
   * @param {[type]} event [description]
   */
  onDelete(event): void {
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(value: any): void {
    console.log(this.model);
    if (this.vConfig.type === UtilData.txtUpdateType) {
      let patch = jsonpatch.generate(this.modelObserver);
      this.service.patchMTest(this.model._id, patch).subscribe(item => this.goBack());
    } else if (this.vConfig.type === UtilData.txtCreateType ||
      this.vConfig.type === UtilData.txtCreateByType) {
      this.service.createMTest(this.model).subscribe(item => {
        if(this.model.mlot.oid) {
          let mlot: any = this.model.mlot;
          this.model.prop.forEach(p => {
            mlot.prop.push(p);
          });
          this.mlService.updateMlot(mlot).subscribe(ml => this.goBack());
        } else if (this.model.msublot.oid) {
          let msublot: any = this.model.msublot;
          this.model.prop.forEach(p => {
            msublot.prop.push(p);
          });
          this.mslService.updateMsubLot(msublot).subscribe(msl => this.goBack());
        }
      });
    }
  }
  getDa(event){
    console.log("ss");
    console.log(event);
  }

}

