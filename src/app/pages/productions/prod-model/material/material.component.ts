import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { NbDialogService } from '@nebular/theme';

import * as _ from 'lodash';
import * as jsonpatch from 'fast-json-patch';

import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { MclassService } from '../../../../@core/data/mclass.service';
import { IMclass,Mclass  } from '../../../../@core/model/mclass';
import { MdefService } from '../../../../@core/data/mdef.service';
import { IMdef, Mdef, IMdefElite } from '../../../../@core/model/mdef';
import { UtilData, TableSettings } from '../../../../@core/data/util.service';

import { MaterialInfoComponent } from './material-info/material-info.component';
import { MclassInfoComponent } from './mclass-info/mclass-info.component';

@Component({
  selector: 'mes-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {
  mcs: IMclass[];

  settings = { ...TableSettings.basic };

  source: LocalDataSource = new LocalDataSource();

  //单选的 ngx-treeview
  singleConfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasCollapseExpand: false,
    hasFilter: true,
    decoupleChildFromParent: true,
    maxHeight: 1000
  });

  //查询条件
  query: any = {};

  //显示的类型, table or tree, default is tree
  showtype: string = 'mtree';

  mAsstree: any;

  /**
   * [当前页面是否在加载数据，
   *  1. true，显示加载图标；
   *  2. false，不显示加载图标]
   * @type {boolean}
   */
  loading: boolean = false;

  initSetting(): void {
    this.settings.mode = TableSettings.exMode;
    this.settings.columns = {
      oid: {
        title: '类型名称',
        type: 'string',
      },
      code: {
        title: '编码',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction:(hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      assClasss: {
        title: '装配项',
        type: 'string',
        valuePrepareFunction: (assClasss, row) => {
          return row.assClasss && row.assClasss.length > 0 ? row.assClasss.map(item => item.oid).join(',') : '';
        },
        filterFunction: (value, search) => {
          return value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
        }
      },
      assType: {
        title: '装配类型',
        type: 'string',
      },
      assRel: {
        title: '装配关系',
        type: 'string',
      },
    };
  }

  //树状呈现material
  mtree: TreeviewItem[];

/*  columns = {
      oid: {
        title: '类型名称',
        type: 'string',
      },
      code: {
        title: '编码',
        type: 'string',
      },
      desc: {
        title: '描述',
        type: 'string',
      },
      hs: {
        title: '层级结构',
        type: 'string',
        valuePrepareFunction:(hs, row) => {
          return row.hs ? `${row.hs.name} [${row.hs.level}]` : '';
        },
        filterFunction: (value, search) => {
          return (value.name && value.name.toString().toLowerCase().includes(search.toString().toLowerCase())) ||
          (value.level && value.level.toString().toLowerCase().includes(search.toString().toLowerCase()));
        }
      },
      assClasss: {
        title: '装配项',
        type: 'string',
        valuePrepareFunction: (assClasss, row) => {
          return row.assClasss && row.assClasss.length > 0 ? row.assClasss.map(item => item.oid).join(',') : '';
        },
        filterFunction: (value, search) => {
          return value.findIndex(v => (v.oid && v.oid.toString().toLowerCase().includes(search.toString().toLowerCase()))) >= 0;
        }
      },
      assType: {
        title: '装配类型',
        type: 'string',
      },
      assRel: {
        title: '装配关系',
        type: 'string',
      },
    };*/

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: MclassService,
    private mService: MdefService,
    private dialogServie: NbDialogService) {
    this.initSetting();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      this.query = _.cloneDeep(params);
      if(this.query['hs.path']) {
        this.query['hs.path'] = {$regex: this.query['hs.path']};
      }
      this.init();
    })
  }

  init() {
    this.loading = true;
    this.service.searchMclasssEncode(this.query).subscribe(mcs => {
        this.source.load(mcs);
        this.mcs = mcs;
        this.mtree = this.service.createMTree(mcs);
        this.mAsstree = this.service.createTree(mcs);
        this.loading = false;
      });
  }

  /**
   * [创建新的mclass]
   * @param {IMclass = undefined} mc [description]
   */
  createMc(mc: IMclass = undefined): void {
    this.dialogServie.open(MclassInfoComponent, {
      context: {
        title: `新建 物料类型`,
        model: mc || new Mclass()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.service.createMclass(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [创建新的material]
   * @param {IHierarchyScope = undefined} hs [description]
   */
  createM(p: IMdef = undefined): void {
    this.dialogServie.open(MaterialInfoComponent, {
      context: {
        title: `新建 物料定义`,
        model: p || new Mdef()
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        this.mService.createMdef(rn).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改hs]
   * @param {IMclass} mc [description]
   */
  editMc(mc: IMclass): void {
    let modelObserver = jsonpatch.observe(mc);
    console.log(mc.oid);
    this.dialogServie.open(MclassInfoComponent, {
      context: {
        title: `更新 [${mc.oid}] 信息`,
        model: mc
      },
    }).onClose.subscribe(rn => {
      if (rn) {
        let patch = jsonpatch.generate(modelObserver);
        this.service.patchMclass(mc._id, patch).subscribe(item => {
          this.init();
        })
      }
    });
  }

  /**
   * [修改mdef]
   * @param {IMdef} m [description]
   */
  editM(m: IMdefElite): void {
    this.mService.getMdef(m._id).subscribe(m => {
      let modelObserver = jsonpatch.observe(m);
      console.log(m);
      this.dialogServie.open(MaterialInfoComponent, {
        context: {
          title: `更新 [${m.oid}] 信息`,
          model: m,
        },
      }).onClose.subscribe(rn => {
        if (rn) {
          let patch = jsonpatch.generate(modelObserver);
          this.mService.patchMdef(m._id, patch).subscribe(item => {
            this.init();
          })
        }
      });

    })

  }

  /**
   * [删除mclass]
   * @param {IMclass} mc [description]
   */
  removeMc(mc: IMclass): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.service.deleteMclass(mc).subscribe(() => {
        this.init();
      });
    }
  }

  /**
   * [删除mdef]
   * @param {IMdef} m [description]
   */
  removeM(m: IMdef): void {
    if (window.confirm(UtilData.txtDeleteRowDes)) {
      this.mService.deleteMdef(m).subscribe(() => {
        this.init();
      });
    }
  }

  addItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.material.name) {
      //增加物料类型
      this.createMc();
    } else {
      let mdef = new Mdef();
      mdef.DeriveFromMclasses([item]);
      //增加物料
      this.createM(mdef);
    }
  }

  editItem(item): void {
    console.log(item);
    if (item === UtilData.systemObj.material.name) {

    } else if (item.mdefs) {
      //增加物料类型
      this.editMc(item);

    } else {
      //增加物料
      this.editM(item);
    }
  }

  removeItem(item): void {
    if (item === UtilData.systemObj.material.name) {

    } else if (item.mdefs) {
      //增加物料
      this.removeMc(item);
    } else {
      //增加物料类型
      this.removeM(item);
    }
  }

  onDelete(event): void {
      this.service.deleteMclass(event)
        .subscribe(() => {
          this.service.getMclasss()
            .subscribe(mclasss => {
              this.mtree = this.service.createMTree(mclasss);
            });
        });
  }

  onFilterChange(event): void {

  }

  onMCChange(event): void {

  }


}
