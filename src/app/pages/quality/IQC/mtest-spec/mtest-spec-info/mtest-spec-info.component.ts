import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';
import { GlobalData } from '../../../../../@core/model/global';

import { TreeviewItem } from 'ngx-treeview';
import { IMTestSpec, MTestSpec } from '../../../../../@core/model/mtest-spec';
import { MTestSpecService } from '../../../../../@core/data/mtest-spec.service';
import { UtilData, IDCmpFn, TableSettings } from '../../../../../@core/data/util.service';
import { ViewConfig } from '../../../../../@core/utils/config';


@Component({
  selector: 'ngx-mtest-spec-info',
  templateUrl: './mtest-spec-info.component.html',
  styleUrls: ['./mtest-spec-info.component.scss']
})
export class MtestSpecInfoComponent implements OnInit {


  model: MTestSpec;
  modelObserver: any;

  //界面配置接口
  // vConfig: IViewConfig = new ViewConfig();
  vConfig: ViewConfig;

  // tree-select 的比较函数
  idCmpFn = IDCmpFn;

  tmcpColumns = {
    mclass: {
      title: '物料类型',
      type: 'string',
      valuePrepareFunction: (mclass, row) => {
        return row.mclass ? row.mclass.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    prop: {
      title: '检测项',
      type: 'string',
      valuePrepareFunction: (prop, row) => {
        return row.prop ? row.prop.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    }
  };

  tmdpColumns = {
    mdef: {
      title: '物料定义',
      type: 'string',
      valuePrepareFunction: (mdef, row) => {
        return row.mdef ? row.mdef.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    prop: {
      title: '检测项',
      type: 'string',
      valuePrepareFunction: (prop, row) => {
        return row.prop ? row.prop.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    }
  };

  tmlpColumns = {
    mlot: {
      title: '物料批次',
      type: 'string',
      valuePrepareFunction: (mlot, row) => {
        return row.mlot ? row.mlot.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    },
    prop: {
      title: '检测项',
      type: 'string',
      valuePrepareFunction: (prop, row) => {
        return row.prop ? row.prop.oid : '';
      },
      filterFunction: (value, search) => {
        return value && value.length > 0 &&
          value.oid && value.oid.toString().toLowerCase().includes(search.toString().toLowerCase());
      }
    }
  };

  //  propcolumns: any = TableSettings.resPropColumns;

  //属性项的标签
  tags: string[] = [UtilData.txtTags[3]];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private service: MTestSpecService) {
  }

  // array of Mclass, 物料类型
  get mcs() {
    return GlobalData.mcs;
  }

  get hstree() {
    return GlobalData.hstree;
  }

  ngOnInit(): void {
    //通过route的data区分新建数据和修改数据
    this.route.data.subscribe(data => {
      this.vConfig = ViewConfig.create(data.config);
      if (this.vConfig.type === UtilData.txtUpdateType) {
        this.route.params.switchMap((params: Params) =>
          this.service.getMTestSpec(params['mtsid'])).subscribe(item => {
            this.model = new MTestSpec(item);
            this.modelObserver = jsonpatch.observe(this.model);
          });
      } else {
        this.model = new MTestSpec();
      }
    });
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
    if (this.vConfig.type === UtilData.txtUpdateType) {
      let patch = jsonpatch.generate(this.modelObserver);
      this.service.patchMTestSpec(this.model._id, patch).subscribe(item => this.goBack());
    } else if (this.vConfig.type === UtilData.txtCreateType ||
      this.vConfig.type === UtilData.txtCreateByType) {
      this.service.createMTestSpec(this.model).subscribe(item => this.goBack());
    }
  }


}
