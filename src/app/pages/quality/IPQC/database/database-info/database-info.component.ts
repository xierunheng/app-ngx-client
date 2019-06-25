import { Component, OnInit,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { TreeviewI18n, TreeviewItem } from 'ngx-treeview';
import { LocalDataSource } from 'ng2-smart-table';
import { MultiSelectI18n } from '../../../../multi-select-i18n';

import { GlobalData } from '../../../../../@core/model/global';
import { IParameter, Parameter } from '../../../../../@core/model/parameter';
import { ParameterService } from '../../../../../@core/data/parameter.service';
import { UtilData, TableSettings } from '../../../../../@core/data/util.service';
import { treeConfig, ViewConfig } from '../../../../../@core/utils/config';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-database-info',
  templateUrl: './database-info.component.html',
  styleUrls: ['./database-info.component.scss'],
  providers: [
    { provide: TreeviewI18n, useClass: MultiSelectI18n }
  ]
})
export class DatabaseInfoComponent implements OnInit {


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
    protected ref: NbDialogRef<DatabaseInfoComponent>) {
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
    this.ref.close(this.model);
  }
}
