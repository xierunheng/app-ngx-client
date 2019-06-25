import { Component, OnInit,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { NbDialogRef } from '@nebular/theme';

import { TreeviewI18n, TreeviewItem } from 'ngx-treeview';
import { LocalDataSource } from 'ng2-smart-table';
import { MultiSelectI18n } from '../../../../multi-select-i18n';

import { GlobalData } from '../../../../../@core/model/global';
import { IParameter, Parameter } from '../../../../../@core/model/parameter';
import { ParameterService } from '../../../../../@core/data/parameter.service';
import { UtilData, TableSettings } from '../../../../../@core/data/util.service';
import { treeConfig, ViewConfig } from '../../../../../@core/utils/config';


@Component({
  selector: 'mes-para-info',
  templateUrl: './para-info.component.html',
  styleUrls: ['./para-info.component.scss'],
  providers: [
    { provide: TreeviewI18n, useClass: MultiSelectI18n }
  ]
})
export class ParaInfoComponent implements OnInit {

  @Input() title: string;

  // this model is nothing but for [(ngModel)]
  //属性项的model
  @Input() model: Parameter = new Parameter();
  // model: Parameter;
  //为patch创建的观察
  modelObserver: any;

  //界面配置项
  vConfig: ViewConfig;

  parasSettings = _.cloneDeep(TableSettings.basic);

  parasSource: LocalDataSource = new LocalDataSource();

  tagtree: TreeviewItem[];

  //多选的 ngx-treeview
  multiConfig = treeConfig.multi;

  //该函数用于标示该 parameter 是否为标签属性
  get isTag(): boolean {
    return this.service.isTag(this.model);
  }

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: ParameterService,
    protected ref: NbDialogRef<ParaInfoComponent>) {
    this.initSetting();
  }

  initSetting(): void {
    this.parasSettings.mode = TableSettings.exMode;
    this.parasSettings.actions.delete = false;
    this.parasSettings.columns = {
      oid: {
        title: '属性名称',
        type: 'string',
      },
    };
  }

  ngOnInit() {
    this.tagtree = this.service.tagTree(GlobalData.paras.filter(para => para.oid === 'tag' || para.tags.includes('tag')).map(para => para.oid),false,this.model.tags);
    // this.route.data
    //   .subscribe(data => {
    //     console.log(data);
    //     this.vConfig = ViewConfig.create(data.config);
    //     if (this.vConfig.type === UtilData.txtUpdateType) {
    //       this.route.params.switchMap((params: Params) =>
    //         this.service.getParameter(params['paraid'])).subscribe(item => {
    //           console.log(item);
    //           this.model = new Parameter(item);
    //           console.log(this.model);
    //           this.modelObserver = jsonpatch.observe(this.model);
    //           this.tagtree = this.service.tagTree(GlobalData.paras.filter(para =>
    //             para.oid === 'tag' || para.tags.includes('tag')).map(para => para.oid), false, this.model.tags);
    //           if (this.service.isTag(this.model)) {
    //             this.service.getParametersBy({ tags: this.model.oid })
    //               .subscribe(paras => {
    //                 this.parasSource.load(paras);
    //               });
    //           }
    //         });
    //     } else if (this.vConfig.type === UtilData.txtCreateByType) {
    //       this.route.params.switchMap((params: Params) =>
    //         this.service.getParameter(params['paraid'])).subscribe(item => {
    //           this.model = new Parameter();
    //           this.model.tags.push(item.oid);
    //           console.log(this.model);
    //           this.vConfig.title = this.vConfig.title.replace(UtilData.txtReplace, item.oid);
    //           this.tagtree = this.service.tagTree(GlobalData.paras.filter(para =>
    //             para.oid === 'tag' || para.tags.includes('tag')).map(para => para.oid), false, this.model.tags);
    //         });
    //     }
    //   });
  }

  cancel(): void {
    // this.location.back();
    this.ref.close();
  }


  onParaCreate(event): void {
    this.router.navigate(['../newby/', this.model._id], { relativeTo: this.route });
  }

  onParaEdit(event): void {
    this.router.navigate(['../', event.data._id], { relativeTo: this.route });
  }

  /**
   * 当标签选择发生变化时
   * @param {IMdefElite[]} selItems [description]
   */
  onSelectedChange(selItems: string[]): void {
    this.model.tags = selItems;
  }

  onSubmit(value: any): void {
    // if (this.vConfig.type === UtilData.txtUpdateType) {
    //   let patch = jsonpatch.generate(this.modelObserver);
    //   this.service.patchParameter(this.model._id, patch)
    //     .subscribe(item => this.cancel());
    // } else if (this.vConfig.type === UtilData.txtCreateType ||
    //   this.vConfig.type === UtilData.txtCreateByType) {
    //   this.service.createParameter(this.model)
    //     .subscribe(item => this.cancel());
    // }
    this.ref.close(this.model);
  }
}
